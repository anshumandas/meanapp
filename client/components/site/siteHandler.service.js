'use strict';

angular.module('meanappApp')
  .factory('SiteHandler', function SiteHandler($location, $rootScope, $http, Site) {
    var currentSite;//=Site.get(); //for singleton. Initial get does not seem to be working for reveal.
      //AD: issue is probably that the nav and reveal try loading at the same time. currentSite is not initialized properly.
      //If we use above, then it is the promise that gets associated but not the full thing.
      
    return {        
      getCurrentSite: function(callback){ 
        var cb = callback || angular.noop;

        if(currentSite === undefined) {            
          Site.get({}, function(data) {
                currentSite = data;
                return cb(currentSite);
            }, function(err) {
                return cb(err);
            }.bind(this)).$promise;
        } else {
            cb(currentSite);
        }
      },
      list: function(callback){
        var cb = callback || angular.noop;

      }
    };
  });
