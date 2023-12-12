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

    $("#agregarUsuario").click(function () {

        Swal.fire({
            title: 'DATOS DE SERVICIOS',

            html: '<div class="input-group mb-3">' +
                '<span class="input-group-text">Nombre</span>' +
                '<input type="text" id="firstname" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Apellido</span>' +
                '<input type="text" id="lastname" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Correo</span>' +
                '<input type="text" id="email" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Username</span>' +
                '<input type="text" id="username" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Contraseña</span>' +
                '<input type="password" id="password" class="form-control">' +
                '</div>',

            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',

            preConfirm: () => {
                const firstname = Swal.getPopup().querySelector('#firstname').value
                const lastname = Swal.getPopup().querySelector('#lastname').value
                const email = Swal.getPopup().querySelector('#email').value
                const username = Swal.getPopup().querySelector('#username').value
                const password = Swal.getPopup().querySelector('#password').value

                if (!firstname | !lastname | !email | !username | !password) {
                    Swal.showValidationMessage('¡Ingrese datos por favor!')
                }

                return { firstname, lastname, email, username, password }
            }

        }).then((result) => {

            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/administrador/agregarUsuarios',

                    data: {
                        firstname: result.value.firstname,
                        lastname: result.value.lastname,
                        email: result.value.email,
                        username: result.value.username,
                        password: result.value.password
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
                                title: 'Usuario registrado',
                                text: 'El usuario se ha registrado con éxito.'
                                
                            }).then((result) => {

                                if (result.isConfirmed) {
                                    parent.location.href = '/administrador/usuarios'
                                }
                            })
                        }
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no guardado!")
            }
        })
    })

    /****************************************************/

    $("tr #eliminarUsuario").click(function () {
        var usuario_id = $(this).data('usuario-id');

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
                    url: `/administrador/usuarios/${usuario_id}/eliminar`,

                    beforeSend: function (xhr) {
                        if (!this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken)
                        }
                    },

                    success: function () {
                        Swal.fire(
                            'Usuario eliminado', 'El usuario se ha eliminado con éxito.', 'success'

                        ).then((result) => {

                            if (result.isConfirmed) {
                                parent.location.href = '/administrador/usuarios'
                            }
                        })
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al eliminar el usuario. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no eliminado!")
            }
        })
    })
})