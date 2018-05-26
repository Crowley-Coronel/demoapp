angular.module('demoApp.controllers', [])


.controller('MenuCtrl', function($scope, $ionicModal, $timeout, checkActivo,$state) {
  
 

})

.controller('loginCtrl', function($ionicModal,$rootScope,$ionicPopup,$http,$ionicHistory,$state,$scope,$stateParams,checkActivo,$ionicSideMenuDelegate,url,$ionicLoading,$localStorage) {
  $ionicSideMenuDelegate.canDragContent(false);
      $scope.recuperar={};
   verificarLogin();

   function verificarLogin(){
   // alert($localStorage.token);
    if($localStorage.token){
      $state.go('app.historial');
                  //$ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({ disableBack: true });

    }

   }


   $scope.submit = function(usuario){
            $ionicLoading.show({
                              content: 'Iniciando sesion',
                              animation: 'fade-in',
                              showBackdrop: true,
                              maxWidth: 200,
                              showDelay: 0
                               });

  //Encriptando password
  var passCrypted = CryptoJS.MD5(usuario.password).toString();
  // llamando a servicio de api login
  var link = url.apiLogin();

  //realizando la peticion al servidor (post de login)
  $http({
          method: 'POST',
          url: link,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {correo: usuario.email, password: passCrypted}
        }).success(function (res) {
  
                if(res['logueado']){
                  $localStorage.id = res['id'];
                  $localStorage.token = res['token'];
                  $localStorage.nombres = res['nombres'];
                  $rootScope.nombres = res['nombres'];
                  $rootScope.saldo = res['saldo'];
                  //alert("logueado");
                  $state.go('app.historial');
                  //$ionicHistory.clearHistory();
                  $ionicHistory.nextViewOptions({ disableBack: true });
                  $ionicLoading.hide();

                }else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Verifica tus datos'
                              });
                }
            });
      }


//seccion para registrar usuario desde panel modal


$scope.registrar = function(registro){
  var link = url.apiRegistro();
  
 $http.post(link, { nombres: registro['nombres'],edad: registro['edad'],telefono: registro['telefono'],correo: registro['correo'],password: registro['password'],tipo_cuenta: registro['cuenta'] }).then(function(respuesta) {

                      console.log(respuesta['data']['preregistrado']);
                      console.log(respuesta);

                      if(respuesta['data']['preregistrado']){

                      	$ionicPopup.alert({
                                title: 'Usuario pre registrado',
                                template: 'Espere un email con el link de activacion!'
                              });

                        //alert('usuario preregistrado, espere su confirmacion por email');
                      }else{
                        //alert('No registrado!');
                        $ionicPopup.alert({
                                title: 'Error',
                                template: 'Error al registrar!'
                              });
                      }   
        });


 }

 $scope.recuperarPass = function(usuario){

  var link = url.recuperarPass();
  
 $http.post(link, { correo: usuario.email}).then(function(respuesta) {

                     // console.log(respuesta['data']['send']);
                     // console.log(respuesta);

                      if(respuesta['data']['send']){
                      	$ionicPopup.alert({
                                title: 'Mensaje',
                                template: 'Se ha enviado un email para reestablecer su contraseña'
                              });

                        //alert('Se ha enviado un mensaje a su correo para reestablecer la contraseña');
                      }else{
                       // alert('Error al enviar mensaje');
                        $ionicPopup.alert({
                                title: 'Error',
                                template: 'Se encontro un error al enviar el mensaje!'
                              });
                      }   
        });

}


/// Seccion para abir el panel modal de registro

  $ionicModal.fromTemplateUrl('templates/registro.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalRegister = modal;
    });

    // Abriendo modal
    $scope.openRegister = function() {
        //$scope.cleanVariables();
        $scope.modalRegister.show();
    };

    // Cerrando modal
    $scope.closeRegister = function() {
       // $scope.cleanVariables();
        $scope.modalRegister.hide();
    };


///modal para recuperacion de contraseña
 $ionicModal.fromTemplateUrl('templates/recuperarpass.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modalRecuperacion) {
        $scope.modalRecuperacion = modalRecuperacion;
    });

    // Abriendo modal
    $scope.openRecuperacion = function() {
        //$scope.cleanVariables();
        $scope.modalRecuperacion.show();
    };

    // Cerrando modal
    $scope.closeRecuperacion = function() {
       // $scope.cleanVariables();
        $scope.modalRecuperacion.hide();
    };



})


.controller('historialCtrl', function($scope,$http,$ionicPopup,$ionicSideMenuDelegate, $stateParams,checkActivo,url,Almacenamiento,Movimientos,$localStorage,$ionicPlatform,$timeout,$ionicLoading) {
$ionicSideMenuDelegate.canDragContent(true);
 //alert($localStorage.playerId);
 $scope.listCanSwipe = true;
 $scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;


 $ionicLoading.show({
  content: 'Cargando datos',
  animation: 'fade-in',
  showBackdrop: true,
  maxWidth: 200,
  showDelay: 0
                             
  });
 
 cargarDatos();  

function cargarDatos(){
 $scope.local = false;
 $scope.remote = false;
 $scope.verMensaje = false;
 $scope.movimientos = {};
  
    $timeout(function() {

      if(navigator.connection.type == Connection.NONE) {
        //si no existe conexion carga los datos locales
           $ionicLoading.hide();
           $scope.local=true;
           $scope.remote=false;
           
           obtenerMovimientos();
      }else{
        // si existe conexion carga los datos del servidor

      var link = url.obtMovimientos();
      var req = {
             method: 'POST',
             url: link,
             headers: {
               'Auth': $localStorage.token
             },
             data: { id: $localStorage.id  }
            }

      $http(req).then(function(respuesta) {
          if(respuesta['data']['sesion_expirada']){
            //alert(respuesta['data']);
                // alert('Tu session ha expirado');
                 $ionicPopup.alert({
                                title: 'Error',
                                template: 'Por seguridad tu sesion ha expirado'
                              });
              }else{
                console.log(respuesta);
                console.log(respuesta['data'].length);
                  if(respuesta['data'].length>0){
                    $scope.movimientos = respuesta['data'];
                  //  console.log($scope.movimientos);

                    }else{
                     $scope.verMensaje = true;
                     $scope.mensaje = "No se han encontrado datos en el servidor";
                    }
                  }
              });

                $ionicLoading.hide();
                $scope.local=false;
                $scope.remote=true;
                $scope.$broadcast('scroll.refreshComplete');
                //alert('cargar datos de servidor');
            }
                         },5000);
                       }



  function obtenerMovimientos (){
  Movimientos.iniDB();
  Movimientos.obtener().then(obtenerDatosSuccess,obtenerDatosError);
  }

  $scope.edit = function(id){
    console.log("Movimiento editado"+ id);

  }
  $scope.refrescar = function(){
     //Movimientos.obtener().then(obtenerDatosSuccess,obtenerDatosError);
     cargarDatos();

  }

  function obtenerDatosSuccess(response)
    {
     
      if(response && response.rows && response.rows.length > 0)
      {
       $scope.movimientos = [];
        for(var i=0;i<response.rows.length;i++)
        {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.movimientos.push({id:response.rows.item(i).id_cliente,concepto:response.rows.item(i).concepto,monto:response.rows.item(i).monto});

        }
      }else

      {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.verMensaje = true;
        $scope.mensaje = "No se han encontrado datos locales";
              }
    }

      function obtenerDatosError(error)
    {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.verMensaje = true;
      $scope.mensaje = "Error al acceder a datos locales";
           
    }



})


.controller('movimientosCtrl', function($scope,$ionicPopup,$stateParams,checkActivo,Movimientos,$http,url,$localStorage) {

  iniDatos();

  
function iniDatos(){

  Movimientos.iniDB();
  $scope.nuevoMovimiento = false;
  $scope.movimiento = {};
}


$scope.crearMovimiento = function(){
  $scope.nuevoMovimiento = true;
}

$scope.realizar = function(){

 // console.log($scope.movimiento);
 // Movimientos.iniDB();
  
          //$scope.registro.name = '';
          //alert("Movimiento realizado con exito");
          //fetchTrackers();
          var link = url.apiMovimiento();
          var fecha = new Date();
    //alert($localStorage.id);

        var req = {
         method: 'POST',
         url: link,
         headers: {
           'Auth': $localStorage.token
         },
         data: { id: $localStorage.id, movimiento:  $scope.movimiento.tipo,concepto: $scope.movimiento.concepto, monto:$scope.movimiento.monto, fecha: fecha  }
        }

 $http(req).then(function(respuesta) {

                      //console.log(respuesta['data']['mov_exitoso']);
                     // console.log(respuesta);

            if(respuesta['data']['sesion_expirada']){
               //  alert('Tu session ha expirado');
                 $ionicPopup.alert({
                                title: 'Error',
                                template: 'Tu sesion ha expirado!'
                              });


            }else{

                      if(respuesta['data']['mov_exitoso']){
                          //alert("Error al realizar movmiento local"+ error);
                         // alert("Movimiento realizado exitosamente");
                          $ionicPopup.alert({
                                title: 'Confirmación',
                                template: 'Movimiento realizado exitosamente'
                              });


                      }else{
                        //alert('Error al realizar movimiento');
                        $ionicPopup.alert({
                                title: 'Error',
                                template: 'Error al realizar movimiento'
                              });
                      }   
                      //  alert('Movimiento Exitoso');
                  
                    }
        


        });

      


}


})

.controller('ConfiguracionCtrl', function($scope,$ionicPopup,Movimientos, session,$stateParams,url,$http,$localStorage) {
Movimientos.iniDB();


 $scope.sincronizar = function(){
   Movimientos.vaciarTabla();
  var movSinc = {};
 var link = url.obtMovimientos();
      var req = {
             method: 'POST',
             url: link,
             headers: {
               'Auth': $localStorage.token
             },
             data: { id: $localStorage.id  }
            }

      $http(req).then(function(respuesta) {
          if(respuesta['data']['sesion_expirada']){
           // alert(respuesta['data']);
                 //alert('Tu session ha expirado');
                 $ionicPopup.alert({
                                title: 'Error',
                                template: 'Tu session ha expirado!'
                              });
              }else{
               
                  if(respuesta['data'].length>0){
                    movSinc = respuesta['data'];
                 //movSinc.forEach(function(elementodelarray))
                     movSinc.forEach(function(movimiento) {

                      console.log(movimiento);
                   
                           Movimientos.insertarLocal(movimiento.movimiento, movimiento.concepto,movimiento.monto,movimiento.fecha).then(function(response){

                       console.log('Movimiento Exitoso');
                      //  $scope.movimiento = {};

                                  },function(error){
                            alert("Error al realizar movmiento local"+ error);
                          });

                      
                    });
                 //alert('Sincronizacion correcta');
                 $ionicPopup.alert({
                                title: 'Mensaje',
                                template: 'Sincronizacion correcta'
                              });

                    }else{
                     $scope.verMensaje = true;
                     $scope.mensaje = "No hay movimientos ha sincronizar";
                    }
                  }
              });


 }


 $scope.logout = function(){
  session.logout();

 }


 

})

.controller('promocionesCtrl', function($scope,url,$sce) {
 

 $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

 // checkActivo.stop();
var link = url.promocion();
$scope.promo = {src: link, titulo:"Promo template"}



})



.controller('pinCtrl', function($scope, $stateParams,checkActivo) {
  //checkActivo.stop();
  //checkActivo.verificar();
});

