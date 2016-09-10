angular.module('starter.controllers', [])

.controller('IngresoCtrl', function($scope, $state) {
  $scope.usuario = {};
  $scope.usuario.nombre = "";

  $scope.Ingresar = function(){

    var param = JSON.stringify($scope.usuario);
    $state.go('tab.juego', {usuario:param});
  
  };
})

.controller('PuntuacionesCtrl', function($scope,  $timeout) {
  var puntajeReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/usuario/');

  $scope.listaPuntajesCompleta = [];

  puntajeReferencia.on('child_added', function (snapshot) {
    $timeout(function() {
      var puntaje = snapshot.val();
      $scope.listaPuntajesCompleta.push(puntaje);
    });
  });

})

.controller('JuegoCtrl', function($scope, $state, $stateParams, $timeout) {

  $scope.usuario = JSON.parse($stateParams.usuario);

  var preguntaReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/preguntas/');
  $scope.preguntasElegidas = [];
  $scope.pregunta = {};
  $scope.preguntasCorrectas = "0";
  $scope.preguntasIncorrectas = "0";
  $scope.puntaje = "0";
  $scope.preguntasTotal = "0";
  $scope.imagenesResultado = "";
  $scope.claseOpcion1 = "button button-block button-stable";
  $scope.claseOpcion2 = "button button-block button-stable";
  $scope.claseOpcion3 = "button button-block button-stable";
  $scope.claseOpcion4 = "button button-block button-stable";

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
        console.log($scope.preguntasElegidas);
      } 
    });
  });


  $scope.Comprobar = function(opcion){
    $scope.preguntasTotal = parseInt($scope.preguntasTotal) + 1;
    if (parseInt(opcion) == parseInt($scope.pregunta.correcta))
    {
      $scope.preguntasCorrectas = parseInt($scope.preguntasCorrectas) + 1;
      $scope.puntaje = parseInt($scope.puntaje) + parseInt($scope.pregunta.puntaje);
      cambiarIcono(parseInt($scope.preguntasTotal), "1");
    }
    else
    {
      $scope.preguntasIncorrectas = parseInt($scope.preguntasIncorrectas) + 1;
      cambiarIcono(parseInt($scope.preguntasTotal), "0");
    }
    guardarResultado(opcion);
    if (parseInt($scope.preguntasTotal) < 5)
    {
      otraPregunta();
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
  };

  function otraPregunta(){
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
        console.log($scope.preguntasElegidas);
      } 
    });
  }

  function guardarResultado(opcion)
  {
    var usuarioReferencia = new Firebase('https://trivia-bea4e.firebaseio.com/usuario/');
    var fecha = Firebase.ServerValue.TIMESTAMP;
    usuarioReferencia.push({nombre:$scope.usuario.nombre, fechaJuego: fecha, correcta: $scope.pregunta.correcta, respuesta: opcion, pregunta: $scope.pregunta.numero});
  }

  function cambiarIcono(opcion, correcta){
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

})

.controller('ResultadoCtrl', function($scope, $state, $stateParams) {
  $scope.resultado = JSON.parse($stateParams.resultado);

  if ($scope.resultado.correctas > $scope.resultado.incorrectas)
  {
    $scope.resultado.mensaje = "Felicitaciones.";
  }
  else
  {
    $scope.resultado.mensaje = "Vuelve a intentarlo";
  }

})

.controller('PreguntasCtrl', function($scope) {

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

})

/*.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})*/

.controller('PerfilCtrl', function($scope) {
});

