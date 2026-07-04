from fastapi import FastAPI
from app.api.v1.health import router as health_router

app = FastAPI(
    title="KMAI Backend API",
    description="Korean Medicine Artificial Intelligence Platform Backend",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api/v1", tags=["health"])


@app.get("/")
def root():
    return {
        "message": "KMAI Backend API",
        "version": "0.1.0",
        "status": "running"
    }
