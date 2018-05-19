angular.module('demoApp.factory', [])

/***************************************************************************************
 * FACTORY
 **************************************************************************************/
.factory("ionicp", function($ionicPlatform) {
return($ionicPlatform);
 
  })



.factory("Almacenamiento", function() {

  
 this.setDatosPersonales = function(){

    console.log("Datos personales seteados");
    return "seteado";

 }

 return{
  setDatos: this.setDatosPersonales
 }
 
})


//.factory("MovimientosLocales", function($cordovaSQLite) {
.factory("Movimientos",['$cordovaSQLite','$ionicPlatform','$q','$localStorage',
  function(sqlite,ionicPlataforma,$q,$localStorage){
    var db;


this.initDB = function(){
      ionicPlataforma.ready(function() {
     
        if(window.cordova)
            {
              db = sqlite.openDB({ name: "demoApp.db", location:"default" });
            }else
            {
              db = window.openDatabase("demoApp.db", '1.0', 'Registros DB', -1);
            }

        
         var query = "CREATE TABLE IF NOT EXISTS movimientos (id_cliente string , movimiento string, concepto string,monto integer,fecha string)";
          runQuery(query,[],function(res) {
            console.log("table created ");
          }, function (err) {
            console.log(err);
          });
      }.bind(this))
 
}

this.insertar = function(movimiento,concepto,monto){
  var deferred = $q.defer();
      var id = 'id_de_prueba';
      var fecha = new Date();
        
      var query = "INSERT INTO movimientos (id_cliente,movimiento,concepto,monto,fecha) VALUES (?,?,?,?,?)";
      runQuery(query,[id,movimiento,concepto,monto,fecha],function(response){
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      },function(error){
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;

}


this.insertarLocal = function(movimiento,concepto,monto,fecha){
  var deferred = $q.defer();
      var id = 'id_de_prueba';
              
      var query = "INSERT INTO movimientos (id_cliente,movimiento,concepto,monto,fecha) VALUES (?,?,?,?,?)";
      runQuery(query,[id,movimiento,concepto,monto,fecha],function(response){
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      },function(error){
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;

}



this.obtenerDatos = function(){
  var deferred = $q.defer();
      var query = "SELECT * from movimientos";
      runQuery(query,[],function(response){
        //Success Callback
       // console.log(response);
       // reigstros = response.rows;
        deferred.resolve(response);
      },function(error){
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
}


this.dropTable = function(){
     var deferred = $q.defer();
      var query = "DELETE FROM movimientos WHERE 1";
      runQuery(query,[],function(response){
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      },function(error){
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
}


function runQuery(query,dataArray,successCb,errorCb)
    {
      ionicPlataforma.ready(function() {     
          sqlite.execute(db, query,dataArray).then(function(res) {
            successCb(res);
          }, function (err) {
            errorCb(err);
          });
      }.bind(this));
    }


return{
  iniDB: this.initDB,
  insertar: this.insertar,
  obtener: this.obtenerDatos,
  insertarLocal: this.insertarLocal,
  vaciarTabla: this.dropTable

 }


 
}]);