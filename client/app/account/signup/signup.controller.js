'use strict';

angular.module('meanappApp')
  .controller('SignupCtrl', function ($scope, $stateParams, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;
      $scope.showFP=false;
      $scope.showLogin=false;
      $scope.showSignup=false;
        
      if(form.$valid) {          
        Auth.initiateReg({
          email: $scope.user.email
        })
        .then( function(res) {
            //AD: this part is used to show the success message
            var message = res.message;
            $scope.errors = {};

            form['email'].$setValidity('mongoose', false);
            $scope.errors['email'] = message;
            
            if(message === 'The specified email address is already in use.'){ //AD: see in environment config
                $scope.showFP=true;
            }                        
        })
        .catch( function(err) {
            var message = err.data.message;
            console.log(message);
            $scope.errors = {};

            form['email'].$setValidity('mongoose', false);
            $scope.errors['email'] = message;
            
            if(message === 'The specified email address is already in use.'){ //AD: see in environment config
                $scope.showFP=true;
            }                        
        });
      }
    };
        
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
        .then( function(res) {
          // Account created. Go to home.
          $location.path('/');
        })
        .catch( function(err) {
            console.log(err);
          err = err.data;
          $scope.errors = {};

          if(!err.errors) {              
            $scope.errors['message'] = err.message;
            if(err.message == 'Token not found. Probably it has expired.'){ //AD: see in environment config
                $scope.showSignup=true;
            } else if(err.message == 'Your account has already been activated.'){ //AD: see in environment config
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

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
