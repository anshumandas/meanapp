'use strict';

angular.module('meanappApp')
  .factory('Site', function ($resource) {
    return $resource('/api/sites/:id/:controller', {
      id: '@_id'
    },
    {
        //AD: this is for initiating registration
//          get: {
//            method: 'GET',
//            params: {
//              id:'name'
//            }
//          }
	  });
  });
