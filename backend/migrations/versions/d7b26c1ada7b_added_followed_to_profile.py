"""added followed to Profile

Revision ID: d7b26c1ada7b
Revises: 27a8b23475d1
Create Date: 2023-06-09 04:40:44.323960

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd7b26c1ada7b'
down_revision = '27a8b23475d1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Profile',
    sa.Column('follower_id', sa.Integer(), nullable=True),
    sa.Column('followed_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['followed_id'], ['profile.id'], ),
    sa.ForeignKeyConstraint(['follower_id'], ['profile.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Profile')
    # ### end Alembic commands ###
