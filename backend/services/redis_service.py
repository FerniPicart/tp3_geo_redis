import redis
from config import REDIS_HOST, REDIS_PORT, REDIS_DB

class RedisService:
    def __init__(self):
        self.client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True
        )

    def agregar_lugar(self, grupo: str, nombre: str, lat: float, lon: float) -> bool:
        """
        Agrega (o actualiza) un punto geoespacial en Redis. 
        Redis GEOADD espera:  longitude, latitude, member
        Devuelve True si la operación fue ejecutada (no necesariamente insertó un nuevo miembro).
        """
        key = f"geo:{grupo}"
        try:
            # Formato correcto: geoadd(key, longitude, latitude, member)
            self.client.geoadd(key, lon, lat, nombre)
            return True
        except Exception as e:
            print("redis. geoadd error:", e)
            return False

    def obtener_cercanos(self, grupo:  str, lat: float, lon:  float, radio_km: float = 5):
        """
        Devuelve una lista de resultados desde Redis con distancias y coordenadas.
        Uso de GEORADIUS para compatibilidad amplia.
        Resultado típico por elemento: (member, distance, (lon, lat)) o (member, distance)
        """
        key = f"geo:{grupo}"
        try:
            # georadius:  key, longitude, latitude, radius, unit
            res = self.client.georadius(
                key,
                lon,
                lat,
                radio_km,
                unit="km",
                withdist=True,
                withcoord=True
            )
            return res  # lista (member, dist, (lon, lat))
        except Exception as e:
            print("redis.georadius error:", e)
            return []

    def distancia(self, grupo:  str, nombre: str, lat: float, lon: float):
        """
        Calcula la distancia (km) entre un miembro existente y las coordenadas del usuario.
        Estrategia: añadir temporalmente un miembro "__usuario_temp__" en el mismo key,
        pedir GEODIST entre el miembro y este temporal, y luego eliminarlo.
        Devuelve float (km) o None si no existe el miembro.
        """
        key = f"geo:{grupo}"
        tmp_member = "__usuario_temp__"
        try:
            # Agregar temporalmente el miembro del usuario (lon, lat)
            self.client.geoadd(key, lon, lat, tmp_member)

            # Calcular distancia entre el miembro y el temporal
            dist = self.client.geodist(key, nombre, tmp_member, unit="km")

            # Eliminar temporal
            try:
                self.client.zrem(key, tmp_member)
            except Exception:
                # si falla el borrado, no queremos que rompa la respuesta
                pass

            if dist is None:
                return None

            # geodist puede devolver string/float; aseguramos float
            return float(dist)
        except Exception as e:
            print("redis.geodist error:", e)
            # intentar limpiar por si quedó el temp
            try:
                self. client.zrem(key, tmp_member)
            except Exception: 
                pass
            return None

# instancia singleton para importar
redis_service = RedisService()