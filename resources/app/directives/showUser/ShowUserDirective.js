app.directive('showUser', function() {
  return {
    restrict: 'E',
    scope: {
      user : '=user'
    },
    templateUrl: 'app/directives/showUser/user_show.html'
  };
});
