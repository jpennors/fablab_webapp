/**
 *  Factory liée à la ressource Permission
 */
app.factory('Permissions', function($resource){
  return $resource(__ENV.apiUrl + "/permissions/:id", {}, {
    });
});
