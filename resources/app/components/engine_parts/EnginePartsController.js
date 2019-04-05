app.controller('enginePartsCtrl', function($scope, $http, ErrorHandler, Engines, EngineParts, $uibModal, $location, $rootScope) {

    
    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
    // if(!$rootScope.can('list-engine-part'))
    //   $location.path("/error/404");
    // if(0);
    // else{
        EngineParts.get({}, function(res){
            $scope.engineparts = res.data;

        }, function(error){
            ErrorHandler.alert(error);
        });

        /* $scope.iconColor = function(engine) {
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
        } */

        $scope.delete = function(id) {
            var aSupprimer = $scope.engineparts.filter((e)=>e.id==id)[0];
            var index = $scope.engineparts.indexOf(aSupprimer);

            EngineParts.remove({id:id}, function() {
                $scope.engineparts.splice(index, 1);
            })
        }

        //Ouvre la modale avec les détails d'un objet
        $scope.open = function(id, type) {
            var selected = $scope.engineparts.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
                // TODO instanciation create
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'app/components/engine_parts/modal/engine_parts_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'enginePartsEditCtrl'
            });

            // On modifie dans la liste de consommables l'objet qui vient d'être édité
            modalInstance.result.then(function(res) {
                if(res.type == "create") {
                    $scope.engineparts.push(angular.copy(res.changedEnginePart));
                }else if(res.type=="edit") {
                    $scope.engineparts[$scope.engineparts.indexOf(selected)] = angular.copy(res.changedEnginePart);
                }
                else if(res.type=="delete"){
                    $scope.delete(res.id);
                }
            })
        }
    // }
});
