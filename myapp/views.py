import os
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from myapp.models import Caso, DetalleCaso, DetalleRecomendacion, Equipo, Inventario, Recomendacion, Servicio, Tipo


def index(request):
    return render(request, 'index.html')


########################################################################


@login_required
def principal(request):
    servicios = Servicio.objects.all()
    tipos = Tipo.objects.all()
    return render(request, 'empleado/principal.html', {
        'servicios': servicios,
        'tipos': tipos
    })

# --------------------------------------------------------------------


@login_required
def equipos(request):
    equipos = Equipo.objects.all()
    return render(request, 'empleado/equipos.html', {'equipos': equipos})


@login_required
def agregarEquipos(request):
    if request.method == 'POST':
        cod_sap = request.POST.get('cod_sap')
        serie = request.POST.get('serie')
        descripcion = request.POST.get('descripcion')
        cantidad = int(request.POST.get('cantidad'))

        inventario_existente = Inventario.objects.filter(
            equipo__cod_sap=cod_sap,
            equipo__serie=serie,
            equipo__descripcion=descripcion
        ).first()

        equipo = Equipo.objects.create(
            cod_sap=cod_sap,
            serie=serie,
            descripcion=descripcion,
            cantidad=cantidad
        )

        equipo.save()

        if inventario_existente:
            inventario_existente.cantidad_disponible += cantidad
            inventario_existente.save()

            # Devuelve una respuesta JSON de éxito
            return JsonResponse({'success': True})

        else:

            nuevo_inventario = Inventario.objects.create(
                equipo=equipo,
                cantidad_disponible=cantidad
            )

            nuevo_inventario.save()

            return JsonResponse({'success': True})

    else:
        # Devuelve una respuesta JSON de error
        return JsonResponse({'success': False})


@login_required
def inventario(request):
    inventarios = Inventario.objects.all()
    return render(request, 'empleado/inventario.html', {'inventarios': inventarios})


@login_required
def recomendacion(request):
    recomendaciones = Recomendacion.objects.all()
    detalles = DetalleRecomendacion.objects.all()

    return render(request, 'empleado/recomendacion.html', {
        'listado': recomendaciones,
        'detalles': detalles
    })


@login_required
def equipos_recomendados(request):
    servicio_id = request.POST.get('servicio_id')
    tipo_id = request.POST.get('tipo_id')

    servicio = Servicio.objects.get(id=servicio_id)
    tipo = Tipo.objects.get(id=tipo_id)

    lista = recomendacion_rbc(servicio, tipo)

    return render(request, 'empleado/equipos_recomendados.html', {
        'servicio': servicio,
        'tipo': tipo,
        'lista': lista
    })


def recomendacion_rbc(servicio, tipo):
    recomendados = []

    # Obtener todos los casos para el servicio y tipo de acceso dados
    casos = Caso.objects.filter(
        servicio=servicio, tipo=tipo)

    # Obtener casos parecidas para el servicio y tipo de acceso dados
    if not casos:
        casos = Caso.objects.filter(
            servicio=servicio).exclude(tipo=tipo).distinct()

    # Iterar sobre los casos y sumar las cantidades devueltas por equipo
    for caso in casos:
        detalle_casos = DetalleCaso.objects.filter(
            caso_id=caso)

        for detalle in detalle_casos:
            cantidad_recomendada = 0

            if detalle.cantidad_devuelta > 0:
                cantidad_recomendada = detalle.cantidad - detalle.cantidad_devuelta

            else:
                cantidad_recomendada = detalle.cantidad

            recomendados.append({
                'detalle': detalle,
                'cantidad_recomendada':  cantidad_recomendada
            })

    return recomendados


def agregarRecomendacion(request):
    if request.method == 'POST':
        servicio_id = request.POST.get('servicio_id')
        tipo_id = request.POST.get('tipo_id')

        # Guarda recomendación y el caso para futuras recomendaciones

        recomendacion = Recomendacion.objects.create(
            servicio_id=servicio_id,
            tipo_id=tipo_id
        )

        recomendacion.save()

        # Detalles de recomendacion y casos

        for i in range(len(request.POST.getlist('cantidad'))):
            cantidad = request.POST.getlist('cantidad')[i]
            equipo_id = request.POST.getlist('equipo_id')[i]

            detalle_recomendacion = DetalleRecomendacion.objects.create(
                equipo_id=equipo_id,
                cantidad_recomendada=cantidad,
                recomendacion=recomendacion
            )

            detalle_recomendacion.save()

    return redirect('principal')


########################################################################


@login_required
def admin_principal(request):
    return render(request, 'administrador/admin_principal.html')


# ------------------------------------------------------------------


@login_required
def servicios(request):
    servicios = Servicio.objects.all()
    return render(request, 'administrador/servicios/servicios.html', {'servicios': servicios})


@login_required
def agregarServicios(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')

        if Servicio.objects.filter(nombre__iexact=nombre).exists():
            mensaje = 'El equipo ya existe.'
            return JsonResponse({'mensaje': mensaje})

        else:
            servicio = Servicio.objects.create(nombre=nombre)
            servicio.save()

            # Devuelve una respuesta JSON de éxito
            return JsonResponse({'success': True})

    else:
        # Devuelve una respuesta JSON de error
        return JsonResponse({'success': False})


@login_required
def editarServicios(request, servicio_id):
    if request.method == 'GET':
        servicio = Servicio.objects.get(id=servicio_id)
        return render(request, 'administrador/servicios/editarServicio.html', {
            'servicio': servicio
        })

    else:
        try:
            nombre = request.POST.get('nombre')

            servicios = Servicio.objects.get(id=servicio_id)
            servicios.nombre = nombre
            servicios.save()

            return redirect('servicios')

        except ValueError:
            return render(request, 'administrador/servicios/servicios.html', {
                'servicios': servicios,
                'error': 'Error al actualizar el servicio'
            })


@login_required
def eliminarServicios(request, servicio_id):
    servicio = get_object_or_404(Servicio, pk=servicio_id)
    servicio.delete()
    return JsonResponse({'success': True})


# ------------------------------------------------------------------


@login_required
def usuarios(request):
    usuarios = User.objects.all()
    return render(request, 'administrador/usuarios/usuarios.html', {'usuarios': usuarios})


@login_required
def agregarUsuarios(request):
    if request.method == 'POST':
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')

        if User.objects.filter(first_name__iexact=first_name, last_name__iexact=last_name).exists():
            mensaje = 'El usuario ya existe.'
            return JsonResponse({'mensaje': mensaje})

        else:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=username,
                password=password
            )

            user.save()

            grupo = Group.objects.get(name='usuario')
            user.groups.add(grupo)

            return JsonResponse({'success': True})

    else:
        return JsonResponse({'success': False})


@login_required
def editarUsuarios(request, usuario_id):
    if request.method == 'GET':
        usuario = User.objects.get(id=usuario_id)
        return render(request, 'administrador/usuarios/editarUsuario.html', {
            'usuario': usuario
        })

    else:
        try:
            first_name = request.POST.get('nombre')
            last_name = request.POST.get('apellido')
            username = request.POST.get('username')
            email = request.POST.get('correo')

            usuarios = User.objects.get(id=usuario_id)
            usuarios.first_name = first_name
            usuarios.last_name = last_name
            usuarios.username = username
            usuarios.email = email
            usuarios.save()

            return redirect('usuarios')

        except ValueError:
            return render(request, 'administrador/usuarios/usuarios.html', {
                'usuarios': usuarios,
                'error': 'Error al actualizar el usuario'
            })


@login_required
def eliminarUsuarios(request, usuario_id):

    user = get_object_or_404(User, pk=usuario_id)
    group = Group.objects.get(user=user)

    user.groups.remove(group)
    user.delete()

    return JsonResponse({'success': True})


# ------------------------------------------------------------------


@login_required
def tipos_equipos(request):
    tipos = Tipo.objects.all()
    return render(request, 'administrador/tipos/tipos.html', {'tipos': tipos})


@login_required
def agregarTipos(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        imagen = request.FILES.get('imagen')

        if Tipo.objects.filter(nombre__iexact=nombre).exists():
            mensaje = 'El tipo de equipo ya existe.'
            return JsonResponse({'mensaje': mensaje})

        else:
            tipo = Tipo.objects.create(nombre=nombre, imagen=imagen)
            tipo.save()
            # Devuelve una respuesta JSON de éxito
            return JsonResponse({'success': True})

    else:
        # Devuelve una respuesta JSON de error
        return JsonResponse({'success': False})


@login_required
def editarTipos(request, tipo_id):
    if request.method == 'GET':
        tipo = Tipo.objects.get(id=tipo_id)
        return render(request, 'administrador/tipos/editarTipo.html', {
            'tipo': tipo
        })

    else:
        try:
            nombre = request.POST.get('nombre')
            imagen = request.FILES.get('imagen')

            tipos = get_object_or_404(Tipo, pk=tipo_id)

            if imagen:

                if tipos.imagen:
                    os.remove(tipos.imagen.path)

                tipos.imagen = imagen

            tipos.nombre = nombre
            tipos.save()

            return redirect('tipos_equipos')

        except ValueError:
            return render(request, 'administrador/tipos/tipos.html', {
                'tipos': tipos,
                'error': 'Error al actualizar el tipo de equipo'
            })


@login_required
def eliminarTipos(request, tipo_id):
    tipo = get_object_or_404(Tipo, pk=tipo_id)

    if tipo.imagen:

        if os.path.exists(tipo.imagen.path):
            os.remove(tipo.imagen.path)

    tipo.delete()
    return JsonResponse({'success': True})


# -------------------------------------------------------------------


def signin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            user = User.objects.get(username=username)

            grupo = Group.objects.get(name='usuario')

            if user.groups.filter(name=grupo):
                return redirect('principal')

            else:
                return redirect('admin_principal')

        else:
            return render(request, 'index.html', {
                'error': "Usuario o contraseña incorrecta"
            })

    else:
        return render(request, 'index.html', {
            'error': "Usuario o contraseña incorrecta"
        })


@login_required
def signout(request):
    logout(request)
    return redirect('index')
