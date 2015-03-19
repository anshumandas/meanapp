'use strict';

angular.module('meanappApp', [
  'ui.router',
  'ngCookies',
  'formsAngular',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'btford.socket-io',
  'ui.date',
  'ngGrid',
  'ngCkeditor',
  'ui.select2',
  'uploadModule'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/welcome');
  
    $httpProvider.interceptors.push('authInterceptor');
    
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
        
  })

  .factory('authInterceptor', function ($rootScope, $timeout, $q, $injector, $cookieStore) {   
    var loginModal, $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
      loginModal = $injector.get('LoginModal');
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });  
      
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: 
        function(response) {
            if(response.status === 401) {
                //this can happen while in login modal

                // remove any stale tokens
                $cookieStore.remove('token');            

                if(!$rootScope.showingModal) {
                    var deferred = $q.defer();

                    loginModal()
                      .then(function () {
                        deferred.resolve( $http(response.config) );
                      })
                      .catch(function () {
                        $state.go('welcome');
                        deferred.reject(response);
                      });

                    return deferred.promise;
                }

            }
            return $q.reject(response);
      }
    };
  })

  .run(function ($rootScope, $location, Auth, LoginModal, $state) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (toState.authenticate && !loggedIn) {
          event.preventDefault();
          LoginModal()
            .then(function () {
                return $state.go(toState.name, toParams);
            })
            .catch(function () {
              return $state.go('welcome');
            });
        }
      });
    });
  });

formsAngular.config(['cssFrameworkServiceProvider', 'routingServiceProvider', function (cssFrameworkService, routingService) {
    routingService.start({html5Mode: true, prefix:'/data', routing: 'uirouter'});
    cssFrameworkService.setOptions({framework: 'bs3'});
}]);