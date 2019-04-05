app.controller('editServiceCtrl', function($scope, $uibModalInstance, service, type, Scripts, Services, Engines, ErrorHandler) {
	/**
	*  Initialisation de la vue
	*/

	if(service){
		$scope.service = service;  // Copie de l'objet plutôt que référence
	} else {
		$scope.service = {}
	}
	
	$scope.type = type
	$scope.errors  = false;
	$scope.saving  = false;
	$scope.scripts = [];

	/*
	*  Récupération des Scripts
	*/
	Scripts.get({}, function(data){
		$scope.scripts = data.data;
	}, function(error) {
		ErrorHandler.alert(error);
	});

	/*
	*  Récupération des Engines
	*/
	Engines.get({}, function(data){
		$scope.engines = data.data;
		// On récupère la machine dans le front
		if ($scope.service.engine_id) {
			$scope.service.engine = data.data.filter((r)=>r.id == $scope.service.engine_id)[0]
		}
	}, function(error) {
		ErrorHandler.alert(error);
	});

	/**
	*  Enregistre les modifications
	*/
	$scope.save = function() {
		$scope.errors   = false;
		$scope.saving   = true;

		$scope.service.script_id = $scope.service.script.id
		if($scope.service.engine)
			$scope.service.engine_id = $scope.service.engine.id
		else 
			$scope.service.engine_id = null
		
		if ($scope.type == "create"){
			Services.save($scope.service, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		} else if ($scope.type == "edit"){
			Services.update({id : $scope.service.id}, $scope.service, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		}
	};

	/**
	*  Supprime le service
	*/
	$scope.deleteModal = function() {
		Services.delete({id : $scope.service.id}, $scope.service, function(data){
			$uibModalInstance.close();
			$scope.saving = false;
		}, function(error){
			ErrorHandler.alert(error);
			$scope.saving = false;
		});
	};

	/*
	*  Ajoute un script
	*/
	$scope.setScript = function(script) {
		$scope.service.script = script;
	};

	/*
	*  Ajoute une machine
	*/
	$scope.setEngine = function(engine) {
		$scope.service.engine = engine;
	};

	/**
	*  Ferme la vue modal
	*/
	$scope.cancel = function() {
	$uibModalInstance.dismiss('cancel');
	};
});
