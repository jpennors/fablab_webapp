/**
 *  Factory liée à la ressource Roles
 */
app.factory('Roles', function($resource){
  return $resource(__ENV.apiUrl + "/roles/:id", {}, {
      'update': { method:'PUT' }
  });
});
