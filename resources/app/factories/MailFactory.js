/**
 *  Factory liée à la ressource Mail
 */

app.factory('Mail',function($http){
	return {
		send : function(dataMail){

			$http({
				method : 'POST',
				url : __ENV.apiUrl + "/send",
				headers : {
          			'Content-Type': 'application/json'
        		},
        		data : dataMail,
			});
		}
	}
});
