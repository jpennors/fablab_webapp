app.controller('editAddressCtrl', function($scope, $uibModalInstance, address, type, Addresses, ErrorHandler) {
    /**
     *  Initialisation de la vue
     */
    $scope.address = address; 
    console.log($scope.address)
    console.log("cc")
    $scope.errors  = false;
    $scope.saving  = false;
    $scope.type = type

    /**
     *  Enregistre les modifications
     */
    $scope.save = function() {
		$scope.errors   = false;
		$scope.saving   = true;

		if($scope.type == "edit"){
			Addresses.update({id : $scope.address.id}, $scope.address, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		} else if ($scope.type == "create") {
			Addresses.save($scope.address, function(data){
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
     *  Supprime le adresse
     */
    $scope.deleteModal = function() {
    	console.log("cc")
    	$scope.saving = true
	    Addresses.delete({id : $scope.address.id}, function(data){
			$uibModalInstance.close();
			$scope.saving = false;
	    }, function(error){
			ErrorHandler.alert(error);
			$scope.saving = false;
	    });

    }
});