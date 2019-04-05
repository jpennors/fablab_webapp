/**
 *  Factory liée à la ressource Wardrobes
 */
app.factory('EngineParts', function($resource){
    return $resource(__ENV.apiUrl + "/engineparts/:id", {}, {
          'save' : {
            method: 'POST'
          },
          'update': {
            method:'PUT',
          },
          'resetMaintenance' : {
	          method: 'GET',
	          url : __ENV.apiUrl + "/engineparts/reset/:id",
        	}
      });
  });
  
