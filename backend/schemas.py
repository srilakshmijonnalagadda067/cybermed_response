from pydantic import BaseModel
from typing import Optional


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str = "Medium"
    status: str = "Open"
    source: Optional[str] = None


class IncidentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    severity: str
    status: str
    source: Optional[str] = None

    class Config:
        from_attributes = True