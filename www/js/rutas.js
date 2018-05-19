angular.module('demoApp.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/menuContent',
    templateUrl: 'templates/menu.html'
    
  })

  .state('app.pin', {
    url: '/pin',
    views: {
      'menuContent': {
        templateUrl: 'templates/pin.html',
        controller: 'pinCtrl'

      }
    }
  })

  .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
    })

  .state('app.movimientos', {
      url: '/movimientos',
      views: {
        'menuContent': {
          templateUrl: 'templates/movimientos.html',
          controller: 'movimientosCtrl'
        }
      }
    })
    .state('app.configuracion', {
      url: '/configuracion',
      views: {
        'menuContent': {
          templateUrl: 'templates/configuracion.html',
          controller: 'ConfiguracionCtrl'
        }
      }
    })
    .state('app.promociones', {
      url: '/promociones',
      views: {
        'menuContent': {
          templateUrl: 'templates/promociones.html',
          controller: 'promocionesCtrl',
          cache: false,
        }
      }
    })
     .state('app.historial', {
      url: '/historial',
      views: {
        'menuContent': {
          templateUrl: 'templates/historial.html',
          controller: 'historialCtrl'
        }
      }
    })

   // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/menuContent/login');
});