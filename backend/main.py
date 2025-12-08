from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.lugares_router import router as lugares_router
from services.redis_service import redis_service

app = FastAPI(title="API Turismo - Redis GEO")

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lugares_router, prefix="/lugares")

@app.get("/")
def root():
    return {"status": "API activa"}

@app.get("/redis-ping")
def redis_ping():
    ok = redis_service.client.ping()
    return {"redis_ok": ok}
