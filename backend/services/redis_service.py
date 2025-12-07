import redis
from config import REDIS_HOST, REDIS_PORT

class RedisService:
    def __init__(self):
        self.client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            decode_responses=True
        )

    def agregar_lugar(self, grupo: str, nombre: str, lat: float, lon: float):
        try:
            self.client.geoadd(grupo, lon, lat, nombre)
            return True
        except Exception as e:
            print("Error:", e)
            return False
        
    def obtener_cercanos(self, grupo: str, lat: float, lon: float, radio_km=5):
        try:
            return self.client.georadius(
                grupo,
                lon,
                lat,
                radio_km,
                unit="km",
                withdist=True
            )
        except Exception:
            return []
        
    def distancia(self, grupo: str, nombre: str, lat: float, lon: float):
        # Guardar coordenada temporal del usuario
        self.client.geoadd("pos_usuario", lon, lat, "usuario_temp")

        dist = self.client.geodist(grupo, nombre, "usuario_temp", unit="km")

        # Borrar coordenada temporal
        self.client.zrem("pos_usuario", "usuario_temp")

        return dist

redis_service = RedisService()
