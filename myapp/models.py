from django.db import models


class Servicio(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


class Tipo(models.Model):
    nombre = models.CharField(max_length=50)
    imagen = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.nombre


class Equipo(models.Model):
    cod_sap = models.IntegerField()
    serie = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=50)
    cantidad = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.serie


class Inventario(models.Model):
    equipo = models.OneToOneField(Equipo, on_delete=models.CASCADE)
    cantidad_disponible = models.IntegerField(default=0)

    def __str__(self):
        return self.cantidad_disponible


class Recomendacion(models.Model):
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    tipo = models.ForeignKey(Tipo, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.servicio


class DetalleRecomendacion(models.Model):
    cantidad_recomendada = models.IntegerField(default=0)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)
    recomendacion = models.ForeignKey(Recomendacion, on_delete=models.CASCADE)

    def __str__(self):
        return self.equipo


class Caso(models.Model):
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    tipo = models.ForeignKey(Tipo, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)


class DetalleCaso(models.Model):
    cantidad = models.IntegerField()
    cantidad_devuelta = models.IntegerField(default=0)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)
    caso = models.ForeignKey(Caso, on_delete=models.CASCADE)
