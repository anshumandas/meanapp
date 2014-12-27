'use strict';

angular.module('meanappApp')
  .controller('ProfileCtrl', function ($scope, User, Auth) {
    $scope.getCurrentUser = Auth.getCurrentUser;
})
//AD: this hack allows us to stop BaseCtrl from redirecting to another state
  .run(function($rootScope, $state, User, Auth) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
        if(fromState.templateUrl === "partials/base-form.html"){
          if(toState.url==='/:model/:form/:id/edit' && toParams.form === 'profile') { 
//            console.log(fromState);
//            console.log(fromParams);
//            console.log(toState);
//            console.log(toParams);
            event.preventDefault();    
            //set the details id of user
            Auth.addProfileID(toParams.id)
            .then( function() {
              //add this in the cached current user object as well
              Auth.getCurrentUser().details = toParams.id;
              $state.go('main');//profile.edit, toParams, {notify: false}); 
            })
            .catch( function() {
                console.log('some issue');
            });      
          }
        }
  });
});
