'use strict';

angular.module('meanappApp')
  .service('LoginModal', function ($rootScope, $modal, $location, $window) {
      
  return function(isSignup) {
    $rootScope.showingModal = true;
    var modalInstance = $modal.open({
      templateUrl: 'components/loginModal/loginModal.html',
      controller: 'LoginModalCtrl'
    });

    modalInstance.isSignup = isSignup;
    return modalInstance.result.then(function (data) {
        $rootScope.showingModal = false;
        if(isSignup) {            
            $location.path('/welcome'); 
        } else {
            $location.path('/main');     
        }
        if(data) { 
            setTimeout(function() {
              $window.alert(data);
            });
        }
    }, function () {
        $rootScope.showingModal = false;
//      console.log('Modal dismissed at: ' + new Date());
    });
  };
});