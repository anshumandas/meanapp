'use strict';

angular.module('meanappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('chpwd', {
        url: '/chpwd',
        templateUrl: 'app/account/chpwd/chpwd.html',
        controller: 'ChPwdCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('profile.new', {
        url: '/new',
        templateUrl: 'partials/base-form.html',
        controller: 'BaseCtrl',
//        onExit: function($stateParams, $state){
//            //AD: gets called after $stateChangeStart
//        }
      })
      .state('profile.edit', {
        url: '/:pid/edit',
        templateUrl: 'partials/base-form.html',
        controller: 'BaseCtrl'
      })
      .state('reset', {
        url: '/reset',
        templateUrl: 'app/account/reset/reset.html',
        controller: 'ResetCtrl'
      });
  });
//.factory('ProfileSchema', function($resource) {
//  return $resource('/api/schema/profile'); // Note the full endpoint address
//})