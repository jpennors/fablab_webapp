app.directive('showAlerts', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/showAlerts/alerts_show.html',
    controller: 'alertsCtrl',
  };
});
