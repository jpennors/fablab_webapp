app.controller('enginesCtrl', function($scope, $http, ErrorHandler, Engines, $uibModal, $location, $rootScope) {

    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    if(!$rootScope.can('list-engine'))
      $location.path("/error/404");

    else{

        $scope.loading = true

        Engines.get({}, function(res){
            $scope.engines = res.data;
            $scope.loading = false
        }, function(error){
            ErrorHandler.alert(error);
            $scope.loading = false
        });

        $scope.iconColor = function(engine) {
            var color;
            switch (engine.status) {
                case "Disponible":
                    color = '#c2db9b';
                    break;
                case "En reparation":
                    color = '#f3997b';
                    break;
                case "En utilisation":
                    color = '#ffdb93';
                    break;
                case "En maintenance":
                    color = '#f3997b';
                    break;
                default:
                    color = '#c2db9b';
            }
            return {'background-color':color};
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.engines.filter((e)=>e.id==id)[0];
            var index = $scope.engines.indexOf(aSupprimer);

            Engines.remove({id:id}, function() {
                $scope.engines.splice(index, 1);
            })
        }

        //Ouvre la modale avec les détails d'un objet
        $scope.open = function(id, type) {
            var selected = $scope.engines.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
                // TODO instanciation create
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/engines/modal/engines_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'enginesEditCtrl'
            });

            // On modifie dans la liste de consommables l'objet qui vient d'être édité
            modalInstance.result.then(function(res) {
                if(res.type == "create") {
                    $scope.engines.push(angular.copy(res.changedEngine));
                }else if(res.type=="edit") {
                    $scope.engines[$scope.engines.indexOf(selected)] = angular.copy(res.changedEngine);
                }
                else if(res.type=="delete"){
                    $scope.delete(res.id);
                }
            })
        }
    }
});
