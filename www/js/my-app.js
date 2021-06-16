  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/registro/',
        url: 'registro.html',
      },
      {
        path: '/perfil/',
        url: 'perfil.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    anterior = "index.html"
    $$("#atras").on("click", function(){
      location.href = anterior
    })
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    $$("#registrarse").on("click", function(){
      anterior = location.href
    })
    $$("#ingresar").on("click", ingresar)

    function ingresar() {
      alert("ingresare")
      var email = $$("#userEmail").val()
      var password = $$("#userContraseña").val()
      firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    //var user = userCredential.user;
    alert("el usuario esta correctamente logueado")
    location.attr = "perfil.html"
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });

    }
})
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    var db = firebase.firestore();
    var repartidores = db.collection("repartidores")
    var clientes = db.collection("clientes")
    var tipoUsuario = ""
    console.log(e);
    $$("#registro").on("click", registrar)
    $$("#cliente").on("click", function () {
    $$("#repartidor").removeClass("button-active")
    $$("#cliente").addClass("button-active")
      tipoUsuario = "clientes"
    })
    $$("#repartidor").on("click", function () {
      tipoUsuario = "repartidores"
      $$("#cliente").removeClass("button-active")
      $$("#repartidor").addClass("button-active")
    })


    
    
    function registrar() {
      console.log("Registrando")
      // crea usuario en firebase
    var email = $$("#email").value();
    var clave = $$("#password").value();
    console.log(email, clave)
    firebase.auth().createUserWithEmailAndPassword(email, clave)
        .catch( function(error) {
            console.error(error.code);
            if (error.code == "auth/email-already-in-use") {
                console.error("el mail ya existe...");
           }
           console.error(error.message)
        })
        .then( function() {
          base(email)
          alert("registrado")
        });
    }
    function base(mail) {
      alert("bd")
      var data = {
        nombre: $$("nombres").val(),
        apellido: $$("apellido").val()
        };
        // MiID es una VARIABLE que yo le asigno un valor
        db.collection(tipoUsuario).doc(mail).set(data);
    }
    function ale() {

    }
})