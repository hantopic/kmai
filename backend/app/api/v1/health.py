from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "KMAI Backend",
        "version": "0.1.0"
    }
