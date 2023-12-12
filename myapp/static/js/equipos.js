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

    $("#agregarEquipos").click(function () {
        Swal.fire({
            title: 'Datos de Equipos',

            html: '<div class="input-group mb-3">' +
                '<span class="input-group-text">Código SAP</span>' +
                '<input type="number" id="cod_sap" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Serie</span>' +
                '<input type="text" id="serie" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Descripción</span>' +
                '<input type="text" id="descripcion" class="form-control">' +
                '</div>' +

                '<div class="input-group mb-3">' +
                '<span class="input-group-text">Cantidad</span>' +
                '<input type="number" id="cantidad" class="form-control">' +
                '</div>',

            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",

            preConfirm: () => {
                const cod_sap = Swal.getPopup().querySelector('#cod_sap').value
                const serie = Swal.getPopup().querySelector('#serie').value
                const descripcion = Swal.getPopup().querySelector('#descripcion').value
                const cantidad = Swal.getPopup().querySelector('#cantidad').value

                if (!cod_sap | !serie | !descripcion | !cantidad) {
                    Swal.showValidationMessage('¡Ingrese datos por favor!')
                }

                return { cod_sap, serie, descripcion, cantidad }
            }

        }).then((result) => {

            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: '/agregarEquipos/',

                    data: {
                        cod_sap: result.value.cod_sap,
                        serie: result.value.serie,
                        descripcion: result.value.descripcion,
                        cantidad: result.value.cantidad
                    },

                    beforeSend: function (xhr) {
                        if (!this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken)
                        }
                    },

                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Equipo registrado',
                            text: 'El equipo se ha registrado con éxito.'
                        
                        }).then((result) => {

                            if (result.isConfirmed) {
                                parent.location.href = '/equipos/'
                            }
                        })
                    },

                    error: function () {
                        Swal.fire('Error', 'Hubo un problema al registrar el equipo. Inténtalo de nuevo.', 'error')
                    }
                })

            } else {
                Swal.fire("¡Registro no guardado!")
            }
        })
    })
})