  // If we need to use custom DOM library, let's save it to $$ variable:
  var $$ = Dom7;
  var map, platform;
  var pos, latitud, longitud;
  prodArray = []
  masterCarrito = ""

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
      routes: [{
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
                  path: '/registrot/',
                  url: 'registrot.html',
              },
              {
                  path: '/index/',
                  url: 'index.html',
              },
              {

                  path: '/agregarProducto/',
                  url: 'agregarProducto.html',
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
      tiendas = db.collection("Tiendas")
      anterior = "/index/"
      $$("#atras").on("click", function() {
          console.log(anterior)
          mainView.router.navigate(anterior)
          anterior = "/index/"
      })
  });
  var onSuccess = function(position) {
      Latitude = position.coords.latitude
      Longitude = position.coords.longitude
      console.log("latitud obtenida: " + Latitude)
          //'Altitude: ' + position.coords.altitude + '\n' +
          //'Accuracy: ' + position.coords.accuracy + '\n' +
          //'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
          //'Heading: ' + position.coords.heading + '\n' +
          //'Speed: ' + position.coords.speed + '\n' +
          //'Timestamp: ' + position.timestamp + '\n');
      var defaultLayers = platform.createDefaultLayers();
      map = new H.Map(
          document.getElementById('mapContainer'),
          defaultLayers.vector.normal.map, {
              zoom: 15,
              center: { lat: Latitude, lng: Longitude }
          });
      coords = { lat: Latitude, lng: Longitude };
      marker = new H.map.Marker(coords);
      var mapEvents = new H.mapevents.MapEvents(map);

      // Add behavior to the map: panning, zooming, dragging.
      var behavior = new H.mapevents.Behavior(mapEvents);

      // Create a marker icon from an image URL:
      var icon = new H.map.Icon('img/mapaCarrito.png');
      bici = new H.map.Icon('img/mapaBici.png');

      // Create a marker using the previously instantiated icon:
      var markerCarrito = new H.map.Marker({ lat: Latitude, lng: Longitude }, { icon: icon });
      bicimap = new H.map.Marker({ lat: "-41.9595776", lng: "-71.5343402" }, { icon: bici });

      // Add the marker to the map:
      map.addObject(markerCarrito);
      map.addObject(bicimap);
      // Add the marker to the map and center the map at the location of the marker:
      map.addObject(marker);
      map.setCenter(coords);
  };

  function activate() {}
  navigator.geolocation.getCurrentPosition(activate, onError);
  // onError Callback receives a PositionError object
  //

  function onError(error) {
      alert('code: ' + error.code + '\n' +
          'message: ' + error.message + '\n');
  }
  // Option 1. Using one 'page:init' handler for all pages
  $$(document).on('page:init', function(e) {
      // Do something here when page loaded and initialized
      console.log(e);
  })

  // Option 2. Using live 'page:init' event handlers for each page
  $$(document).on('page:init', '.page[data-name="index"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      platform = new H.service.Platform({
          'apikey': '8lEBP2-tHJsihdog6soHSApasBhLOXzrTWrTDsPUPw4'
      });

      $$("#registrarse").on("click", function() {})
      $$("#ingresar").on("click", ingresar)

      function ingresar() {
          email = "ciclista@ejemplo.com"
          password = "asd15987"
              //email = $$("#userEmail").val()
              //var password = $$("#userContraseña").val()
          firebase.auth().signInWithEmailAndPassword(email, password)
              .then(() => {
                  usuarios.doc(email).get()
                      .then(function(doc) {
                          var tipo = doc.data().tipo
                          if (tipo == "clientes") {

                              mainView.router.navigate('/cliente/');
                          } else if (tipo == "repartidores") {

                              mainView.router.navigate('/ciclista/');
                          }
                      })
              })
              .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode, errorMessage)
              });
          datos(email)
      }

      function datos(email) {
          var usuario = usuarios.doc(email)
          console.log(email)
          usuario.get().then((doc) => {
              if (doc.exists) {
                  tipoDeUsuario = doc.data().tipo
                  nombreDeUsuario = doc.data().nombre
                  latUsuario = doc.data().lat
                  longUsuario = doc.data().long
                  console.log(nombreDeUsuario, tipoDeUsuario)
              } else {
                  console.log("No se encontro el dato del usuario")
              }
          }).catch((error) => {
              console.log("No se pudieron obtener los datos del usuario")
          })
      }

  })
  $$(document).on('page:init', '.page[data-name="ciclista"]', function(e) {

      console.log(e);
      $$("#bienvenida2").html("<div>Bienvenido " + nombreDeUsuario + " listo para salir a las calles?</div>")
      $$("#updateC").on("click", function() {
          mapaA(email)

          function mapaA(email) {
              var usuario = usuarios.doc(email)
              usuario.get().then((doc) => {
                  if (doc.exists) {
                      latUsuario = doc.data().lat
                      longUsuario = doc.data().long
                      console.log(latUsuario, longUsuario)
                  } else {
                      console.log("No se encontro el dato del usuario")
                  }
              }).catch((error) => {
                  console.log("No se pudieron obtener los datos del usuario" + error)
              })
          }
          map.removeObject(bicimap)
          bicimap = new H.map.Marker({ lat: latUsuario, lng: longUsuario }, { icon: bici });
          map.addObject(bicimap)
      })
      $$("#subir").on("click", function() {
          updatePoss(email)

          function updatePoss(email) {

              //agregar registros temporales de ubicacion F&01
              db.collection("Usuarios").doc(email).update({ lat: "-41.9731194", long: "-71.53961967" })
                  .catch(function(error) {
                      console.log("Error: " + error);
                  })

              .then(function() {
                  console.log("posicion actualizada");
              })

          }

      })

      navigator.geolocation.getCurrentPosition(onSuccess, onError);


  })
  $$(document).on('page:init', '.page[data-name="registro"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized

      var tipoUsuario = ""
      console.log(e);
      $$("#registro").on("click", registrar)

      $$("#cliente").on("click", function() {
          $$("#repartidor").removeClass("button-active")
          $$("#cliente").addClass("button-active")
          tipoUsuario = "clientes"
      })

      $$("#repartidor").on("click", function() {
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
              .catch(function(error) {
                  console.error(error.code);
                  if (error.code == "auth/email-already-in-use") {
                      console.error("el mail ya existe...");
                  }
                  console.error(error.message)
              })
              .then(function() {
                  base(email)
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
              .then(function() {
                  console.log("bd seteada")
                  location.href = "index.html"
              });
      }
  })
  $$(document).on('page:init', '.page[data-name="cliente"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      console.log(e);
      $$("#bienvenida1").html("<div>Bienvenido " + nombreDeUsuario + " listo para hacer un pedido?</div>")
  })
  $$(document).on('page:init', '.page[data-name="agregarProducto"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      console.log(e);
      $$("#registroProd").on("click", function() {
          contarProductos($$("#idTienda").val())
      })

      function contarProductos(tienda) {
          var numeroDeProducto = 0
          tiendas.doc(tienda).collection("Productos").get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                      numeroDeProducto += 1
                      console.log(numeroDeProducto)
                  });
                  agregarProducto(numeroDeProducto + 1, tienda)
              })
              .catch(function(error) {

                  console.log("Error: ", error);

              });
      }




      function agregarProducto(producto, tienda) {

          var data = {
              nombre: $$("#nombreProducto").val(),
              precio: $$("#precio").val(),
              medida: $$("#medida").val(),
              imagen: $$("#imagenP").val(),
          };

          db.collection("Tiendas").doc(tienda).collection("Productos").doc("Producto" + producto).set(data)
              .catch(function(error) {
                  console.error(error.code);

                  console.error(error.message)
              })
              .then(function() {
                  console.log("tienda registrada")
                  location.href = "index.html"
              });


      }
  })
  $$(document).on('page:init', '.page[data-name="registrot"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      console.log(e);



      colorPickerWheel = app.colorPicker.create({
          inputEl: '#demo-color-picker-wheel',
          targetEl: '#demo-color-picker-wheel-value',
          targetElSetBackgroundColor: true,
          modules: ['wheel'],
          openIn: 'popover',
          value: {
              hex: '#bcff75',
          },
          on: {
              closed: function() {
                  $$("#backgroundColor").css("background-color", colorPickerWheel.getValue().hex);
              }
          },
      });
      //colorPickerWheel.getValue().hex
      $$("#registrotienda").on("click", function() {
          numeroDeTiendas()
      })

      function numeroDeTiendas() {
          if (!$$("#nombreTienda").val()) {
              alert("Tiene que ingresar el nombre de su comercio")
              return
          }

          if (!$$("#categoria").val()) {
              alert("Tiene que determinar la caregoria de su comercio")
              return
          }
          if (!$$("#imagen").val()) {
              alert("Tiene que referenciar una imagen para su comercio")
              return
          }
          if (!$$("#horario").val()) {
              alert("Tiene que referenciar una imagen para su comercio")
              return
          }
          alert(colorPickerWheel.getValue().hex)
          if (colorPickerWheel.getValue().hex == "#000000") {

              alert("El color de fondo debe ser distinto de negro")
              return
          }
          if (colorPickerWheel.getValue().hex == "#ffffff") {

              alert("El color de fondo debe ser distinto de blanco")
              return
          }

          var numeroDeTienda = 0
          tiendas.get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                      numeroDeTienda += 1
                  });
                  registrarTienda(numeroDeTienda + 1)
              })
              .catch(function(error) {

                  console.log("Error: ", error);

              });
      }




      function registrarTienda(tienda) {
          var data = {
              nombre: $$("#nombreTienda").val(),
              categoria: $$("#categoria").val(),
              horario: $$("#horario").val(), //F&02
              imagen: $$("#imagen").val(),
              color: colorPickerWheel.getValue().hex

          };
          db.collection("Tiendas").doc("tienda" + tienda).set(data)
              .catch(function(error) {
                  console.error(error.code);

                  console.error(error.message)
              })
              .then(function() {
                  alert("Tienda registrada con el identificador: tienda" + tienda)
                  console.log("tienda registrada")
                  location.href = "index.html"
              });


      }
  })
  $$(document).on('page:init', '.page[data-name="tienda"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      cargarTiendas()
      $$("#botonMas").on("click", function() {
          $$("#listaCarrito").html(masterCarrito)
      })


      function cargarTiendas() {
          numeroDeTienda = 1
          tiendas.get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                      //doc.data().nombre)
                      $$("#pantallaTiendas").append('<div id="tienda' + numeroDeTienda + '" class="justify-content-center display-flex"> ' +
                          '<div id="logo" class="col-33">' +
                          '<img id="logo1" src="' + doc.data().imagen + '" alt="">' +
                          '</div>' +
                          '<div class="col-33">' +
                          '<p>' + doc.data().categoria + ' ' + doc.data().nombre + '</p>' +
                          '</div>' +
                          '<div class="col-33">' +
                          '<p> Horario de atencion: ' + doc.data().horario + '</p>' +
                          '</div>' +
                          '</div>')
                      $$("#tienda" + numeroDeTienda).on("click", function() {
                          nroTienda = this.id
                          mainView.router.navigate('/productos/');
                          anterior = "/tienda/"
                      })

                      $$("#tienda" + numeroDeTienda).css("background-color", doc.data().color)
                      numeroDeTienda += 1
                  });
              })
              .catch(function(error) {

                  console.log("Error: ", error);

              });
      }

      console.log(e);


  })
  $$(document).on('page:init', '.page[data-name="productos"]', function(e) {
      // Do something here when page with data-name="about" attribute loaded and initialized
      cargarProductos(nroTienda)


      function cargarProductos(tienda) {
          productos = db.collection("Tiendas").doc(tienda).collection("Productos")
          prod = 0
          productos.get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {

                      prod += 1
                      prodArray["producto" + prod] = '<li><div id="producto' + prod + '" class="justify-content-center display-flex"> ' +
                          '<div id="logo" class="col-33">' +
                          '<img id="logo1" src="' + doc.data().imagen + '" alt="">' +
                          '</div>' +
                          '<div class="col-33">' +
                          '<p>' + doc.data().nombre + '</p>' +
                          '</div>' +
                          '<div class="col-33">' +
                          '<p>' + doc.data().precio + 'x' + doc.data().medida + '</p>' +
                          '</div>' +
                          '</div></li>'
                      $$("#pantallaProductos").append(prodArray["producto" + prod])

                      $$("#producto" + prod).on("click", function() {
                          onClick(this.id)
                      })
                  });
              })
              .catch(function(error) {

                  console.log("Error: ", error);

              });
      }

      function onClick(id) {
          alert(id)
          console.log(prodArray[id])
          masterCarrito += prodArray[id]
      }
      console.log(e);
  })