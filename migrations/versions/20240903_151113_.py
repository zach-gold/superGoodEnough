"""empty message

Revision ID: 2776ce0b4ef0
Revises: 74263e03d5a9
Create Date: 2024-09-03 15:11:13.369408

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2776ce0b4ef0'
down_revision = '74263e03d5a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('area_pictures',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('area_id', sa.Integer(), nullable=False),
    sa.Column('picture_url', sa.String(), nullable=False),
    sa.Column('uploaded_by', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['area_id'], ['routes.id'], ),
    sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('area_pictures')
    # ### end Alembic commands ###
