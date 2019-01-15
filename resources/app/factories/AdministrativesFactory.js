/**
 *  Factory liée à la ressource Administrative
 */
app.factory('Administratives', function($resource){
  return $resource(__ENV.apiUrl + "/administratives/:id", {}, {
        'update': { method:'PUT' }
    });
});
