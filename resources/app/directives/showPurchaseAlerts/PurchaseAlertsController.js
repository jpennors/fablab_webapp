app.controller('alertsPurchaseCtrl', function($http, $scope, $window, ErrorHandler, PurchasedElements, $rootScope){


    if($rootScope.can('view-all-entity-purchase')){
        PurchasedElements.get({}, function(res) {
            $scope.pes = res.data        
            for (var i = $scope.pes.length - 1; i >= 0; i--) {
                var deadline = $scope.pes[i].deadline
                $scope.pes[i].deadline = new Date(moment(deadline).get('year'), moment(deadline).get('month'), moment(deadline).get('date'))
            }
        }, function(error){
            ErrorHandler.alert(error);
        });
    }   

    /**
    *   Redirection
    */
    $scope.redirect = function(id) {
        $window.location.href = "#/purchases/" + id + "/edit"
    }

    /**
    *   Filtre
    */
    $scope.filter = {}
    $scope.filter.statusFilter = function(){
        return function(pe){
            return (pe.status == 2 || pe.status == 0)
        }
    }
});
