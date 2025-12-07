
# Endpoints:
# POST /lugares/agregar
# POST /lugares/cercanos
# POST /lugares/distancia

from fastapi import APIRouter, HTTPException
from models.lugares_models import LugarCreate, CercanosRequest, DistanciaRequest
from services.redis_service import redis_service

router = APIRouter()

# ---------------------------------------------
# 1) AGREGAR LUGAR
# ---------------------------------------------
@router.post("/agregar")
def agregar_lugar(data: LugarCreate):
    ok = redis_service.agregar_lugar(
        grupo=data.grupo,
        nombre=data.nombre,
        lat=data.lat,
        lon=data.lon
    )

    if not ok:
        raise HTTPException(status_code=500, detail="Error al guardar lugar")

    return {"message": "Lugar agregado correctamente"}


# ---------------------------------------------
# 2) LUGARES CERCANOS A 5 KM
# ---------------------------------------------
@router.post("/cercanos")
def obtener_cercanos(data: CercanosRequest):
    resultados = redis_service.obtener_cercanos(
        grupo=data.grupo,
        lat=data.lat,
        lon=data.lon,
        radio_km=5
    )

    lugares = [
        {
            "nombre": nombre,
            "distancia_km": round(dist, 3)
        }
        for nombre, dist in resultados
    ]

    return {"cantidad": len(lugares), "lugares": lugares}


# ---------------------------------------------
# 3) DISTANCIA LUGAR ↔ USUARIO
# ---------------------------------------------
@router.post("/distancia")
def obtener_distancia(data: DistanciaRequest):
    dist = redis_service.distancia(
        grupo=data.grupo,
        nombre=data.nombre,
        lat=data.lat_usuario,
        lon=data.lon_usuario
    )

    if dist is None:
        raise HTTPException(status_code=404, detail="Lugar no encontrado")

    return {
        "lugar": data.nombre,
        "distancia_km": round(dist, 3)
    }
