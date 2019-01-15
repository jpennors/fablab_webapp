/**
 *  Factory liée à la ressource ServiceScript
 */
app.factory('Services', function($resource){
  return $resource(__ENV.apiUrl + "/services/:id", {}, {
       'update': { method:'PUT' },
   });
});
