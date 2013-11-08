function cargarnoticias(pagi) {
	$.ajax({
	    url: "/cargarnoti",
	    method:'POST',
		data: {pagina: pagi},
		success: function (response) {
        $("#noticias").html(response);
		}
	    });
}
	
