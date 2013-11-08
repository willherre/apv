
/*
 * GET home page.
 */
var nodemailer=require("nodemailer");
//funciones 
//Funcion de autentificacion  para envio de correos
function datos_email () {
  // body...
};

exports.useradd = function(req, res){
  if (req.session.loggedIn!=null) {
      User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
          res.render("useradd", {
              users: projects,
              title:"A.P.V | Crear Nuevo Usuario"
          });
         });
  } else{
    res.render('logina',{mensaje: "Debes iniciar sesion primero para ingresar.",title:'A.P.V | Administrador de Contenidos'});
  }; 
};
exports.index = function(req, res){
  res.render('index', { title: 'A.P.V | Reservas Audiovisuales  Online' });
  
};
exports.login = function(req, res){
  res.render('login', { title: 'A.P.V | Ingresar' })
};
exports.contacto = function(req, res){
  res.render('contacto', { title: 'A.P.V | Contacto' })
};
exports.logina = function(req, res){
  res.render('logina', { title: 'A.P.V | Administrador de Contenidos' })
};
exports.usuario = function(req, res){
  res.render('user', { title: 'A.P.V | Agregar Usuario' })
};
exports.forgota = function(req, res){
  res.render('forgota', { title: 'A.P.V | Olvidaste tu contraseña' })
};
exports.enviara = function(req, res){
  
 User.findOne({correo:req.body.correo  } ,function (err, user) {
  
  if (user==null) {
     res.render('forgota',{mensaje: "El correo que introdujiste no esta registrado.",title:'A.P.V | Olvidaste tu contraseña'});

  } else{
    
    if (user.rol=="adm" ||user.rol=="mont" ) {
        
        var smtpTransport = nodemailer.createTransport("SMTP",{
          service: "Gmail",
          auth: {
              user: "usuario",
              pass: "contraseña"
          }
      });
       var mailOptions = {
        
           from: "<Administrador de A.P.V>" , // sender address
           to: req.body.correo, // list of receivers
           subject: "Recuperacion Contraseña A.P.V", // Subject line
           html: "Esta es tu contraseña de acceso al A.P.V:<b>&nbsp;&nbsp;"+user.password+"</b><p></p><br>"+"<b>Cordial Saludo<br>"+"Administrador A.P.V"+"</b>" // plaintext body
       } 
       smtpTransport.sendMail(mailOptions, function(error, response){
           if(error){
               console.log(error);
               res.redirect('/contacto');
           }else{
               console.log("Message sent: " + response.message);
               res.render('logina',{mensaje: "Se envio tu clave de ingreso al correo:"+ user.correo +".",title:'A.P.V | Administrador de Contenidos'});
           }
           // if you don't want to use this transport object anymore, uncomment following line
           //smtpTransport.close(); // shut down the connection pool, no more messages
       });
       
      } else{

         res.render('logina',{mensaje: "El usuario no cuenta con privilegios de administrador.",title:'A.P.V | Administrador de Contenidos'});
      };  
      //si encuentra el usuario crea la variable de sesion y envi a el usuario 
  };

 });
};

exports.enviar= function(req, res){
	var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "usuario",
        pass: "contraseña"
    }
});
// setup e-mail data with unicode symbols
var mailOptions = {
	
    from: req.body.email_txt , // sender address
    to: "Mensaje de Contacto", // list of receivers
    subject: req.body.asunto_txt, // Subject line
    html: req.body.message_txa+"<p></p><br>"+"<b>Cordial Saludo<br>"+req.body.name_txt+"</b>" // plaintext body
}
// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        res.redirect('/contacto');
    }else{
        console.log("Message sent: " + response.message);
        res.redirect('/contacto');
    }
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});


};