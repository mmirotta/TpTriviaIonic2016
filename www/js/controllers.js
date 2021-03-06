angular.module('starter.controllers', ['ngCordova'])

.controller('IngresoCtrl', function($scope, $state) {
  try
  {
    $scope.usuario = {};
    $scope.usuario.nombre = "";

    $scope.Ingresar = function(){

      var param = JSON.stringify($scope.usuario);
      $state.go('tab.juego', {usuario:param});
    
    };
  }
  catch(error)
  {
    alert("Ingreso" + error);
  }
})

.controller('PuntuacionesCtrl', function($scope,  $timeout) {
  try
  {
    var puntajeReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/usuario/');

    $scope.listaPuntajesCompleta = [];

    puntajeReferencia.on('child_added', function (snapshot) {
      $timeout(function() {
        var puntaje = snapshot.val();
        $scope.listaPuntajesCompleta.push(puntaje);
      });
    });
  }
  catch(error)
  {
    alert("Puntuacion" + error);
  }
})

.controller('JuegoCtrl', function($scope, $state, $stateParams, $timeout, $cordovaVibration, $cordovaNativeAudio) {

  try
  {
    $cordovaNativeAudio 
      .preloadSimple('correcto', 'audio/correcto.mp3')
      .then(function (msg) {
        console.log(msg);
      }, function (error) {
        alert(error);
      });

    $cordovaNativeAudio
      .preloadSimple('error', 'audio/error.mp3')
      .then(function (msg) {
        console.log(msg);
      }, function (error) {
        alert(error);
      }); 
  }
  catch(error)
  {
    console.log("error native");
  }
  
  try
  {
    $scope.usuario = JSON.parse($stateParams.usuario);

    var preguntaReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/preguntas/');
    $scope.preguntasElegidas = [];
    $scope.pregunta = {};
    $scope.preguntasCorrectas = "0";
    $scope.preguntasIncorrectas = "0";
    $scope.puntaje = "0";
    $scope.preguntasTotal = "0";
    $scope.imagenesResultado = "";
    $scope.claseOpcion1 = "button button-block button-stable sombraBotones";
    $scope.claseOpcion2 = "button button-block button-stable sombraBotones";
    $scope.claseOpcion3 = "button button-block button-stable sombraBotones";
    $scope.claseOpcion4 = "button button-block button-stable sombraBotones";

    $scope.icono1 = 'img/signo.png';
    $scope.icono2 = 'img/signo.png';
    $scope.icono3 = 'img/signo.png';
    $scope.icono4 = 'img/signo.png';
    $scope.icono5 = 'img/signo.png';

    $scope.numeroRandom = Math.floor((Math.random() * 10) + 1);
   
    preguntaReferencia.on('child_added', function (snapshot) {
      $timeout(function() {
        var preguntas = snapshot.val();
        
        if (preguntas.numero == $scope.numeroRandom){
          $scope.pregunta.pregunta = preguntas.pregunta;
          $scope.pregunta.opcion1 = preguntas.opcion1;
          $scope.pregunta.opcion2 = preguntas.opcion2;
          $scope.pregunta.opcion3 = preguntas.opcion3;
          $scope.pregunta.opcion4 = preguntas.opcion4;
          $scope.pregunta.correcta = preguntas.correcta;
          $scope.pregunta.puntaje = preguntas.puntaje;
          $scope.pregunta.numero = preguntas.numero;
          $scope.pregunta.correcta = preguntas.correcta;
          $scope.preguntasElegidas.push($scope.numeroRandom);
        } 
      });
    });
  }
  catch(error)
  {
    alert("Juego- " + error);
  }

  $scope.Comprobar = function(opcion){
    try
    {
      $scope.preguntasTotal = parseInt($scope.preguntasTotal) + 1;
      if (parseInt(opcion) == parseInt($scope.pregunta.correcta))
      {
        $scope.preguntasCorrectas = parseInt($scope.preguntasCorrectas) + 1;
        $scope.puntaje = parseInt($scope.puntaje) + parseInt($scope.pregunta.puntaje);
        cambiarIcono(parseInt($scope.preguntasTotal), "1");
        respuestaCorrecta();
      }
      else
      {
        $scope.preguntasIncorrectas = parseInt($scope.preguntasIncorrectas) + 1;
        cambiarIcono(parseInt($scope.preguntasTotal), "0");
        respuestaIncorrecta();
      }
      guardarResultado(opcion);
      if (parseInt($scope.preguntasTotal) < 5)
      {
        cambiarColorRespuesta(parseInt(opcion), parseInt($scope.pregunta.correcta))
        $timeout(otraPregunta, 1000);
      }
      else
      {
        $scope.resultado = {};
        $scope.resultado.correctas = $scope.preguntasCorrectas;
        $scope.resultado.incorrectas = $scope.preguntasIncorrectas;
        $scope.resultado.puntaje = $scope.puntaje;
        var param = JSON.stringify($scope.resultado);
        $state.go('tab.resultado', {resultado:param});
      }
    }
    catch(error)
    {
      alert("Juego-Comprobar-" + error);
    }
  };

  function otraPregunta(){
    try
    {
      $scope.claseOpcion1 = "button button-block button-stable sombraBotones";
      $scope.claseOpcion2 = "button button-block button-stable sombraBotones";
      $scope.claseOpcion3 = "button button-block button-stable sombraBotones";
      $scope.claseOpcion4 = "button button-block button-stable sombraBotones";
      var existe = 0;
      do {
        $scope.numeroRandom = Math.floor((Math.random() * 10) + 1);
        existe = 0;
        for (var i = $scope.preguntasElegidas.length - 1; i >= 0; i--) {
          if (parseInt($scope.numeroRandom) == parseInt($scope.preguntasElegidas[i]))
          {
            existe = 1;
          }
        };
      }
      while (existe == 1);     

      preguntaReferencia.on('child_added', function (snapshot) {
        var preguntas = snapshot.val();
        
        if (preguntas.numero == $scope.numeroRandom){
          $scope.pregunta.pregunta = preguntas.pregunta;
          $scope.pregunta.opcion1 = preguntas.opcion1;
          $scope.pregunta.opcion2 = preguntas.opcion2;
          $scope.pregunta.opcion3 = preguntas.opcion3;
          $scope.pregunta.opcion4 = preguntas.opcion4;
          $scope.pregunta.correcta = preguntas.correcta;
          $scope.pregunta.puntaje = preguntas.puntaje;
          $scope.pregunta.numero = preguntas.numero;
          $scope.pregunta.correcta = preguntas.correcta;
          $scope.preguntasElegidas.push($scope.numeroRandom);
        } 
      });
    }
    catch(error)
    {
      alert("Juego-OtraPregunta- " + error);
    }
  }

  function guardarResultado(opcion){
    try
    {
      var usuarioReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/usuario/');
      var fecha = Firebase.ServerValue.TIMESTAMP;
      usuarioReferencia.push({nombre:$scope.usuario.nombre, fechaJuego: fecha, correcta: $scope.pregunta.correcta, respuesta: opcion, pregunta: $scope.pregunta.numero});
    }
    catch(error)
    {
      alert("Juego-guardarResultado- " + error);
    }
  }

  function respuestaCorrecta(){
    try{
      $cordovaVibration.vibrate(200);
      $cordovaNativeAudio.play('correcto');
    }
    catch (error){
      alert("Juego-RespuestaCorrecta" + error);
    }
  }

  function respuestaIncorrecta(){
    try{
      $cordovaVibration.vibrate([200, 0, 0, 200]);
      $cordovaNativeAudio.play('error');
    }
    catch (error){
      alert("RespuestaIncorrecta" + error);
    }
  }

  function cambiarIcono(opcion, correcta){
    try
    {
      switch (opcion)
      {
        case 1:
            $scope.icono1 = correcta == "1" ? 'img/check.png' : 'img/error.png';
          break;
        case 2:
            $scope.icono2 = correcta == "1" ? 'img/check.png' : 'img/error.png';
          break;
        case 3:
            $scope.icono3 = correcta == "1" ? 'img/check.png' : 'img/error.png';
          break;
        case 4:
            $scope.icono4 = correcta == "1" ? 'img/check.png' : 'img/error.png';
          break;
        case 5:
            $scope.icono5 = correcta == "1" ? 'img/check.png' : 'img/error.png';
          break;
      }
    }
    catch(error)
    {
      alert("Juego-CambiarIcono-" + error);
    }
  }

  function cambiarColorRespuesta(opcion, correcta){
    try
    {
      if (opcion == correcta){
        switch (opcion)
        {
          case 1:
              $scope.claseOpcion1 = "button button-block button-balanced sombraBotones";
            break;
          case 2:
              $scope.claseOpcion2 = "button button-block button-balanced sombraBotones";
            break;
          case 3:
              $scope.claseOpcion3 = "button button-block button-balanced sombraBotones";
            break;
          case 4:
              $scope.claseOpcion4 = "button button-block button-balanced sombraBotones";
            break;
        }
      }
      else
      {
        switch (opcion)
        {
          case 1:
              $scope.claseOpcion1 = "button button-block button-assertive sombraBotones";
            break;
          case 2:
              $scope.claseOpcion2 = "button button-block button-assertive sombraBotones";
            break;
          case 3:
              $scope.claseOpcion3 = "button button-block button-assertive sombraBotones";
            break;
          case 4:
              $scope.claseOpcion4 = "button button-block button-assertive sombraBotones";
            break;
        }

        switch (correcta)
        {
          case 1:
              $scope.claseOpcion1 = "button button-block button-balanced sombraBotones";
            break;
          case 2:
              $scope.claseOpcion2 = "button button-block button-balanced sombraBotones";
            break;
          case 3:
              $scope.claseOpcion3 = "button button-block button-balanced sombraBotones";
            break;
          case 4:
              $scope.claseOpcion4 = "button button-block button-balanced sombraBotones";
            break;
        }
      }
    }
    catch(error)
    {
      alert("cambiarColorRespuesta-" + error);
    }
  }
})

.controller('ResultadoCtrl', function($scope, $state, $stateParams) {
  try
  {
    $scope.resultado = JSON.parse($stateParams.resultado);

    if ($scope.resultado.correctas > $scope.resultado.incorrectas)
    {
      $scope.imagen = "img/ganaste.jpg";
    }
    else
    {
      $scope.imagen = "img/perdiste.jpg";
    }
  }
  catch(error)
  {
    alert("Resultado-" + error);
  }
})

.controller('PreguntasCtrl', function($scope) {
  try
  { 
    var preguntasReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/preguntas/');
      $scope.preguntaNueva = {};
      $scope.preguntaNueva.pregunta = "";
      $scope.preguntaNueva.opcion1 = "";
      $scope.preguntaNueva.opcion2 = "";
      $scope.preguntaNueva.opcion3 = "";
      $scope.preguntaNueva.opcion4 = "";
      $scope.preguntaNueva.correcta = "";
      $scope.preguntaNueva.puntaje = "";
      $scope.preguntaNueva.numero = "";

    $scope.Agregar = function(){

      preguntasReferencia.push({pregunta:$scope.preguntaNueva.pregunta, opcion1:$scope.preguntaNueva.opcion1, opcion2:$scope.preguntaNueva.opcion2, opcion3:$scope.preguntaNueva.opcion4, opcion4:$scope.preguntaNueva.opcion4, correcta:$scope.preguntaNueva.correcta, puntaje:$scope.preguntaNueva.puntaje, numero:$scope.preguntaNueva.numero});
      $scope.preguntaNueva.pregunta = "";
      $scope.preguntaNueva.opcion1 = "";
      $scope.preguntaNueva.opcion2 = "";
      $scope.preguntaNueva.opcion3 = "";
      $scope.preguntaNueva.opcion4 = "";
      $scope.preguntaNueva.correcta = "";
      $scope.preguntaNueva.puntaje = "";
      $scope.preguntaNueva.numero = "";
    };
  }
  catch(error)
  {
    alert("Preguntas-" + error);
  }
})

.controller('PerfilCtrl', function($scope) {
});

