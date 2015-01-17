'use strict';

angular.module('meanappApp')
  .controller('LoginModalCtrl', function ($scope, $window, $modalInstance) {
      
    $scope.isSignup = $modalInstance.isSignup; 
      
    $scope.auths = [
    {
        provider:'google',
        icon:'fa fa-google-plus',
        clazz:'social-google',
        text:'Google+'
    },
    {
        provider:'facebook',
        icon:"fa fa-facebook",
        clazz:'social-facebook',
        text:"Facebook"
    },
    {
        provider:'twitter',
        icon:"fa fa-twitter",
        clazz:'social-twitter',
        text:"Twitter"
    },
    {
        provider:'github',
        icon:"fa fa-github-alt",
        clazz:'social-github',
        text:"GitHub"
    },
    {
        provider:'linkedin',
        icon:"fa fa-linkedin",
        clazz:'social-linkedin',
        text:"LinkedIn"
    },
    {
        provider:'dropbox',
        icon:"fa fa-dropbox",
        clazz:'social-github',
        text:"DropBox"
    },
    {
        provider:'amazon',
        icon:"zocial-amazon",
        clazz:'social-facebook',
        text:"Amazon"
    },         
    {
        provider:'windows',
        icon:'fa fa-windows',
        clazz:'social-google',
        text:'Windows Live'
    }
//    "fa fa-tumblr-sign" - Tumblr
//    "zocial-bitbucket" - Bitbucket
//    "zocial-evernote" - Evernote
//    "zocial-meetup" - Meetup
//    "fa fa-weibo" - Weibo
//    "fa fa-foursquare" - Foursquare
//    "fa fa-stackexchange" - Stack Exchange
//    "fa fa-trello" - Trello
//    "zocial-wordpress" - Wordpress
    ];

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
      
    $scope.done = function(data){
      $modalInstance.close(data);
    }
})
.controller('SignInCtrl', function ($scope, Auth) {

    $scope.user = {};
    $scope.errors = {};
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
            $scope.done();
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    //AD: I will enable this in next release after adding server side Remember me code
//    $scope.initRemember = function(){
//    $('.button-checkbox').each(function(){
//        var $widget = $(this),
//            $button = $widget.find('button'),
//            $checkbox = $widget.find('input:checkbox'),
//            color = $button.data('color'),
//            settings = {
//                    on: {
//                        icon: 'glyphicon glyphicon-check'
//                    },
//                    off: {
//                        icon: 'glyphicon glyphicon-unchecked'
//                    }
//            };
//
//        $button.on('click', function () {
//            $checkbox.prop('checked', !$checkbox.is(':checked'));
//            $checkbox.triggerHandler('change');
//            updateDisplay();
//        });
//
//        $checkbox.on('change', function () {
//            updateDisplay();
//        });
//
//        function updateDisplay() {
//            var isChecked = $checkbox.is(':checked');
//            // Set the button's state
//            $button.data('state', (isChecked) ? "on" : "off");
//
//            // Set the button's icon
//            $button.find('.state-icon')
//                .removeClass()
//                .addClass('state-icon ' + settings[$button.data('state')].icon);
//
//            // Update the button's color
//            if (isChecked) {
//                $button
//                    .removeClass('btn-default')
//                    .addClass('btn-' + color + ' active');
//            }
//            else
//            {
//                $button
//                    .removeClass('btn-' + color + ' active')
//                    .addClass('btn-default');
//            }
//        }
//        function init() {
//            updateDisplay();
//            // Inject the icon if applicable
//            if ($button.find('.state-icon').length == 0) {
//                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
//            }
//        }
//        init();
//    });
//  };
})
.controller('SignUpCtrl', function ($scope, Auth) {
    $scope.user = {};
    $scope.errors = {};
    
    var submit = function(form,isReset) {
        
      $scope.submitted = true;

      if(form.$valid) {          
        Auth.initiateReg({
          email: $scope.user.email,
          reset: isReset
        })
        .then( function(res) {
            //AD: this part is used to show the success message
            var message = res.message;
            //set an alert
            $scope.done(message);
        })
        .catch( function(err) {
            console.log(err);
          $scope.errors.other = err.data.message;
        });
      }
    };
        
    $scope.signup = function(form) {
        submit(form,false);
    };
    
    $scope.reset = function(form) {
        submit(form,true);
    };
});