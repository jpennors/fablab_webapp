/**
 *  Factory liée à la ressource Purchases
 */
app.factory('Purchases', function($resource){
  return $resource(__ENV.apiUrl + "/purchases/:id/:verb", {}, {
        'update': { method:'PUT' },

        // http://notjoshmiller.com/server-side-pdf-generation-and-angular-resource/
        // https://github.com/eligrey/FileSaver.js
        'pdf': {
            method: 'GET',
            params: { 'verb' : 'pdf' },
            headers: {
                accept: 'application/pdf'
            },
            responseType: 'arraybuffer',
            cache: true,
            transformResponse: function (data) {
                var pdf;
                if (data) {
                    pdf = new Blob([data], {type: "application/pdf"});
                }
                return { pdf : pdf };
            }
        },
        'quote': {
            method: 'GET',
            params: { 'verb' : 'quote' },
            headers: {
                accept: 'application/pdf'
            },
            responseType: 'arraybuffer',
            cache: true,
            transformResponse: function (data) {
                var pdf;
                if (data) {
                    pdf = new Blob([data], {type: "application/pdf"});
                }
                return { pdf : pdf };
            }
        },
        'address': {
          method: 'PUT',
          params: { 'verb' : 'address'}
        },
        'removeAddress': {
          method: 'PUT',
          params: { 'verb' : 'address/remove'}
        },
        'entity': {
          method:'PUT',
          params: { 'verb' : 'entity'}
        },
    });
});
