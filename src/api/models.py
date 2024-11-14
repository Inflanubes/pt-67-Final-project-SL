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
    santa_Cruz = "Santa Cruz Nomad 4"
    kona = "Kona Process 153"
    canyon = "Canyon"
    custom = "Custom"

class Helmets(enum.Enum):
    scott = "Scott Spartan"
    troyLee = "Troy Lee Stage"
    bluegrass = "Bluegrass"
    custom = "Custom"

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    surname = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Enum(MyRoles), nullable=False, default = MyRoles.rider)

    def __repr__(self):
        return '<Users %r>' % self.id
    
    def new_user(self, username, password, email, name, surname, role):
        self.username = username
        self.password = password
        self.email = email
        self.name = name
        self.surname = surname
        self.role = role
        db.session.add(self)
        db.session.commit()
        
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name":self.name,
            "surname": self.surname
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
    bicycle = db.Column(db.Enum(Bikes), nullable=False, default = Bikes.custom)
    helmet = db.Column(db.Enum(Helmets), nullable=False, default = Helmets.custom)
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