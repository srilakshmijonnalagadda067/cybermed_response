from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Incident
from schemas import IncidentCreate, IncidentResponse


# --------------------------------------------------
# CREATE FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="CyberMed Response API"
)


# --------------------------------------------------
# CORS
# Allows React frontend to communicate with FastAPI
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# CREATE DATABASE TABLES
# --------------------------------------------------

Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "CyberMed Response API is running"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# --------------------------------------------------
# CREATE INCIDENT
# --------------------------------------------------

@app.post(
    "/incidents",
    response_model=IncidentResponse
)
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):

    new_incident = Incident(
        title=incident.title,
        description=incident.description,
        severity=incident.severity,
        status=incident.status,
        source=incident.source
    )

    db.add(new_incident)

    db.commit()

    db.refresh(new_incident)

    return new_incident


# --------------------------------------------------
# GET ALL INCIDENTS
# --------------------------------------------------

@app.get(
    "/incidents",
    response_model=list[IncidentResponse]
)
def get_incidents(
    db: Session = Depends(get_db)
):

    return db.query(Incident).all()


# --------------------------------------------------
# UPDATE INCIDENT STATUS
# --------------------------------------------------

@app.put("/incidents/{incident_id}/status")
def update_incident_status(
    incident_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        return {
            "error": "Incident not found"
        }

    incident.status = status

    db.commit()

    db.refresh(incident)

    return {
        "message": "Incident status updated successfully",
        "id": incident.id,
        "status": incident.status
    }