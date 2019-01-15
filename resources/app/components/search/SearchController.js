app.controller('searchCtrl', function($scope, $routeParams, Expendables, Tools, Products, Engines, $uibModal) {

    $scope.filterWord = $routeParams.q;
    $scope.loaded = 0;
    Expendables.get({}, function(res){
        $scope.expendables = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Engines.get({}, function(res){
        $scope.engines = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Products.get({}, function(res){
        $scope.products = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Tools.get({}, function(res){
        $scope.tools = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch('filterWord', function(newv){
        // console.log(newv);
        // console.log($scope.expendables);
    });

    $scope.open = function(element, type) {
        var templateUrl, controllerName;
        switch (type) {
            case 'product':
                templateUrl = 'app/components/admin_products/modal/products_edit.html';
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
            case 'engine':
                templateUrl = 'app/components/engines/modal/engines_edit.html';
                controllerName = 'enginesEditCtrl';
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
