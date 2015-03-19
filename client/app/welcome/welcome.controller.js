'use strict';

angular.module('meanappApp')
  .controller('WelcomeCtrl', function ($scope, $timeout, SiteHandler) {
    SiteHandler.getCurrentSite(function(site) {
        if(site instanceof Error){
            console.log(site);
        } else {
            $scope.slides = [];
            if(site && site.welcome) {
                if(site.welcome.reveal && site.welcome.reveal.slides){
                    $scope.reveal = site.welcome.reveal;
                    $scope.config = site.welcome.reveal.config;
                    site.welcome.reveal.slides.forEach(function (element) { 
                        $scope.slides.push({ 'steps': element.steps  });
                    }); 
                }
                //AD: other plugins will come here
            }
        }
    });
});