/**
 *  Factory liée à la ressource Maintenances
 */
app.factory('Maintenances', function($resource){
    return $resource(__ENV.apiUrl + "/maintenances/:id", {}, {
          'update': { method:'PUT' }
      });
  });
  
