'use strict';

angular.module('meanappApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id },
          function(){//data) {
            //AD: corrected this as earlier, the view delete occurred even without server delete
            angular.forEach($scope.users, function(u, i) {
            if (u === user) {
              $scope.users.splice(i, 1);
            }
            });
          },
          function(err) {
            //AD: put some error handle.
            console.log(err);
          });
    };
  });
