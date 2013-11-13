
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose =require('mongoose');
var fs = require('fs');
var async = require('async');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var models = require('./models');
models.createSchema(mongoose);
//Guardar Logo
app.post("/logo/add", function(req,res){ 
    Logo.findOne({nomlogo:req.files.photo.name},function (err,doc) {
   if (doc==null) {
    if (req.files.photo.type.indexOf('image')==-1){
        res.send('El fichero que deseas subir no es una imagen');
    } else {
       console.log(req.files);
       var tmp_path = req.files.photo.path;
       var nomlogo=req.files.photo.name;
       var dirimg="./public/images/content/logo/";
       subirimagen(nomlogo,tmp_path,dirimg);
       var descrip = req.body.logod;
         new Logo({
           descrip: descrip,
           nomlogo: nomlogo,
       }).save(function(err,docs){
           if(err) res.send("error");
           res.send(docs);
       });
       res.redirect('/logo');
      }
   } else{
         Logo.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
         User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
         res.render("logo", {
            logos: resources,
            users: projects,
            title:"A.P.V | Administrador de logos",
            descrip:req.body.logod,
            mensaje:"El nombre de la imagen ya existe."
         });
       }); 
     }); 
    };  
 }); 
});
//Guardar Slide
app.post("/banner/add", function(req,res){
  Slide.findOne({nomslide:req.files.photo.name},function (err,doc) { 
   if (doc==null) {  
    if (req.files.photo.type.indexOf('image')==-1){
        res.send('El fichero que deseas subir no es una imagen');
    } else {
       console.log(req.files);
       var tmp_path = req.files.photo.path;
       var nomslide=req.files.photo.name;
       var dirimg="./public/images/content/slide/";
       subirimagen(nomslide,tmp_path,dirimg);
       var descrip = req.body.slided;
       var tipo = req.body.slidet;
           new Slide({
             descrip: descrip,
             nomslide: nomslide,
             tipo :tipo,
         }).save(function(err,docs){
             if(err) res.send("error");
             res.send(docs);
         });
         res.redirect('/banner');
     }
   } else{
           Slide.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
            User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
             res.render("banner", {
                slides: resources,
                users: projects,
                title:"A.P.V | Administrador de Slide",
                mensaje:"El nombre de la imagen ya existe."
             });
            });   
           });
   };
  });        
});
//Guardar Noticia
app.post("/noti/add",function(req,res) {
 Noti.findOne({imagen:req.files.photo.name},function (err,doc) {
  if (doc==null) {  
   if (req.files.photo.type.indexOf('image')==-1){
               res.send('El fichero que deseas subir no es una imagen');
   } else { 
    console.log(req.files);
    var tmp_path = req.files.photo.path;
    var nomnoti=req.files.photo.name;
    var dirimg="./public/images/content/new/";
    subirimagen(nomnoti,tmp_path,dirimg);
    var titulo = req.body.notid;
    var noti = req.body.notia;
    var not = noti.substr(0,400);
        new Noti({
          titulo: titulo,
          contenido: noti,
          conteni : not,
          imagen: nomnoti,
      }).save(function(err,docs){ 
          if(err) res.send("error");
          res.send(docs);
      });
      res.redirect('/noti');
    }
   } else{
    var titulo = req.body.notid;
    var noti = req.body.notia;
    Noti.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
     User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
      res.render("noti", {
        notis: resources,
         users: projects,
         title:"A.P.V | Administrador de Slide",
         descrip:req.body.logod,
         mensaje:"El nombre de la imagen ya existe.",
         ti:titulo,
         cont:noti,

      });
     });   
    });
  }; 
 }); 
});
//Guardar Usuario
app.post("/usuarioadd",function(req,res) {

 
  if (req.body.password!=req.body.password1) 
  {
    var mensaje="La contraseña no coincide  ";
    res.redirect('/usuario/'+ mensaje);
  }

  if (req.body.nada==1) {
    var mensaje="Debe llenar todos campos obligatorios  ";
    res.redirect('/usuario/'+ mensaje);
  }else {
    
    new User({
          identifi:req.body.iden,
          codigo:req.body.codigo,
          pnombre:req.body.nom,
         
          snombre:req.body.snombre,
          papellido:req.body.papellido,
          sapellido:req.body.sapellido,
          genero:req.body.genero,
          
         

          correo:req.body.correo,
           /* 
          direccion:req.body.direccion,
          telefono:req.body.telefono,
          rol:req.body.rol,
          password:req.body.password,
          */
      }).save(function(err,docs){
          if(err) res.send("error");
          res.send(docs);
      });
      res.redirect('/usuario/'+"Se creó el usuario correctamente");
  } 
});

//ajax guardar usuario
app.get("/usuario/:act",function(req,res) {

  var men= req.params.act;
  res.render("mensaje",{mensaje:men});
        
});
//Eliminar Logo
app.del('/logo/:id', function(req,res){
  var logonom = req.body.logonom;
  Logo.findById(req.params.id ,function(err,doc){
    if (!doc)return next(new NotFound('Document not found')); 
    doc.remove(function(){
       fs.unlinkSync('./public/images/content/logo/'+ doc.nomlogo)});
      res.redirect('/logo');
     
  });
});
// Eliminar Banner 
app.del('/banner/:id', function(req,res){
  var slidenom = req.body.slidenom;
  Slide.findById(req.params.id ,function(err,doc){
    if (!doc)return next(new NotFound('Document not found')); 
    doc.remove(function(){
       fs.unlinkSync('./public/images/content/slide/'+ doc.nomslide)});
      res.redirect('/banner');
     
  });
});
//Eliminar Noticia
app.del('/noti/:id',function(req,res) {
  Noti.findOne({ _id:req.params.id },function (err,doc) {
    var notinom =doc.imagen;
  Noti.findById(req.params.id,function(err,doc) {
   if (!doc)return next(new NotFound('Document not found'));
   doc.remove(function () {
     fs.unlinkSync('./public/images/content/new/'+ notinom)});
    res.redirect('/noti');
   });
  });
});
//activar logo
app.get('/logo/activar/:id',function(req,res){
  Logo.findOne({ _id:req.params.id  }, function (err, doc){
  
  if (doc.estado =="I"){
  Logo.findOne({ estado: 'A'  }, function (err, doc){
    doc.estado = 'I';
    doc.save();
  });
  doc.estado = 'A';
    doc.save();
  }
  res.redirect('/logo');
});
  
});
//Editar Noticia
app.get('/notid/:id',function(req,res){
 if (req.session.loggedIn!=null) {
   Noti.findOne({ _id:req.params.id }).sort({_id:"descending"}).skip(0).limit(1).execFind(function(err,docs){
   User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
    res.render("noti-edit", {
      notis: docs,
       users: projects,
       title:"A.P.V | Editor de Noticias",
     });
    });
   }); 
  } else{
    res.render('logina',{mensaje: "Debes iniciar sesion primero para ingresar.",title:'A.P.V | Administrador de Contenidos'});
  };
 }); 
app.post('/notmo/:id',function(req,res){
  var titulo = req.body.notid;
  var noti = req.body.notia;
  Noti.findOne({ _id:req.params.id }, function (err, doc){
    var titu = doc.titulo;
    var not = doc.contenido;
    if (titu!=titulo) {
      doc.titulo=titulo;
      doc.save();
    };
    if (noti!=not) {
      doc.contenido= noti;
      doc.conteni = noti.substr(0,400);
      doc.save();
    };
    if (req.files.photo.name!="") { 
       console.log(req.files);
        if (req.files.photo.type.indexOf('image')==-1){
                    res.send('El fichero que deseas subir no es una imagen');
        } else { 

         Noti.findOne({imagen:req.files.photo.name},function (err,ima) {
             if (ima==null) {

              var nomnoti=req.files.photo.name;
              fs.unlinkSync('./public/images/content/new/'+ doc.imagen);
              var tmp_path = req.files.photo.path;
              var dirimg='./public/images/content/new/';
              subirimagen(nomnoti,tmp_path,dirimg);
              doc.imagen=nomnoti; 
              doc.save();
              res.redirect('/notid/'+req.params.id);
          } else{
               doc.save();
               Noti.findOne({ _id:req.params.id }).sort({_id:"descending"}).skip(0).limit(1).execFind(function(err,docs){
               User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
                res.render("noti-edit", {
                  notis: docs,
                   users: projects,
                   title:"A.P.V | Editor de Noticias",
                   mensaje: "tobi es un buen chico "
                 });
                });
               });  
              };   
           }); 
         }

    }else{
      doc.save();
      res.redirect('/notid/'+req.params.id); 
    }
     
    });
  });

//activar banner
app.get('/banner/activar/:id',function(req,res){
  Slide.findOne({ _id:req.params.id  }, function (err, doc){
  if (doc.estado =="I"){
    doc.estado = 'A';
    doc.save();
  }else{
    doc.estado = 'I';
    doc.save();
  }
  res.redirect('/banner');
});
});
//activar noticia
app.get('/noti/activar/:id',function(req,res){
  Noti.findOne({ _id:req.params.id  }, function (err, doc){
  if (doc.estado =="I"){
    doc.estado = 'A';
    doc.save();
  }else{
    doc.estado = 'I';
    doc.save();
  }
  res.redirect('/noti');
});
  
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/enviara', routes.enviara);
app.get('/usuario', routes.usuario);
//app.get('/contacto', routes.contacto);
app.get("/contacto", function(req,res){ 
   Logo.find({}, function(err,docs){
    res.render('contacto',{
      title: 'A.P.V | Administrador de Contenidos',
      logos: docs
       });
      });
});
app.get("/", function(req,res){  
  Noti.find({}).sort({_id:"descending"}).skip(0).limit(5).exec(function (err, resources) {
  Noti.count({ estado:"A" }, function (err, count) {
  var pag= Math.ceil(count / 5);
  var nnoti= 1;
  Logo.find({}).exec(function (err, projects) {
  Slide.find({}).exec(function (err, slid) {  
      res.render("index", {
          notis: resources,
          logos: projects,
          slides: slid,
          title:"A.P.V | Reservas en Tiempo Real",
          nuNo:pag,
          pagact:nnoti        
        });  
      });
     });
   });
   }); 
});
//Cargar Noticias
app.post("/cargarnoti", function(req,res){  
  var nnoti= req.body.pagina;
  res.redirect("/not/"+ nnoti);
});
app.get("/not/:pagi",function(req,res) {
  var nnoti= parseInt(req.params.pagi);
  var elef=(nnoti * 5); 
  var elei=(nnoti - 1)*5;
  Noti.find({}).sort({_id:"descending"}).skip(elei).limit(elef).exec(function (err, resources) {
  Noti.count({ estado:"A" }, function (err, count) {
  var pag= Math.ceil(count / 5);
  
      res.render("notiindex", {
          notis: resources,
          title:"A.P.V | Reservas en Tiempo Real",
          nuNo:pag,
          pagact:nnoti
        });  
   });
   });
});
//Usuario
app.get('/useradd', routes.useradd);
//Login administrador
app.get('/logina', routes.logina);
//Formulario de envio de contraseña al correo del usuario
app.get('/forgota', routes.forgota);
//Enviar correo de contacto
app.post('/enviar', routes.enviar);
//Listar los logos 
app.get("/logo", function(req,res){
  if (req.session.loggedIn!=null) {
    Logo.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
    User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
        res.render("logo", {
            logos: resources,
            users: projects,
            title:"A.P.V | Administrador de logos"
        });
       });
     });           
  } else{
       Logo.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
    User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
        res.render("logo", {
            logos: resources,
            users: projects,
            title:"A.P.V | Administrador de logos",
            descrip:req.body.logod,
            mensaje:"El nombre de la imagen ya existe."
        });
       });
     }); 
    };
});
//Listar Slides del banner
app.get("/banner", function(req,res){
    if (req.session.loggedIn!=null) {
      Slide.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
      User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
          res.render("banner", {
              slides: resources,
              users: projects,
              title:"A.P.V | Administrador de Slides"
          });
         });
       });           
    } else{
      res.render('logina',{mensaje: "Debes iniciar sesion primero para ingresar.",title:'A.P.V | Administrador de Contenidos'});
    }; 
    });
//Listas Noticias
app.get("/noti", function(req,res) {
 if (req.session.loggedIn!=null) {
   Noti.find({}).sort({_id:"descending"}).skip(0).limit(10).exec(function (err, resources) {
   User.findOne({identifi: req.session.loggedIn  }).exec(function (err, projects) {
       res.render("noti", {
           notis: resources,
           users: projects,
           title:"A.P.V | Administrador de Noticias"
       });
      });
    });           
 } else{
   res.render('logina',{mensaje: "Debes iniciar sesion primero para ingresar.",title:'A.P.V | Administrador de Contenidos'});
 }; 
 });     
//sesiones 
app.post('/ingresar',function(req,res) {
  //se busca y se comprueba que los datos introducidos en el formulario sean corectos
  User.findOne({codigo:req.body.identi , password: req.body.password } ,function (err, user) {
    //Se verifica si encontro algun usuario 
    if (user == null) {
      //como no encontro ningun usuario re direcciona a login con un mensaje 
      res.render('logina',{mensaje: "La contraseña y el usuario que introdujiste no coinciden.",title:'A.P.V | Administrador de Contenidos'});
    } else{
      if (user.rol=="adm" ||user.rol=="mont") {

       if (user.estado!="I") {
         req.session.loggedIn = user.identifi;
         res.render('admin' ,{users: user , usua: req.session.loggedIn,title:'A.P.V | Inicio'});
         
       }else{
        res.render('logina',{mensaje: "El usuario se encuentra inactivo.",title:'A.P.V | Administrador de Contenidos'});
        };  
      
      } else{

         res.render('logina',{mensaje: "El usuario no cuenta con privilegios de administrador .",title:'A.P.V | Administrador de Contenidos'});
      };  
      //si encuentra el usuario crea la variable de sesion y envi a el usuario      
    } 
  });
});
app.get('/users', user.list);
//Direccionamiento del adm Contenidos
app.get("/admin", function(req,res){
  if (req.session.loggedIn!=null) {
     User.findOne({identifi: req.session.loggedIn  } ,function (err, user) {
      res.render('admin', {title:"Administrador | Inicio", usua :req.session.loggedIn,users: user});
     });
  } else{
    res.render('logina',{mensaje: "Debes iniciar sesion primero para ingresar.",title:'A.P.V | Administrador de Contenidos'});
  };
});
//cerrar sesion del CMS
app.get('/closea',function(req,res) {
  delete  req.session.loggedIn;
  res.redirect('/logina');
});

function subirimagen(nombreimg,temporal,ruta) {
  //Subir imagenes 
  // Importamos el modulo para subir ficheros
      // Ruta donde colocaremos las imagenes
      var target_path = ruta + nombreimg;
      var nomlogo=nombreimg;
     // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
    fs.rename(temporal, target_path, function(err) {
        if (err) throw err;
        // Eliminamos el fichero temporal
        fs.unlink(temporal, function() {
            if (err) throw err;
        })
     })
};
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
}); 