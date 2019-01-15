/**
 *  Factory liée à la ressource Categories
 */
app.factory('Categories', function($resource){
  return $resource(__ENV.apiUrl + "/categories/:id", {}, {
        'update': { method:'PUT' }
    });
});
