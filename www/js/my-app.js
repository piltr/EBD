  
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
        path: '/cliente/',
        url: 'cliente.html',
      },
      {
        path: '/ciclista/',
        url: 'ciclista.html',
      },
      {
        path: '/tienda/',
        url: 'tienda.html',
      },
      {
        path: '/productos/',
        url: 'productos.html',
      },
      {
        path: '/index/',
        url: 'index.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    db = firebase.firestore();
    usuarios = db.collection("Usuarios")
    anterior = "/index/"
    $$("#atras").on("click", function(){
      console.log(anterior)
        mainView.router.navigate(anterior)
        anterior = "/index/"
    })
});
var onSuccess = function(position) {
  alert('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
};
function activate() { 
}
navigator.geolocation.getCurrentPosition(activate, onError);
// onError Callback receives a PositionError object
//

function onError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    $$("#registrarse").on("click", function(){
    })
    $$("#ingresar").on("click", ingresar)

    
    function ingresar() {
      email = $$("#userEmail").val()
      var password = $$("#userContraseña").val()
      firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    //var user = userCredential.user;
    mainView.router.navigate('/ciclista/');
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });
    datos(email)
    }
    function datos(email) {
     var usuario =  usuarios.doc(email)
     console.log(email)
      usuario.get().then((doc) => {
        if (doc.exists){
          tipoDeUsuario = doc.data().tipo
          nombreDeUsuario = doc.data().nombre
          tipoDeUsuario = doc.data().tipo
          console.log(nombreDeUsuario, tipoDeUsuario)
        } else {
          console.log("No se encontro el dato del usuario")
        }
        }).catch((error) => {
        console.log("No se pudieron obtener los datos del usuario")
      })
      }

})
$$(document).on('page:init', '.page[data-name="ciclista"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    $$("#bienvenida2").html("<div>Bienvenido "+nombreDeUsuario+" listo para salir a las calles?</div>")
    $$("#cords").on("click", function(){
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //


  navigator.geolocation.getCurrentPosition(onSuccess, onError);
    })


})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    
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
      
      var data = {
        nombre: $$("#nombres").val(),
        apellido: $$("#apellidos").val(),
        tipo: tipoUsuario,
        };
        // MiID es una VARIABLE que yo le asigno un valor
        db.collection("Usuarios").doc(mail).set(data)
        .then( function() {
           console.log("bd seteada")
           location.href = "index.html"
        });
        
    }
})
$$(document).on('page:init', '.page[data-name="cliente"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  $$("#bienvenida1").html("<div>Bienvenido "+nombreDeUsuario+" listo para hacer un pedido?</div>")
})
$$(document).on('page:init', '.page[data-name="tienda"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  $$("#bProductos").on("click", function () {
    console.log(anterior)
    anterior = "/tienda/"
    console.log(anterior)
    
  })
})
$$(document).on('page:init', '.page[data-name="productos"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
})