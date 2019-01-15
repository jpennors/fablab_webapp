app.directive('showPurchaseAlerts', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/showPurchaseAlerts/purchase_alerts_show.html',
        controller: 'alertsPurchaseCtrl',
    };
});
