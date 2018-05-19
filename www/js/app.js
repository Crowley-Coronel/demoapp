// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('demoApp', ['ionic','ngCordova' ,'ngStorage','demoApp.routes', 'demoApp.controllers','demoApp.services','demoApp.factory'])

.run(function($ionicPlatform,$localStorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

  var notificationOpenedCallback = function(jsonData) {
  	console.log()
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    console.log(jsonData);
  };

  var getidFunc = function(response) {
    console.log('Respuesta: ' + JSON.stringify(response));
    console.log(response);
  };

  window.plugins.OneSignal
    .startInit("9707c639-7a2d-4f7f-b9a5-8e9dce1e4c74")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

  window.plugins.OneSignal.getIds(function(ids){
  	//  console.log('prueeeeebas');
	 // console.log(ids.userId);
	  $localStorage.playerId = ids.userId;
  });


  /*  if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }*/
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }



    
  });
});