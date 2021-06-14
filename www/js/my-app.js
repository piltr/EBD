  
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
        path: '/about/',
        url: 'about.html',
        path: '/perfil/',
        url: 'perfil.html',
        path: '/registro/',
        url: 'registro.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    var db = firebase.firestore()
    colPersonas =  db.collection("personas")
    var miid = "asd@as.as"
   var data = {nombre : "pepe", mail : "pepe@asd.as",rol : "administrador"};
   console.log(data)
   db.collection("personas").add(data)
    .then( function (docRef){
      console.log("el id es " + docRef.id)
    })
    .catch( function(error){
      console.log("error" + error)
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
    alert('Hello');
    // crea usuario en firebase
    //var email = "asda@jhasjhgas.com";
    //var clave = "34562ijss";
    //firebase.auth().createUserWithEmailAndPassword(email, clave)
    //    .catch( function(error) {
    //        console.error(error.code);
    //        if (error.code == "auth/email-already-in-use") {
    //            console.error("el mail ya existe...");
    //        }
    //        //console.error(error.message);
    //    } )
    //    .then( function() {
    //        console.log('que paso??');
    //        mainView.router.navigate('/gracias/');
    //    });
})
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    alert('Hello');
})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    alert('Hello');
    $$("#registro").on("click", fun)

    function fun() {
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
            //console.error(error.message);
        } )
        .then( function() {
            console.log('que paso??');
            mainView.router.navigate('/gracias/');
        });
    }
})