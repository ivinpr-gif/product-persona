import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.db.database import init_db

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Gamer Persona AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

init_db()


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "GamePersona AI backend is running"}
