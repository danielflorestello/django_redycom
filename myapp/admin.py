from django.contrib import admin
from myapp.models import DetalleRecomendacion, Equipo, Inventario, Recomendacion, Servicio, Tipo

admin.site.register(Servicio)
admin.site.register(Tipo)
admin.site.register(Equipo)
admin.site.register(Inventario)
admin.site.register(Recomendacion)
admin.site.register(DetalleRecomendacion)
