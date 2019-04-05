app.controller('enginePartAlertsCtrl', function($http, $scope, $window, ErrorHandler, EngineParts){

    init = function(){
        EngineParts.get({}, function(res) {
            console.log("pourlet", res)
            $scope.ep = res.data
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
    init()

    /**
    *   Filtre
    */
    $scope.filter = {}
    $scope.filter.statusFilter = function(){
        return function(pe){
            return (pe.need_maintenance == true)
        }
    }

    /**
    *   Maintenance exécutée
    *
    */
    $scope.resetMaintenance = function($id){
        console.log($id)
        EngineParts.resetMaintenance({id: $id}, function(res){
            init()
        })
    }
});
