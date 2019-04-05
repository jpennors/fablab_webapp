app.controller('expendablesCtrl', function($scope, $http, Expendables, $uibModal, ErrorHandler, $location, $rootScope) {
    
    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-expendable'))
      $location.path("/error/404");

    else{
        function init() {
            $scope.loading = true
            $scope.alertFilterOn = false;
            Expendables.get({}, function(res){
                $scope.expendables = res.data;
                $scope.loading = false
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loading = false
            });
        }

        $scope.alertFilter = function(e) {
            return e.remainingQuantity <= e.minQuantity;
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.expendables.filter((e)=>e.id==id)[0];
            var index = $scope.expendables.indexOf(aSupprimer);

            Expendables.remove({id:id}, function() {
                $scope.expendables.splice(index, 1);
            })
        }

        //Ouvre la modale avec les détails d'un objet
        $scope.open = function(id, type) {
            var selected = $scope.expendables.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
                minQuantity: 0,
                remainingQuantity: 0
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/expendables/modal/expendables_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'expendablesEditCtrl'
            });

            // On modifie dans la liste de consommables l'objet qui vient d'être édité
            modalInstance.result.then(function(res) {
                init()
                if(res.type == "delete"){
                    $scope.delete(res.id);
                }
                // if(res.type == "create") {
                //     $scope.expendables.push(angular.copy(res.changedExpendable));
                // }else if(res.type=="edit") {
                //     $scope.expendables[$scope.expendables.indexOf(selected)] = angular.copy(res.changedExpendable);
                // }
            })
        }

        init();
    }
});
