app.controller('paymentConfirmationCtrl', function($scope, $http, ErrorHandler, $location) {

	$scope.loading = true
	
	init = function(){

		// Récupération des informations de la dernière transaction liée à la session de l'utilisateur
		$http({
	        method : 'GET', 
	        url : __ENV.apiUrl + "/payutc/transaction/info",
	    }).then(function(data){
			$scope.loading = false
	    	$scope.transaction = data.data.data

	    }, function(error){
	    	$scope.loading = false
	    	console.log(error)
            ErrorHandler.alert(error.data.meta);
            $location.path("/")
	    });

	}
	
	init()


})
