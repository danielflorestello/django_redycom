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

    $("#agregarTipo").click(function () {

        Swal.fire({
            title: 'Datos de Tipos de Equipos',

            html: '<div class="input-group mb-3">' +
                '<span class="input-group-text">Nombre</span>' +
                '<input type="text" id="nombre" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<input type="file" id="imagen" class="form-control" accept="image/*">' +
                '</div>',

            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",

            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value
                const imagen = Swal.getPopup().querySelector('#imagen').files[0]

                if (!nombre | !imagen) {
                    Swal.showValidationMessage('¡Ingrese datos por favor!')
                }

                return { nombre, imagen }
            }

        }).then((result) => {

            if (result.isConfirmed) {
                var formData = new FormData()
                formData.append('nombre', result.value.nombre)
                formData.append('imagen', result.value.imagen)

                $.ajax({
                    type: 'POST',
                    url: '/administrador/agregarTipos',
                    data: formData,
                    contentType: false,
                    processData: false,

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
                                title: 'Tipo de equipo registrado',
                                text: 'El tipo de equipo se ha registrado con éxito.'
                                
                            }).then((result) => {

                                if (result.isConfirmed) {
                                    parent.location.href = '/administrador/tipos'
                                }
                            })
                        }
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al registrar el tipo de equipo. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no guardado!")
            }
        })
    })

    /****************************************************/

    $("tr #eliminarTipo").click(function () {
        var tipo_id = $(this).data('tipo-id')

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
                    url: `/administrador/tipos/${tipo_id}/eliminar`,

                    beforeSend: function (xhr) {
                        if (!this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken)
                        }
                    },

                    success: function () {
                        Swal.fire(
                            'Tipo de equipo eliminado', 'El tipo de equipo se ha eliminado con éxito.', 'success'

                        ).then((result) => {

                            if (result.isConfirmed) {
                                parent.location.href = '/administrador/tipos'
                            }
                        })
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al eliminar el tipo de equipo. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no eliminado!")
            }
        })
    })
})