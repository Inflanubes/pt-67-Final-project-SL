import { bicycle } from "@cloudinary/url-gen/qualifiers/focusOn";
import { image } from "@cloudinary/url-gen/qualifiers/source";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			user_id: null,
			userInfo: "",
			message: null,
			token: "",
			registerInputLength: 1,
			photo: [
				{
					helmet: "",
					bicycle: "",
					price: "",
					url: ""
				}
			],
			riderPhoto: [
				{
					url: "",
				}
			],
			url: [],
			helmet: [],
			bicycle: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
		},

		actions: {
			login: async (email, password) => {
				const store = getStore()
				try {
					let response = await fetch(process.env.BACKEND_URL + "api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"email": email,
							"password": password
						})
					})

					if (!response.ok) throw new Error("Login failed");

					const data = await response.json();
					if (data.access_token) {
						localStorage.setItem("token", data.access_token);
						localStorage.setItem("user_id", data.additional_claims?.user_id);
						//localStorage.setItem("role", data.additional_claims?.role);
						setStore({ token: data.access_token, user_id: data.additional_claims?.user_id });
						console.log("data login", data)
					}
					return data

				} catch (error) {
					return false
				}
			},
			// deleteUser: async(token)=> {
			// 	try {
			// 		let response = await fetch(`${process.env.BACKEND_URL}api/users/user/${localStorage.getItem("user_id")}`, {
			// 			method: "GET",
			// 			headers: {
			// 				'Authorization': 'Bearer ' + token 
			// 			}
			// 		})	
			// 		const data = await response.json()
			// 		setStore({user: data.data})
			// 		return
			// 	} catch (error) {

			// 	}
			// },
			logout: async () => {

				// localStorage.removeItem('token');
				// localStorage.removeItem("user_id", data.additional_claims?.user_id);
				setStore({ token: "" })
			},

			register: async (email, password, username, name, surname, role, bike, helmet) => {
				try {
					let response = await fetch(process.env.BACKEND_URL + "api/register", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"email": email,
							"password": password,
							"username": username,
							"name": name,
							"surname": surname,
							"role": role,
							"bike": bike,
							"helmet": helmet
						})
					})

					const data = await response.json()
					localStorage.setItem("token", data.access_token);
					setStore({ token: data.access_token })

					return data

				} catch (error) {
					return false
				}
			},

			getUserInfo: async () => {
				const store = getStore()
				const token = localStorage.getItem("token")
				try {
					const response = await fetch(
						process.env.BACKEND_URL + "api/userinfo",
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${token}`, // Reemplazar 'token' con el token JWT del usuario
							},
						}
					);
					if (response.ok) {
						const data = await response.json();
						setStore({ userInfo: data, user_id: data.id })
						//setStore({ isUserLogged: true })
						return String(data.id);
						// setIsUserLogged(true);
					} else {
						throw new Error("Failed to fetch user info");
					}
				} catch (error) {
					console.error("[flux.getUserInfo] Error fetching user info:", error);
				}
			},

			uploadPhoto: async (url, price, user_id, bicycle, helmet) => {
				const token = localStorage.getItem("token")
				try {
					let response = await fetch(process.env.BACKEND_URL + "api/photos", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({
							"url": url,
							"price": price,
							"user_id": user_id,
							"bicycle": bicycle,
							"helmet": helmet,
						})
					});

					const data = await response.json();
					if (data && data.photo) {
						localStorage.setItem("photo", JSON.stringify(data.photo));
						setStore({ photo: data.photo });
						console.log("datos bici", data.photo)
					}

					return data;
				} catch (error) {
					console.error("Error uploading photo:", error);
					return false;
				}
			},

			azurePredict: async (url) => {
				const myHeaders = new Headers();
				myHeaders.append("Prediction-Key", process.env.PREDICTION_KEY);
				myHeaders.append("Content-Type", "application/json");
			
				const raw = JSON.stringify({ "Url": url });
			
				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};
			
				try {
					const response = await fetch(process.env.AZURE_URL, requestOptions);
			
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
			
					const data = await response.json();
					console.log("Azure response:", data);
			
					if (!data || !data.predictions) {
						throw new Error("Respuesta de Azure malformada. Falta 'predictions'.");
					}
			
					// Mapa para modelos de bicicletas y cascos
					const bikeModels = {
						"Bike Cannondale Jekyll 2": "cannondaleJekyll2",
						"Bike Commencal Supreme V5 Ohlins Edition": "comSupV5",
						"Bike Kona Process 153": "kona",
						"Bike Mondraker Summun 21": "summun21",
						"Bike Orbea Rallon Morado-Azul": "orbeaRallon",
						"Bike Santa Cruz Nomad 4": "santaCruz",
						"Bike Trek Session": "trekSession"
					};
			
					const helmetModels = {
						"Helmet Scott Spartan": "scott",
						"Helmet Fox Rampage Azul": "foxRampageAzul",
						"Helmet Fox Rampage Custom Ibai Rider": "foxRampageCustom",
						"Helmet Bluegrass Legit White Iridiscent": "bluegrassLegit",
						"Helmet Fox Rampage Pro Carbon": "foxRampageProCarbon",
						"Helmet Troy Lee Stage": "troyLee",
						"Helmet Poc Coron Air Negro": "pocCoronAirNegro"
					};
			
					// Inicializar el mejor resultado para cada categoría
					let bestTags = {
						bicycle: { tagName: "", probability: 0 },
						helmet: { tagName: "", probability: 0 }
					};
			
					// Recorrer las predicciones para encontrar el mejor resultado por categoría
					data.predictions.forEach(prediction => {
						// Categoría bicicleta
						if (prediction.tagName.toLowerCase().includes("bike")) {
							if (prediction.probability > bestTags.bicycle.probability) {
								bestTags.bicycle = prediction;
							}
						}
			
						// Categoría casco
						if (prediction.tagName.toLowerCase().includes("helmet")) {
							if (prediction.probability > bestTags.helmet.probability) {
								bestTags.helmet = prediction;
							}
						}
					});
			
					// Mapear los nombres de los modelos
					const mappedBicycle = bikeModels[bestTags.bicycle.tagName] || "custom";
					const mappedHelmet = helmetModels[bestTags.helmet.tagName] || "custom";
			
					// Almacenar los resultados finales
					setStore({ bicycle: mappedBicycle, helmet: mappedHelmet });
			
					// Log de resultados
					console.log("Bicycle:", mappedBicycle);
					console.log("Helmet:", mappedHelmet);
			
					// Datos finales
					const azureData = {
						bicycle: mappedBicycle,
						helmet: mappedHelmet
					};
			
					return azureData;
			
				} catch (error) {
					console.error("Error en azurePrediction:", error);
					return null; // Retornar null en caso de error
				}
			},
			
			

			// azurePredict: async (url) => {
			// 	const myHeaders = new Headers();
			// 	myHeaders.append("Prediction-Key", process.env.PREDICTION_KEY);
			// 	myHeaders.append("Content-Type", "application/json");

			// 	const raw = JSON.stringify({ "Url": url });

			// 	const requestOptions = {
			// 		method: "POST",
			// 		headers: myHeaders,
			// 		body: raw,
			// 		redirect: "follow"
			// 	};

			// 	try {
			// 		const response = await fetch(process.env.AZURE_URL, requestOptions);

			// 		if (!response.ok) {
			// 			throw new Error(`HTTP error! Status: ${response.status}`);
			// 		}

			// 		const data = await response.json();
			// 		console.log("Azure response:", data);

			// 		if (!data || !data.predictions) {
			// 			throw new Error("Respuesta de Azure malformada. Falta 'predictions'.");
			// 		}

			// 		// Start values for each tag group
			// 		let bestTags = {
			// 			'bicycle': { tagName: "", probability: 0 },
			// 			'helmet': { tagName: "", probability: 0 }
			// 		};

			// 		// Threshold for probability
			// 		const probabilityThreshold = 0.90;

			// 		// Read predictions
			// 		data.predictions.forEach(prediction => { //forEach recorre el array
			// 			if (prediction.probability > probabilityThreshold) { // se verifica si la probabilidad es superior al umbral 
			// 				// Check and update best tag for bicycle category, confirmamos si contiene las palabras kona o santa cruz y lo convierte a minusculas (tolowerCase)
			// 				if (prediction.tagName.toLowerCase().includes('santa cruz') || prediction.tagName.toLowerCase().includes('kona')) {
			// 					if (prediction.probability > bestTags['bicycle'].probability) {
			// 						bestTags['bicycle'] = prediction;
			// 					}
			// 				}

			// 				// Check and update best tag for helmet category
			// 				if (prediction.tagName.toLowerCase().includes('scott') || prediction.tagName.toLowerCase().includes('troy lee')) {
			// 					if (prediction.probability > bestTags['helmet'].probability) {
			// 						bestTags['helmet'] = prediction;
			// 					}
			// 				}
			// 			}
			// 		});

			// 		// Storing results
			// 		const store = {
			// 			bicycle: bestTags['bicycle'].tagName ? bestTags['bicycle'].tagName : 'No valid bicycle prediction',
			// 			helmet: bestTags['helmet'].tagName ? bestTags['helmet'].tagName : 'No valid helmet prediction'
			// 		};
			// 		if (store.bicycle === 'Santa Cruz Nomad 4') {
			// 			// Si el valor es 'Santa Cruz Nomad 4', se establece como 'santaCruz'
			// 			setStore({ bicycle: 'santaCruz' });
			// 		} else if (store.bicycle === 'Kona Process 153') {
			// 			// Si el valor es 'Kona Process 153', se establece como 'kona'
			// 			setStore({ bicycle: 'kona' });
			// 		} else if (store.bicycle === 'No valid bicycle prediction') {
			// 			// Si el valor es 'No valid bicycle prediction', se establece como 'custom'
			// 			setStore({ bicycle: 'custom' });
			// 		};

			// 		if (store.helmet === 'Scott Spartan') {
			// 			setStore({ helmet: 'scott' });
			// 		} else if (store.helmet === 'Troy Lee Stage') {
			// 			setStore({ helmet: 'troyLee' });
			// 		} else if (store.helmet === 'No valid bicycle prediction') {
			// 			setStore({ helmet: 'custom' });
			// 		};

			// 		// Log results
			// 		console.log('Store:', store);
			// 		console.log("helmet", getStore().helmet)
			// 		console.log("bicycle", getStore().bicycle)

			// 		const azureData = {
			// 			bicycle: getStore().bicycle,
			// 			helmet: getStore().helmet
			// 		};
			// 		// Return values find
			// 		return azureData;

			// 	} catch (error) {
			// 		console.error("Error en azurePrediction:", error);
			// 		return null; // Return null if error
			// 	}
			// },

			getRiderPhotos: async (bicycle, helmet) => {
				// const data = await response.json()
				// const user_id = localStorage.getItem(data.additional_claims?.user_id)
				const token = localStorage.getItem("token")
				// const formData = new FormData()
				// 	formData.append('user_id', user_id)
				// 	console.log("user", user_id)

				let response = await fetch(process.env.BACKEND_URL + "api/photos/rider", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					},
					body: JSON.stringify({
						"bicycle": bicycle,
						"helmet": helmet,
					}),
				})

				const data = await response.json();


				if (response.ok) {
					setStore({ riderPhoto: data.data || [] }); // Asegúrate de que 'data.data' es un array
					localStorage.setItem("riderPhoto", JSON.stringify(data.data));

					const fotoData = {
						bicycle: getStore().riderPhoto,
					};
					console.log(fotoData)

					return data.data;
				} else {
					console.log(data.msg);
					setStore({ riderPhoto: [] });
					return null;
				}
			},

			clearRiderPhotos: () => {
				setStore({
					riderPhoto: [],
				});
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
