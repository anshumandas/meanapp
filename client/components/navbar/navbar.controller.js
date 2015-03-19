'use strict';

angular.module('meanappApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, SiteHandler, LoginModal) {

    $scope.login = function() {
        LoginModal(false); 
    };
    $scope.signup = function() {
        LoginModal(true); 
    };
      
    $scope.hasPermission = function(permission){
        var r = (permission === 'guest' || (permission === 'user' && Auth.isLoggedIn()) || (permission === 'admin'  && Auth.isLoggedIn() && Auth.isAdmin()));
        
//        console.log('perms:'+permission+'='+r);
        return r;
    };
     
    $scope.run = function(fn){
        console.log(fn);
        return $scope.$eval(fn);
    };
      
    SiteHandler.getCurrentSite(function(site) {
        $scope.site = site;
        if(site && site.header){
            for(var key in site.header){
                $scope[key] = site.header[key];
            }            
        }
    });
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
      
    $scope.logout = function() {
        console.log('Logging out');
      Auth.logout();
      $location.path('/welcome');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });