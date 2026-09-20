from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=True)

    severity = Column(String(50), nullable=False, default="Medium")

    status = Column(String(50), nullable=False, default="Open")

    source = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)