function agregar() {
	var nada="llenito";
	var iden = document.getElementById("identifica").value;
	var codigo = document.getElementById("codigo").value;
	var nom = document.getElementById("pnombre").value;
	var snombre = document.getElementById("snombre").value;
	var papellido = document.getElementById("papellido").value;
	var sapellido = document.getElementById("sapellido").value;
	var genero = document.getElementById("genero").value;
	
	var correo = document.getElementById("correo").value;
	var direccion = document.getElementById("direccion").value;
	var telefono = document.getElementById("telefono").value;
	var rol = document.getElementById("rol").value;
	var password = document.getElementById("password").value;
	var password1 = document.getElementById("password1").value;
	
	if (iden=="" || codigo=="" || nom=="" || papellido=="" ||correo=="" || rol=="" ||password=="" || password1=="" ) 
	{
		var nada= 1;	
	};
	
	var data = new FormData();
	data.append('iden',iden);
    data.append('codigo',codigo);
    data.append('nom',nom);
    data.append('snombre',snombre);
    data.append('papellido',papellido);
    data.append('sapellido',sapellido);
    data.append('genero',genero);
 	data.append('correo',correo);
    data.append('direccion',direccion);
    data.append('telefono',telefono);
    data.append('rol',rol);
    data.append('password',password);
    data.append('password1',password1);
    data.append('nada',nada);
	$.ajax({
	    url: "/usuarioadd",
	    method:'POST',
	    contentType:false, //Debe estar en false para que pase el objeto sin procesar
        data:data, //Le pasamos el objeto que creamos con los archivos
        processData:false, //Debe estar en false para que JQuery no procese los datos a enviar
        cache:false,//Para que el formulario no guarde cache
		success: function (response) {
        $("#mensajero").html(response);
		}
	    });
}