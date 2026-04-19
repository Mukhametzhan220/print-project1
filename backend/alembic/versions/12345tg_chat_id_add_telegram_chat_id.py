"""add telegram_chat_id

Revision ID: 12345tg_chat_id
Revises: 
Create Date: 2026-04-19 09:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '12345tg_chat_id'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # We add the column `telegram_chat_id`.
    # It must be nullable since existing users (or new users entering phone) don't have it yet.
    op.add_column('users', sa.Column('telegram_chat_id', sa.String(length=64), nullable=True))
    op.create_unique_constraint('uq_users_telegram_chat_id', 'users', ['telegram_chat_id'])

def downgrade() -> None:
    op.drop_constraint('uq_users_telegram_chat_id', 'users', type_='unique')
    op.drop_column('users', 'telegram_chat_id')
