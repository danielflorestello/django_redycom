from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from myapp import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', views.index, name='index'),

    # -------------------------------------------------------------------------------

    path('principal/', views.principal, name='principal'),
    path('equipos/', views.equipos, name='equipos'),
    path('agregarEquipos/', views.agregarEquipos, name='agregarEquipos'),
    path('inventario/', views.inventario, name='inventario'),
    path('recomendacion/', views.recomendacion, name='recomendacion'),
    path('equipos_recomendados/', views.equipos_recomendados,
         name='equipos_recomendados'),
    path('agregarRecomendacion/', views.agregarRecomendacion,
         name='agregarRecomendacion'),

    # -------------------------------------------------------------------------------

    path('administrador/principal', views.admin_principal, name='admin_principal'),

    path('administrador/servicios', views.servicios, name='servicios'),
    path('administrador/agregarServicios',
         views.agregarServicios, name='agregarServicios'),
    path('administrador/servicios/<int:servicio_id>',
         views.editarServicios, name='editarServicios'),
    path('administrador/servicios/<int:servicio_id>/eliminar',
         views.eliminarServicios, name='eliminarServicios'),

    path('administrador/usuarios', views.usuarios, name='usuarios'),
    path('administrador/agregarUsuarios',
         views.agregarUsuarios, name='agregarUsuarios'),
    path('administrador/usuarios/<int:usuario_id>',
         views.editarUsuarios, name='editarUsuarios'),
    path('administrador/usuarios/<int:usuario_id>/eliminar',
         views.eliminarUsuarios, name='eliminarUsuarios'),

    path('administrador/tipos', views.tipos_equipos, name='tipos_equipos'),
    path('administrador/agregarTipos', views.agregarTipos, name='agregarTipos'),
    path('administrador/tipos/<int:tipo_id>',
         views.editarTipos, name='editarTipos'),
    path('administrador/tipos/<int:tipo_id>/eliminar',
         views.eliminarTipos, name='eliminarTipos'),

    # --------------------------------------------------------------------------------

    path('signin/', views.signin, name='signin'),
    path('logout/', views.signout, name='logout'),

] + static(settings.MEDIA_URL,
           document_root=settings.MEDIA_ROOT)
