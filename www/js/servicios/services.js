angular.module('demoApp.services', [])

/***************************************************************************************
 * Servicio CheckActivo
 **************************************************************************************/

.service('checkActivo', function($interval,$state){
  var timerCount = 0;
  
  var minutos = 1;
  var tick = 1000;
  var modalPin;


  this.verificar = function(){
    $interval(verificador, tick);
    
  }

  this.stop = function(){
    $interval.cancel(verificador);
    timerCount = 0;
  }

  function verificador() {
        timerCount++;
    console.log("verificando");
    console.log(timerCount);
    if(timerCount == 30){
      //alert("Parar ejecucion");
      $interval.cancel(verificador);
      timerCount = 0;  
      $state.go("app.pin");  


    }
}

})


.service('movimientos', function($q,$http){

  this.obtener = function(){
  
       var defered = $q.defer();
        var promise = defered.promise;

        $http.get('http://midominio.com/recursos.json')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }


})



.service('session', function($localStorage,$state,$ionicHistory,Movimientos,$ionicSideMenuDelegate){

    

  
  this.logout = function (){
      
      Movimientos.iniDB();
      Movimientos.vaciarTabla();
      $localStorage.id = undefined;
      $localStorage.nombres = undefined;
      $localStorage.token = undefined;
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true });
      $state.go('app.login');
      $ionicSideMenuDelegate.canDragContent(false);

     }   

})


.service('url', function(){

    
  //var url = "http://localhost/demoapp/api/mobile";
  //var urlPromo = "http://localhost/demoapp/uploads/promocion.png";
  //var url = "http://192.168.1.114/demoapp/api/mobile";
  var url = "http://dim3nsoft.com/demoapp/api/mobile"; 
  var urlPromo = "http://dim3nsoft.com/demoapp/cuentas/";
  
  this.apiRegistro = function (){
    
    return url+"/registrar" ;
  }

  this.apiEliminar = function() {
     
     return url+"/eliminar";


    }

      this.apiLogin = function() {
     
     return url+"/login";


    }
  this.apiPrueba = function() {
     
     return url+"/prueba";


    }


  this.apiMovimiento = function() {
     
     return url+"/agregarMovimiento";


    }

    this.obtMovimientos = function() {
     
     return url+"/getMovimientos";


    }

    this.recuperarPass = function() {
     
     return url+"/peticionMailReestablecer";


    }

    this.promocion = function() {
     
     return urlPromo+"promo.html";


    }

    

});
