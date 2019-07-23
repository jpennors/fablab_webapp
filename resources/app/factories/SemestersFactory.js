/**
 *  Factory liée à la ressource ServiceScript
 */
app.factory('Semesters', function($resource){

    return $resource(__ENV.apiUrl + "/semesters/:id", {}, {
         'update': { method:'PUT' },

         'setCurrentSemester' : {
            method: 'GET',
            url : __ENV.apiUrl + '/semesters/current/:id'
        },

     });
  });
  