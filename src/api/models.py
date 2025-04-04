from flask_sqlalchemy import SQLAlchemy
import enum

class MyRoles(enum.Enum):
    photographer = "Photographer"
    rider = "Rider"
    admin = "Admin"

class StatusOrders(enum.Enum):
    pending = "Pending"
    completed = "Completed"
    cancelled = "Cancelled"

class PaymentMethods(enum.Enum):
    credit_card = "Credit_card"
    paypal = "Paypal"
    cash = "Cash"

class Bikes(enum.Enum):
    santaCruz = "santaCruz"  # Bike Santa Cruz Nomad 4
    scNomad4Arena = "scNomad4Arena"  # Bike Santa Cruz Nomad 4 Arena
    kona = "kona"  # Bike Kona Process 153
    orbeaRallon = "orbeaRallon"  # Bike Orbea Rallon Morado-Azul
    summun21 = "summun21"  # Bike Mondraker Summun 21
    cannondaleJekyll2 = "cannondaleJekyll2"  # Bike Canondale Jekyll 2
    trekSession = "trekSession"  # Bike Trek Session
    V102017 = "V102017"  # Bike Santa Cruz V10 2017
    comSupV5 = "comSupV5"  # Bike Commencal Supremme V5 Ohlins Edition
    customBike = "customBike"  # Custom Bike

class Helmets(enum.Enum):
    scott = "scott"  # Helmet Scott Spartan
    troyLeeStage = "troyLeeStage"  # Helmet Troy Lee Stage
    bluegrassLegitIris = "bluegrassLegitWhiteIris"  # Helmet Bluegrass Legit White Iridiscent
    bluegrassLegit = "bluegrassLegit"  # Helmet Bluegrass Legit
    rampage = "rampage"  # Helmet Fox Rampage Azul
    rampagePro = "rampagePro"  # Helmet Fox Rampage Pro Carbon
    rampageCustomIbai = "rampageCustomIbai"  # Helmet Fox Rampage Custom Ibai Rider
    pocCoron = "pocCoron"  # Helmet Poc Coron Air Negro
    cienStatus = "cienStatus"  # Helmet 100% Status Negro
    customHelmet = "customHelmet"  # Custom Helmet

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    surname = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Enum(MyRoles), nullable=False, default = MyRoles.rider)
    bike = db.Column(db.Enum(Bikes), nullable=False, default = Bikes.customBike)
    helmet = db.Column(db.Enum(Helmets), nullable=False, default = Helmets.customHelmet)

    def __repr__(self):
        return '<Users %r>' % self.id
    
    def new_user(self, username, password, email, name, surname, role, bike, helmet):
        self.username = username
        self.password = password
        self.email = email
        self.name = name
        self.surname = surname
        self.role = role
        self.bike = bike
        self.helmet = helmet
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name":self.name,
            "surname": self.surname,
            "bike": self.bike,
            "helmet": self.helmet 
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(StatusOrders), nullable=False, default = StatusOrders.pending)
    payment_method = db.Column(db.Enum(PaymentMethods), nullable=False, default = PaymentMethods.credit_card)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id, ondelete="CASCADE"), nullable=False)

    def __repr__(self):
        return '<Order %r>' % self.id
    
    def new_order(self, status, payment_method, user_id):
        self.status = status
        self.payment_method = payment_method
        self.user_id = user_id
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            "id": self.id,
            "status": self.status,
            "payment_method": self.payment_method,
            "user_id":self.user_id,
        }

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(200), nullable=False)
    bicycle = db.Column(db.Enum(Bikes), nullable=False, default = Bikes.customBike)
    helmet = db.Column(db.Enum(Helmets), nullable=False, default = Helmets.customHelmet)
    price = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id, ondelete="CASCADE"), nullable=False)

    def __repr__(self):
        return '<Photo %r>' % self.id
    
    def new_photo(self, url, bicycle, helmet, price, user_id):
        self.url = url
        self.bicycle = bicycle
        self.helmet = helmet
        self.price = price
        self.user_id = user_id
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            'id': self.id,
            'url': self.url,
            'bicycle': self.bicycle.value,
            'helmet': self.helmet.value,
            'price': self.price,
            'user_id': self.user_id,
        }

class OrderItems(db.Model): 
    id = db.Column(db.Integer, primary_key=True) 
    order_id = db.Column(db.Integer, db.ForeignKey(Order.id, ondelete="CASCADE"), nullable=False)
    photo_id = db.Column(db.Integer, db.ForeignKey(Photo.id, ondelete="CASCADE"), nullable=False)

    def __repr__(self):
        return '<OrderItems %r>' % self.id
    
    def new_photo(self, order_id, photo_id):
        self.order_id = order_id
        self.photo_id = photo_id
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'photo_id': self.photo_id
        }