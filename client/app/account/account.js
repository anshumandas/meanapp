'use strict';

angular.module('meanappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('complete', {
        url: '/complete/:hash',
        templateUrl: 'app/account/signup/signupComplete.html',
        controller: 'ActivateCtrl'
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
      });
  });