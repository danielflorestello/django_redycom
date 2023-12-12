/* global Swal */

$(document).ready(function () {

    function getCookie(name) {
        let cookieValue = null

        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';')

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim()

                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                    break
                }
            }
        }

        return cookieValue
    }

    const csrftoken = getCookie('csrftoken')

    /****************************************************/

    $("#agregarServicio").click(function () {

        Swal.fire({
            title: 'Datos de Servicios',

            html: '<div class="input-group mb-3">' +
                '<span class="input-group-text">Nombre</span>' +
                '<input type="text" id="nombre" class="form-control" required>' +
                '</div>',

            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",

            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value

                if (!nombre) {
                    Swal.showValidationMessage('¡Ingrese datos por favor!')
                }

                return { nombre }
            }

        }).then((result) => {

            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/administrador/agregarServicios',

                    data: {
                        nombre: result.value.nombre
                    },

                    beforeSend: function (xhr) {
                        if (!this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken)
                        }
                    },

                    success: function (response) {
                        if (response.mensaje !== undefined && response.mensaje !== null) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.mensaje,
                            })

                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Servicio registrado',
                                text: 'El servicio se ha registrado con éxito.'
                                
                            }).then((result) => {

                                if (result.isConfirmed) {
                                    parent.location.href = '/administrador/servicios'
                                }
                            })
                        }
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al registrar el servicio. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no guardado!")
            }
        })
    })

    /****************************************************/

    $("tr #eliminarServicio").click(function () {
        var servicio_id = $(this).data('servicio-id')

        Swal.fire({
            title: '¿Está Seguro de Eliminar?',
            text: '¡Una vez eliminado, Ud. puede agregar de nuevo!',
            icon: 'warning',
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            backdrop: true,
            cancelButtonText: "Cancelar",

        }).then((result) => {

            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: `/administrador/servicios/${servicio_id}/eliminar`,

                    beforeSend: function (xhr) {
                        if (!this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken)
                        }
                    },

                    success: function () {
                        Swal.fire(
                            'Servicio eliminado', 'El servicio se ha eliminado con éxito.', 'success'

                        ).then((result) => {

                            if (result.isConfirmed) {
                                parent.location.href = '/administrador/servicios'
                            }
                        })
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al eliminar el servicio. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no eliminado!")
            }
        })
    })
})