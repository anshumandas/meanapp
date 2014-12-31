'use strict';

angular.module('meanappApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
        //AD: this is for initiating registration
          initiate: {
            method: 'POST',
            params: {
              controller:'initiate'
            }
          },
          changePassword: {
            method: 'PUT',
            params: {
              controller:'password'
            }
          },
            //AD:added this for profile id save        
          addProfileID: {
            method: 'PUT',
            params: {
              controller:'addProfile'
            }
          },
          get: {
            method: 'GET',
            params: {
              id:'me'
            }
          }
	  });
  });
