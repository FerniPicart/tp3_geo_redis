from fastapi import FastAPI
from routers.lugares_router import router as lugares_router
from services.redis_service import redis_service

app = FastAPI(title="API Turismo - Redis GEO")

# Rutas principales
app.include_router(lugares_router, prefix="/lugares")

@app.get("/")
def root():
    return {"status": "API activa"}

@app.get("/redis-ping")
def redis_ping():
    ok = redis_service.client.ping()
    return {"redis_ok": ok}
