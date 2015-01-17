'use strict';

angular.module('meanappApp')
  .controller('WelcomeCtrl', function ($scope, $timeout, SiteHandler) {
    SiteHandler.getCurrentSite(function(site) {
        //TODO: check if error
        $scope.site = site;
        $scope.slides = [];
        if(site && site.welcome){
            $scope.site.welcome.slides.forEach(function (element) { 
                $scope.slides.push({ 'steps': element.steps  });
            });            
            $scope.reveal = $scope.site.welcome.reveal;
        }
    });
});