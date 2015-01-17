'use strict';

angular.module('meanappApp')
  .controller('ActivateCtrl', function ($scope, $stateParams, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.activate = function(form) {
      $scope.submitted = true;
      $scope.showFP=false;
      $scope.showLogin=false;
      $scope.showSignup=false;

      if(form.$valid) {          
        Auth.createUser({
          nickname: $scope.user.nickname,
          token: $stateParams.hash,
          password: $scope.user.password
        })
        .then( function(){//res) {
          // Account created. Go to home.
          $location.path('/main');
        })
        .catch( function(err) {
            console.log(err);
          err = err.data;
          $scope.errors = {};

          if(!err.errors) {              
            $scope.errors.message = err.message;
            if(err.message === 'Token not found. Probably it has expired.'){ //AD: see in environment config
                $scope.showSignup=true;
            } else if(err.message === 'Your account has already been activated.'){ //AD: see in environment config
                console.log('here');
                $scope.showLogin=true;
            }                        
          } else {
              // Update validity of form fields that match the mongoose errors
              angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
              });
          }
        });
      }
    };

  });
