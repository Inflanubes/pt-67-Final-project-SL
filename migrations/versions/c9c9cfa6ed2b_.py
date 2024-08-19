"""empty message

Revision ID: c9c9cfa6ed2b
Revises: 
Create Date: 2024-08-12 19:23:26.818911

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9c9cfa6ed2b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('password', sa.String(length=200), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('firstname', sa.String(length=120), nullable=False),
    sa.Column('role', sa.Enum('photographer', 'rider', 'admin', name='myroles'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('order',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.Enum('pending', 'completed', 'cancelled', name='statusorders'), nullable=False),
    sa.Column('payment_method', sa.Enum('credit_card', 'paypal', 'cash', name='paymentmethods'), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('photo',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(length=200), nullable=False),
    sa.Column('bicycle', sa.Enum('santa_Cruz', 'orbea', 'canyon', 'custom', name='bikes'), nullable=False),
    sa.Column('helmet', sa.Enum('scott', 'troyLee', 'bluegrass', 'custom', name='helmets'), nullable=False),
    sa.Column('price', sa.String(length=120), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('order_items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('photo_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['order.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['photo_id'], ['photo.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_items')
    op.drop_table('photo')
    op.drop_table('order')
    op.drop_table('user')
    # ### end Alembic commands ###