/**
 *  Factory liée à la ressource Engines
 */
app.factory('Engines', function($resource){
  return $resource(__ENV.apiUrl + "/engines/:id", {}, {
        'save' : {
          method: 'POST',
          transformRequest: function(data) {
            if (data === undefined)
              return data;

              var fd = new FormData();
              angular.forEach(data, function(value, key) {
                if (value instanceof FileList) {
                  if (value.length == 1) {
                    fd.append(key, value[0]);
                  } else {
                    angular.forEach(value, function(file, index) {
                      fd.append(key + '_' + index, file);
                    });
                  }
                } else {
                  fd.append(key, value);
                }
              });

              return fd;

          },
          headers: {'Content-Type': undefined}
        },
        'update': {
          method:'PUT',
        }
    });
});
