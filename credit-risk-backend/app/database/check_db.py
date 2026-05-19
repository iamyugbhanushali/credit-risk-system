from app.database.db import engine
from sqlalchemy import inspect

inspector = inspect(engine)

print(inspector.get_table_names())