'use strict';

angular.module('meanappApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, SiteHandler, LoginModal) {

    $scope.login = LoginModal; 
      
   // $scope.$prepareForReady();
    SiteHandler.getCurrentSite(function(site) {
        //TODO: check if error
        $scope.site = site;
        if(site && site.welcome){
            $scope.menu = $scope.site.nav.menu;
    //    }, function(err) {
    //      $scope.$onFailure(err);
         //   $scope.$onReady('ready');
        }
    });
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
      
    var $http, $state;
 
    $scope.logout = function() {
      Auth.logout();
      $location.path('/welcome');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });