app.controller('editEntityCtrl', function($scope, $uibModalInstance, entity, type, Entities, ErrorHandler) {
    
    /**
     *  Initialisation de la vue
     */
    $scope.entity = entity;  // Copie de l'objet plutôt que référence
    $scope.errors  = false;
    $scope.saving  = false;
    $scope.type = type;

    /**
     *  Enregistre les modifications
     */
    $scope.save = function() {
        $scope.errors   = false;
        $scope.saving   = true;
        if ($scope.type == "edit"){
            Entities.update({id : $scope.entity.id}, $scope.entity, function(data){
                $uibModalInstance.close();
                $scope.saving = false;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        } else if ($scope.type == "create"){
            Entities.save($scope.entity, function(data){
                $uibModalInstance.close();
                $scope.saving = false;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        }
    };

    /**
     *  Ferme la vue modal
     */
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     *  Supprime le entité
     */
    $scope.deleteModal = function() {
        Entities.delete({id : $scope.entity.id}, function(data){
            $uibModalInstance.close()
        }, function(error){
            var newError = {}
            newError.message = error.data.data
            ErrorHandler.alert(newError);
        });
    };
})