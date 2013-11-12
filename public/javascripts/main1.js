function agregar(pagi) {
	$.ajax({
	    url: "/usuario/add",
	    method:'POST',
		data: {pagina: pagi},
		success: function (response) {
        $("#mensajero").html(response);
		}
	    });
}