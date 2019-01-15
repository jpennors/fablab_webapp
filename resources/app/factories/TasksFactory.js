/**
 *  Factory liée à la ressource Tasks
 */
app.factory('Tasks', function($resource){
  return $resource(__ENV.apiUrl + "/tasks/:id", {}, {
        'update': { method:'PUT' }
    });
});
