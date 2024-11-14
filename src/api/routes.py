"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Photo, Order, OrderItems, Helmets, Bikes
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
from flask_bcrypt import generate_password_hash, check_password_hash

import os 

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

ENDPOINT = os.getenv("AZURE_ENDPOINT", "https://westeurope.api.cognitive.microsoft.com/")
project_id = os.getenv("AZURE_PROJECT_ID", "4a0d1a7e-a87e-43e2-838c-3eec869f5aeb")
prediction_key = os.getenv("AZURE_PREDICTION_KEY", "60094dce53474cc681efc9b474460632")
publish_iteration_name = os.getenv("AZURE_ITERATION_NAME", "Iteration4")
prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)

# Function to run predictions
def run_prediction(image_path):
    try:
        with open(image_path, mode="rb") as test_data:
            results = predictor.detect_image(project_id, publish_iteration_name, test_data)
        for prediction in results.predictions:
            print(f"\t{prediction.tag_name}: {prediction.probability:.2f}% bbox.left = {prediction.bounding_box.left:.2f}, bbox.top = {prediction.bounding_box.top:.2f}, bbox.width = {prediction.bounding_box.width:.2f}, bbox.height = {prediction.bounding_box.height:.2f}")
    except FileNotFoundError:
        print(f"File not found: {image_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example route to trigger prediction
@api.route('/predict', methods=['POST'])
def predict_image():
    data = request.get_json()
    image_path = data.get('image_path')
    run_prediction(image_path)
    response = jsonify({"msg": "Prediction completed"})
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response, 200

# Example of other existing routes

@api.route('/users', methods = ['GET'])
def get_users(): 
    users = User.query.all()
    users_serialized = list(map(lambda item:item.serialize(), users))
    response_body = {
        "message" : "Nice!",
        "data": users_serialized
    }
    if (users == []):
        return jsonify({"msg": "Not users yet"}), 404
    return jsonify(response_body), 200

# Para usuario loggeado
@api.route('/userinfo', methods=['GET'])
@jwt_required()
def userinfo():
    try:
        current_user = get_jwt_identity()
        # Buscar al usuario en la base de datos por su ID
        user = User.query.filter(User.email == current_user).first()
        print(user)
        if user:
            # Crear el cuerpo de la respuesta con un mensaje de saludo que incluye el correo electrónico del usuario
            response_body = user.serialize()
            # Puedes sacar esto con serialize ej: <p>{user.description}</p>
            # "user_name": self.user_name,
            # "email": self.email,
            # "description": self.description,
            # "admin": self.admin
            # Devolver el mensaje de saludo como JSON con un código de estado 200 (OK)
            return jsonify(response_body), 200
        else:
            # Manejar el caso en el que el usuario no existe
            print("error else")
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        # Manejar cualquier otro error que pueda ocurrir
        return jsonify({"error": str(e)}), 500

@api.route('/users/<int:user_id>', methods = ['GET'])
def get_user(user_id): 
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404
        
    user_info = User.query.filter_by(id=user_id).first().serialize()    
    response_body = {
        "message" : "Nice!",
        "data": user_info
    }

    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    users_query = User.query.filter_by(email=email).first()
    is_valid = check_password_hash(users_query.password, password) 
    print(email, password, is_valid)
    if not users_query:
        return jsonify({"msg": "The username doesn't exist"}), 402
    if is_valid == False:
        return jsonify({"msg": "Bad username or password"}), 401
    # if email != users_query.email or not is_valid:
    #     return jsonify({"msg": "Bad username or password"}), 401
 
    additional_claims = {
        "user_id" : users_query.id,
        "user_username" : users_query.username,
        "role" : users_query.role.value
    }
    access_token = create_access_token(identity=users_query.id)
    return jsonify(access_token=access_token, additional_claims=additional_claims), 200

@api.route('/register', methods=['POST'])
def register():
    request_body = request.get_json()
    hashed_password = generate_password_hash(request_body["password"]).decode('utf-8')
    if User.query.filter_by(email=request_body["email"]).first():
        return jsonify({"msg": "Email already exists"}), 409
    
    user = User()
    user.new_user(
        email=request_body["email"],    
        password=hashed_password,
        username=request_body["username"],
        name = request_body["name"],
        surname = request_body["surname"],
        role = request_body["role"]
    )
    db.session.add(user)
    db.session.commit()

    additional_claims = {
        "user_id" : user.id,
        "user_username" : user.username,
        "role" : user.role.value
    }

    access_token = create_access_token(identity=request_body["email"], additional_claims=additional_claims)
    return jsonify(access_token=access_token, role=user.role.value, user=user.id), 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        User.query.filter_by(id=user_id).delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"}), 200
    else:
        return jsonify({"msg": "User doesn't exist"}), 401
    
@api.route('/photos', methods=['POST'])
@jwt_required()
def add_photo():
    request_body = request.get_json()

    print(request_body)
    if Photo.query.filter_by(url=request_body["url"]).first():
        return jsonify({"msg": "Duplicated image"}), 409
    jwt_data = get_jwt()

    photo = Photo()
    photo.new_photo(   
        url=request_body["url"],
        bicycle=request_body["bicycle"],
        helmet = request_body["helmet"],
        price = request_body["price"],
        user_id = request_body["user_id"]
    )

    db.session.add(photo)
    db.session.commit()

    # photo = photo.serialize()

    return jsonify({"msg": "Photo created"}),201

@api.route('/photos/<int:user_id>', methods = ['GET'])
@jwt_required()
def get_photos(): 
    photos = Photo.query.all()
    photos_serialized = list(map(lambda item:item.serialize(), photos))
    response_body = {
        "message" : "Nice photos!",
        "data": photos_serialized
    }
    if (photos == []):
        return jsonify({"msg": "Not photos yet"}), 404
    return jsonify(response_body), 200

@api.route('/photos/<int:photo_id>', methods = ['GET'])
@jwt_required()
def get_photo(photo_id): 
    photo = Photo.query.get(photo_id)
    if photo is None:
        return jsonify({"msg": "Photo not found"}), 404
        
    photo_info = Photo.query.filter_by(id=photo_id).first().serialize()
    response_body = {
        "message" : "Nice photo!",
        "data": photo_info
    }

    return jsonify(response_body, photo_info), 200




@api.route('/photos/rider', methods = ['POST'])
@jwt_required()
def get_rider_photo(): 
    bicycle = request.json['bicycle']
    helmet = request.json['helmet']
    print(f'Bicycle: {bicycle}, Helmet: {helmet}')

    query = Photo.query

    if bicycle:
        query = query.filter_by(bicycle = Bikes[bicycle])
    if helmet:
        query = query.filter_by(helmet = Helmets[helmet])

    photos = query.all()
    print("llega", photos, query)

    if not photos:
        return jsonify({"msg": "No photos found"}), 404

    photo_list = [photo.serialize() for photo in photos]
    response_body = {
        "message": "Photos found!",
        "data": photo_list
    }

    return jsonify(response_body), 200

    # photo = Photo.query.get(helmet, bicycle)
    # if photo is None:
    #     return jsonify({"msg": "Photo not found"}), 404
        
    # photo_info = Photo.query.filter_by(helmet="helmet", bicycle="bicycle").first().serialize()
    # response_body = {
    #     "message" : "Nice photo!",
    #     "data": photo_info
    # }

    # return jsonify(response_body, photo_info), 200

@api.route('/photos/<int:photo_id>', methods=['DELETE'])
@jwt_required()
def delete_photo(photo_id):
    photo = Photo.query.get(photo_id)
    if photo:
        Photo.query.filter_by(id=photo_id).delete()
        db.session.delete(photo)
        db.session.commit()
        return jsonify({"msg": "Photo deleted"}), 200
    else:
        return jsonify({"msg": "Photo doesn't exist"}),401

@api.route('/orders', methods=['POST'])
@jwt_required()
def new_order():
    request_body = request.get_json()
    if Order.query.filter_by(id=request_body["id"]).first():
        return jsonify({"msg": "Duplicated order"}), 409
    jtw_data = get_jwt()
    user_id = jtw_data["user_id"]
    order = Order(
        id=request_body["id"],
        status=request_body["status"],
        payment_method=request_body["payment_method"],
        user_id= user_id
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({"msg": "Order created", "order": order.serialize()}), 201


@api.route('/orders', methods = ['GET'])
@jwt_required()
def get_orders(): 
    orders = Order.query.all()
    orders_serialized = list(map(lambda item:item.serialize(), orders))
    response_body = {
        "message" : "ok!",
        "data": orders_serialized
    }
    if (get_orders == []):
        return jsonify({"msg": "Not orders yet"}), 404
    return jsonify(response_body), 200



@api.route('/orders/<int:order_id>', methods = ['GET'])
@jwt_required()
def get_order(order_id): 
    order = Order.query.get(order_id)
    if order is None:
        return jsonify({"msg": "Order not found"}), 404
        
    order_info = Order.query.filter_by(id=order_id).first().serialize()    
    response_body = {
        "message" : "ok!",
        "data": order_info
    }

    return jsonify(response_body), 200


@api.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        Order.query.filter_by(id=order_id).delete()
        db.session.delete(order)
        db.session.commit()
        return jsonify({"msg": "Order deleted"}), 200
    else:
        return jsonify({"msg": "Order doesn't exist"}), 401
    

@api.route('/orderitems', methods=['POST'])
@jwt_required()
def new_order_item():
    request_body = request.get_json()
    if not request_body:
        return jsonify({"msg": "Not found"}), 404

    order_item_id = request_body.get("id")
    order_id = request_body.get("order_id")
    photo_id = request_body.get("photo_id")

    if not all([order_item_id, order_id, photo_id]):
        return jsonify({"msg": "Missing fields"}), 400

    if OrderItems.query.filter_by(id=order_item_id).first():
        return jsonify({"msg": "Duplicated order item"}), 409

    order_item = OrderItems(
        id=order_item_id,
        order_id=order_id,
        photo_id=photo_id
    )
    db.session.add(order_item)
    db.session.commit()

    return jsonify({"msg": "Order item created", "order_item": order_item.serialize()}),
    
@api.route('/orderitems/<int:order_item_id>', methods=['GET'])
@jwt_required()
def get_order_item(order_item_id):
    order_item = OrderItems.query.get(order_item_id)
    if order_item is None:
        return jsonify({"msg": "Order item not found"}), 404

    order_item_info = order_item.serialize()
    response_body = {
        "message": "ok!",
        "data": order_item_info
    }

    return jsonify(response_body), 200

@api.route('/orderitems/<int:order_item_id>', methods=['DELETE'])
@jwt_required()
def delete_order_item(order_item_id):
    order_item = OrderItems.query.get(order_item_id)
    if order_item:
        db.session.delete(order_item)
        db.session.commit()
        return jsonify({"msg": "Order item deleted"}), 200
    else:
        return jsonify({"msg": "Order item doesn't exist"}), 404