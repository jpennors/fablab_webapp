app.controller('alertsCtrl', function($http, $scope, ErrorHandler, Products, Expendables, Tools, $uibModal){
    $scope.alerts = {
        expendables:[],
        products:[]
    };
    Products.get({}, function(res){
        $scope.alerts.products = res.data.filter(p => p.remainingQuantity <= p.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });
    Expendables.get({}, function(res){
        $scope.alerts.expendables = res.data.filter(e => e.remainingQuantity <= e.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });
    Tools.get({}, function(res){
        $scope.alerts.tools = res.data.filter(e => e.remainingQuantity <= e.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.open = function(element, type) {

        var templateUrl, controllerName;
        switch (type) {
            case 'product':
                templateUrl = 'app/components/products/modal/products_edit.html';
                controllerName = 'productsEditCtrl';
                break;
            case 'expendable':
                templateUrl = 'app/components/expendables/modal/expendables_edit.html';
                controllerName = 'expendablesEditCtrl';
                break;
            case 'tool':
                templateUrl = 'app/components/tools/modal/tools_edit.html';
                controllerName = 'toolsEditCtrl';
                break;
            default:
        }

        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: templateUrl,

            resolve:{
                object: function() {
                    return angular.copy(element);
                },
                type: function() {
                    return 'show';
                }
            },
            controller: controllerName
        });

    }

});
