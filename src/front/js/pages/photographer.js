import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/photographer.css";
import { saturation } from '@cloudinary/url-gen/actions/adjust';

export const Photographer = () => {
    const { store, actions } = useContext(Context);
    const [url, setUrl] = useState("");
    const [bicycle, setBicycle] = useState('');
    const [helmet, setHelmet] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState('');
    const user_id = store.user_id;
    const [previousUrl, setPreviousUrl] = useState("");


    const navigate = useNavigate();

    /*  useEffect(() => {
         if (!store.token) {
             navigate('/')
         }
     }, []) */

    console.log(user_id)
    console.log(store.userInfo)


    /*https://www.youtube.com/watch?v=b5-TEugeyuI el link del video de como implementar cloudinary */

    const changeUploadImage = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        console.log("hi1", e)

        const cdata = new FormData();
        cdata.append("file", file);
        cdata.append("upload_preset", process.env.PRESET_NAME)

        setLoading(true)
        console.log("helo", cdata)

        try {
            const response = await fetch(process.env.CLOUDINARY_URL + "image/upload", {
                method: "POST",
                body: cdata
            })
            console.log("cdata", cdata)

            const file = await response.json()
            setUrl(file.secure_url)
            setLoading(false)
            console.log("file", file)

            /* localStorage.setItem("url", file.secure_url);
               setStore({url: file.secure_url}); */

            return file

        } catch (error) {
            console.log("Error uploading image:", error)
            return false
        }
    }

    const handleUploadNext = () => {
        setPreviousUrl(url);


        setUrl("");
        setPrice("");

        document.getElementById("url").value = "";
    };

    const handleUploadPhoto = async (e) => {
        e.preventDefault();

        // Obtener los valores de bicicleta y casco desde Azure
        const azureResult = await actions.azurePredict(url);

        if (!azureResult) {
            console.log("Azure prediction failed");
            return;
        }

        const { helmet, bicycle } = azureResult;
        console.log("Data from Azure:", { helmet, bicycle });


        const result = await actions.uploadPhoto(url, price, user_id, bicycle, helmet);

        if (result) {
            console.log("Photo uploaded successfully");
        } else {
            console.log("Upload failed");
        }

        handleUploadNext();
    };
    // useEffect (() => {
    //     actions.getUserInfo()
    // }, [user_id])
    return (
        <div className="photographer-container">
            {previousUrl && (
                <div className='uploaded-image' >
                    <h3>Photo uploaded:</h3>
                    <img className="previous-image" src={previousUrl} alt="previous uploaded" />
                </div>
            )}
            <form onSubmit={handleUploadPhoto}>
                <div className='tag-container'>
                    <label htmlFor="url">Select your amazing photo:</label>
                    <div>
                        <input
                            className='file_select'
                            type="file"
                            accept='image/*'
                            placeholder='Upload an image'
                            id="url"
                            onChange={changeUploadImage}
                        />
                        {loading ? (
                            <h3 className='loading'>Loading...</h3>) : (
                            <div>
                                <img className="photographer-image" src={url} alt="uploaded" />
                                {url ? (<button type="button" onClick={() => deleteImage()}>Delete photo</button>) : null}
                            </div>
                        )}
                    </div>
                </div>

                <div className='tag-container'>
                    <label htmlFor="price">Price:</label>
                    <input
                        className='price'
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit">Send it!</button>
            </form>

            <button className="btn btn-primary" onClick={handleUploadNext}>Upload next</button>

        </div>
    );
};
