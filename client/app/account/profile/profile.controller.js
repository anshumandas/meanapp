'use strict';

angular.module('meanappApp')
  .controller('ProfileCtrl', function ($scope, $data, $state, User, Auth) {
    $scope.getCurrentUser = Auth.getCurrentUser;

//AD: for state name
    $scope.getStateName = function() {
        if($state.current.name === 'profile.edit') return "Edit";
        if($state.current.name === 'profile.new') return "Create";
        return "View";
      };
      
//AD: this is to control angular forms
  $scope.disableFunctions = $data.disableFunctions;
  $scope.dataEventFunctions = $data.dataEventFunctions;
  $scope.record = $data.record;

  $scope.dataEventFunctions.onAfterCreate = function (data) {
    Auth.addProfileID(data._id)
    .then( function() {
      //add this in the cached current user object as well
      Auth.getCurrentUser().details = data._id;
      $state.go('main');//profile.edit, toParams, {notify: false}); 
    })
    .catch( function() {
        console.log('some issue');
    });      
  };
  $scope.dataEventFunctions.onAfterUpdate = function (data, old) {
//    alert('Here is an example onAfterUpdate event. ' + JSON.stringify(data));
    $state.go('main');//profile.edit, toParams, {notify: false}); 
  };

//})
////AD: this hack allows us to stop BaseCtrl from redirecting to another state
//  .run(function($rootScope, $state, User, Auth) {
//    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
//        if(fromState.templateUrl === "partials/edit-form.html"){
//          if(toState.url==='/:model/:form/:id/edit' && toParams.form === 'profile') { 
////            console.log(fromState);
////            console.log(fromParams);
////            console.log(toState);
////            console.log(toParams);
//            event.preventDefault();    
//            //set the details id of user
//            Auth.addProfileID(toParams.id)
//            .then( function() {
//              //add this in the cached current user object as well
//              Auth.getCurrentUser().details = toParams.id;
//              $state.go('main');//profile.edit, toParams, {notify: false}); 
//            })
//            .catch( function() {
//                console.log('some issue');
//            });      
//          }
//        }
//  });
});
