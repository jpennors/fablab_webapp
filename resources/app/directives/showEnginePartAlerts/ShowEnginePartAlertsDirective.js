app.directive('showEnginePartAlerts', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/showEnginePartAlerts/engine_part_alerts_show.html',
        controller: 'enginePartAlertsCtrl',
    };
});
