/**
 *  Factory liée à la ressource ServiceScript
 */
app.factory('Scripts', function($resource){
  return $resource(__ENV.apiUrl + "/scripts/:id", {}, {
       'update': { method:'PUT' },
   });
});
