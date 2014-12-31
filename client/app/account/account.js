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
      .state('complete', {
        url: '/complete/:hash',
        templateUrl: 'app/account/signup/signupComplete.html',
        controller: 'SignupCtrl'
      })
      .state('reset', {
        url: '/reset',
        templateUrl: 'app/account/reset/reset.html',
        controller: 'ResetCtrl'
      })
      .state('resetComplete', {
        url: '/resetComplete/:hash',
        templateUrl: 'app/account/reset/resetComplete.html',
        controller: 'ResetCtrl'
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
        templateUrl: 'partials/edit-form.html',
        controller: 'BaseCtrl',
//        onExit: function($stateParams, $state){
//            //AD: gets called after $stateChangeStart
//        }
      })
      .state('profile.edit', {
        url: '/:pid/edit',
        templateUrl: 'partials/edit-form.html',
        controller: 'BaseCtrl'
      })
      .state('profile.view', {
        url: '/:pid/edit',
        templateUrl: 'partials/view-form.html',
        controller: 'BaseCtrl'
      })
  });