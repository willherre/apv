exports.createSchema = function(mongoose){
mongoose.connect("mongodb://localhost/apv");
//Documento Logo encargado del almacenamiento de los logos 	
var LogoSchema = new mongoose.Schema({
	nomlogo: String,
	descrip: String,
	date: { type: Date, default: Date.now},
	estado: { type: String, default: "I"}, 
});

Logo = mongoose.model("logos",LogoSchema);

//Documento Slide encargado del almacenamiento de los slides
var SlideSchema = new mongoose.Schema({
	nomslide: String,
	descrip: String,
	tipo : String,
	date: { type: Date, default: Date.now},
	estado: { type: String, default: "I"}, 
});

Slide = mongoose.model("slides",SlideSchema);

//Documento Slide encargado del almacenamiento de los slides
var NotiSchema = new mongoose.Schema({
	titulo: String,
	contenido: String,
	conteni: String,
	imagen : String,
	date: { type: Date, default: Date.now},
	estado: { type: String, default: "I"}, 
});

Noti = mongoose.model("notis",NotiSchema);

//Documento user encargado del almacenamiento de los slides
var UserSchema = new mongoose.Schema({
	
	identifi: Number,
	codigo : String,
	pnombre: String,
	snombre: String,
	papellido :String,
	sapellido: String,
	genero: String,
	correo: String,
	direccion: String,
	telefono: String,
	imagen : String,
	rol : String,
	password: String,
	date: { type: Date, default: Date.now},
	estado: { type: String, default: "A"}, 
});

User= mongoose.model("users",UserSchema);

}