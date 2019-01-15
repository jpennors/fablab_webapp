/**
 *  Factory liée à la ressource PurchasedElement
 */
app.factory('PurchasedElements', function($resource){
  return $resource(__ENV.apiUrl + "/purchases/:idP/elements/:idE", {}, {

        'updateElement': { 
                    method: 'POST',
                    url : __ENV.apiUrl + "/purchases/update/elements",
         },
        'storeElement' : {
            method: 'POST',
            url : __ENV.apiUrl + "/purchases/elements"
        },
        'getFileList' : {
            method: 'GET',
            url : __ENV.apiUrl + '/filelist/:id'
        },
        'getFile' : {
            method : 'GET',
            url : __ENV.apiUrl + '/file/purchasedelement/:id/:fileName',
        }
    });
});
