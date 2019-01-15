app.factory('Addresses', function($resource){
    return $resource(__ENV.apiUrl + "/addresses/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('Administratives', function($resource){
  return $resource(__ENV.apiUrl + "/administratives/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('Alert', function($uibModal){
  return {
    open: function(title, content) {
      $uibModal.open({
        animation: true,
        size: 'sm',
        template:
        `<div class="source-list-modal">
            <div class="modal-header">
                <h3 class="modal-title">
                    ` + title + `
                </h3>
            </div>
            <div class="modal-body">
              ` + content + `
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" ng-click="dismiss()">Fermer</button>
            </div>
        </div>`,
        resolve: {
        },
        controller: function($scope, $uibModalInstance) {
          $scope.dismiss = function() {
            $uibModalInstance.dismiss()
          };
        }
      });
    }
 };
});

app.factory('Auth', function(UTCAuth, Roles, $q){
    return {
        can: function(permission) {
            var res = false;

            angular.forEach(UTCAuth.permissions, function (perm) {
                if (perm.slug == permission) {
                    res = true;
                }
            });

            return res;
        }
    };
});

app.factory('Categories', function($resource){
  return $resource(__ENV.apiUrl + "/categories/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('ConfirmFactory', function($uibModal) {
  var factory = {};
  factory.open = function (text, onOk) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/directives/modalConfirm/modal_show.html',
      controller: 'ModalConfirmCtrl',
      resolve: {
        text: function () {
          return text;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      onOk();
    }, function () {
    });
  };

  return factory;
})

app.factory('Csv', function(){


    return factory = {

        products : function(csvLines){

            var products = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                products[i-1]={}
                products[i-1].name = csvLines[i][0]
                products[i-1].description = csvLines[i][1]
                products[i-1].picture = csvLines[i][2]
                products[i-1].price = parseFloat(csvLines[i][3]);
                products[i-1].quantityUnit = csvLines[i][4]
                products[i-1].remainingQuantity = csvLines[i][5]
                products[i-1].minQuantity = csvLines[i][6]
                products[i-1].brand = csvLines[i][7]
                products[i-1].supplier = csvLines[i][8]
                products[i-1].supplierLink = csvLines[i][9]
                products[i-1].documentation = csvLines[i][10]
                products[i-1].dataSheet = csvLines[i][11]
                products[i-1].room = csvLines[i][12]
                products[i-1].wardrobe = csvLines[i][13]
                products[i-1].categorie = csvLines[i][14]
            }
            return products;
        },

        productsHeader : function(){
            var headers = [
                'Nom', 
                'Description',
                'Image', 
                'Prix', 
                'Unité', 
                'Quantité', 
                'Quantité minimale', 
                'Marque', 
                'Fournisseur', 
                'Lien fournisseur', 
                'Documentation', 
                'Fiche technique', 
                'Salle',
                'Etagère',
                'Catégorie'
            ];
            return headers;
        },

        engines : function(csvLines){

            var engines = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                engines[i-1]={}
                engines[i-1].name = csvLines[i][0]
                engines[i-1].description = csvLines[i][1]
                engines[i-1].picture = csvLines[i][2]
                engines[i-1].status = csvLines[i][3];
                engines[i-1].documentation = csvLines[i][4]
                engines[i-1].dataSheet = csvLines[i][5]
                engines[i-1].room = csvLines[i][6]
            }
            return engines;
        },

        enginesHeader : function(){
            var headers = [
                'Nom', 
                'Description', 
                'Image', 
                'Statut', 
                'Documentation', 
                'Fiche technique', 
                'Salle'
            ];
            return headers;
        },


        tools : function(csvLines){

            var tools = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                tools[i-1]={}
                tools[i-1].type = csvLines[i][0]
                tools[i-1].name = csvLines[i][1]
                tools[i-1].description = csvLines[i][2];
                tools[i-1].picture = csvLines[i][3];
                tools[i-1].supplier = csvLines[i][4];
                tools[i-1].quantityUnit = csvLines[i][5]
                tools[i-1].remainingQuantity = csvLines[i][6]
                tools[i-1].minQuantity = csvLines[i][7]
                tools[i-1].toxicity = csvLines[i][8]
                tools[i-1].expiryDate = csvLines[i][9]
                tools[i-1].dateOfPurchase = csvLines[i][10]
                tools[i-1].room = csvLines[i][11]
                tools[i-1].wardrobe = csvLines[i][12]
            }   
            return tools;
        },

        toolsHeader : function(){
            var headers = [
                "Type", 
                "Nom",
                "Description", 
                "Image",
                "Fournisseur",
                "Unité",
                "Quantité",
                "Quantité minimale",
                "Toxicité",
                "Date d'expiration",
                "Date d'achat",
                "Salle",
                "Etagère"            
            ];
            return headers;
        },


        expendables : function(csvLines){

            var expendables = [];
            for (var i = 1; i < csvLines.length - 1 ; i++) {
                expendables[i-1]={}
                expendables[i-1].name = csvLines[i][0]
                expendables[i-1].brand = csvLines[i][1]
                expendables[i-1].supplier = csvLines[i][2]
                expendables[i-1].supplierLink = csvLines[i][3]
                expendables[i-1].quantityUnit = csvLines[i][4];
                expendables[i-1].remainingQuantity = csvLines[i][5]
                expendables[i-1].minQuantity = csvLines[i][6]
                expendables[i-1].description = csvLines[i][7]
                expendables[i-1].picture = csvLines[i][8]
                expendables[i-1].room = csvLines[i][9]
                expendables[i-1].wardrobe = csvLines[i][10]
            }
            return expendables;
        },

        expendablesHeader : function(){
            var headers = [
                'Nom', 
                'Marque',
                'Fournisseur',
                'Lien Fournisseur',
                'Unité',
                'Quantité',
                'Quantité minimale',
                'Description', 
                'Image',
                'Salle',
                'Etagère'
            ];
            return headers;
        },
    }
});

app.factory('CsvVerification', function(){


    return factory = {


        checkProducts : function(categories, rooms, wardrobes, elements){
            var errors = []

            for (var i = 0; i < elements.length; i++) {

                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Prix", elements[i].price, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Categorie", elements[i].categorie, i, elements[i].name)) {
                    errors.push(response)
                }
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (elements[i].categorie) {
                    if (response = this.checkCategorie(categories, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                if(elements[i].price){
                    if (response = this.checkMinValue("Prix", elements[i].price, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].price){
                    if (response = this.checkNumberValue("Prix", elements[i].price, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkEngines : function(rooms, elements){
            var errors = []

            for (var i = 0; i < elements.length; i++) {

                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Salle", elements[i].room, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Statut", elements[i].status, i, elements[i].name)) {
                    errors.push(response)
                }

                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }

                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkExpendables : function(rooms, wardrobes, elements){
            var errors = []

            for (var i = 0; i < elements.length; i++) {

                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }

                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },

        checkTools : function(rooms, wardrobes, elements){
            var errors = []

            for (var i = 0; i < elements.length; i++) {

                if (response = this.checkRequirement("Nom", elements[i].name, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Type", elements[i].type, i, elements[i].name)) {
                    errors.push(response)
                }
                if (response = this.checkRequirement("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                    errors.push(response)
                }
                if (elements[i].room) {
                    if (response = this.checkRoom(rooms, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (elements[i].wardrobe) {
                    if (response = this.checkWardrobe(wardrobes, elements[i], i)) {
                        errors.push(response)
                    }
                }
                if (response = this.checkAssociationRoomWardrobe(wardrobes, rooms, elements[i], i)) {
                    errors.push(response)
                }

                if(elements[i].remainingQuantity){
                    if (response = this.checkMinValue("Quantité", elements[i].remainingQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }
                if(elements[i].minQuantity){
                    if (response = this.checkMinValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name, 0)) {
                        errors.push(response)
                    }
                }

                if(elements[i].minQuantity){
                    if (response = this.checkNumberValue("Quantité minimale", elements[i].minQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].remainingQuantity){
                    if (response = this.checkNumberValue("Quantité", elements[i].remainingQuantity, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                if(elements[i].type){
                    if (elements[i].type != "chemical" && elements[i].type != "tool"){
                        errors.push("Type erroné: Le type de l'élément " + elements[i].name + " numéro " + (i+1) + " doit être chemical ou tool.")
                    }
                }

                if(elements[i].expiryDate){
                    if (response = this.checkDate("Date d'expiration", elements[i].expiryDate, i, elements[i].name)) {
                        errors.push(response)
                    }
                }
                if(elements[i].dateOfPurchase){
                    if (response = this.checkDate("Date d'achat", elements[i].dateOfPurchase, i, elements[i].name)) {
                        errors.push(response)
                    }
                }

                for (var j = i+1; j < elements.length; j++) {
                    if (i!=j && elements[i].name == elements[j].name){
                        errors.push("Noms similaires : Les items numero" + (i+1) + " et " + (j+1) + " ont le même nom " + elements[i].name )
                    }
                }
            }
            return errors
        },



        checkCategorie : function(categories, element, index){
            if (!categories.find(categorie => categorie.name == element.categorie)) {
                return "Catégorie introuvable: La catégorie " + element.categorie + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        checkRoom : function(rooms, element, index){
            if (!rooms.find(room => room.name == element.room)) {
                return "Salle introuvable : La salle " + element.room + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        checkWardrobe : function(wardrobes, element, index){
            if (!wardrobes.find(wardrobe => wardrobe.name == element.wardrobe)) {
                return "Etagère introuvable : La salle " + element.wardrobe + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " est intouvable."
            }
            return null
        },

        checkAssociationRoomWardrobe : function(wardrobes, rooms, element, index){
            var room = rooms.find(room => room.name == element.room)
            if (room && element.wardrobe) {
                wardrobe = wardrobes.find(wardrobe => wardrobe.name == element.wardrobe && wardrobe.room_id == room.id)
                if(!wardrobe) {
                    return "Couple étagère/salle erroné : La salle " + element.room + " entrée pour l'élément " + element.name + " numéro " + (index+1) + " ne comporte pas d'étagère " + element.wardrobe + "."
                }
            }
            return null
        },

        checkRequirement: function(propertieName, propertieContent, index, elementName){
            if(propertieContent == null) {
                return propertieName + " manquant(e) : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " est requise."
            }
            return null
        }, 

        checkMinValue: function(propertieName, propertieContent, index, elementName, minValue){
            if (propertieContent < minValue) {
                return "Propriété " + propertieName + " non respectée : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " ne peut être inférieure à " + minValue + "."
            }
            return null
        },

        checkNumberValue: function(propertieName, propertieContent, index, elementName){
            if (!angular.isNumber(propertieContent)) {
                return "Propriété " + propertieName + " non respectée : La propriété " + propertieName + " de l'élément " + elementName + " numero " + (index+1) + " doit être un nombre."
            }
            return null
        },

        checkDate: function(propertieName, propertieContent, index, elementName){
            var regex = /^\d{4}-(((0)[0-9])|((1)[0-2]))-([0-2][0-9]|(3)[0-1])/
            var validDate = regex.test(propertieContent)
            if(!validDate){
                return "Date erronée : La propriété " + propertieName + " de l'élément " + elementName + " numéro " + (index+1) + " n'est pas valide et/ou au format AAAA-MM-JJ."
            }
            return null
        }
    }
});

app.factory('Elements', function($resource, $q){

    return factory = {

        productsResource : $resource(__ENV.apiUrl + "/products/:id", {}, {
            'update': { method:'PUT' },
            'save' : { method: 'POST' }
        }),

        printingsResource : $resource(__ENV.apiUrl + "/printings/:id", {}, {
            'update': { method:'PUT' }
        }),

        cuttingsResource : $resource(__ENV.apiUrl + "/cuttings/:id", {}, {
            'update': { method:'PUT' }
        }),

        elements : {

            products : [],
            cuttings : [],
            printings : [],

        },

        load : function() {

            var deferred = $q.defer();
            var that = this;

            that.productsResource.get({}).$promise
            .then(function(res) {

                that.elements.products = res.data;
                return that.cuttingsResource.get({}).$promise;

            }, function(res){
                res.message = "Impossible de charger les produits";
                deferred.reject(res);
            })
            .then(function(res) {

                that.elements.cuttings = res.data;
                return that.printingsResource.get({}).$promise;

            }, function(res){
                res.message = "Impossible de charger les services de découpe";
                deferred.reject(res);
            })
            .then(function(res) {

                that.elements.printings = res.data;
                deferred.resolve(that.elements)

            }, function(res){
                res.message = "Impossible de charger les services d'impression";
                deferred.reject(res);
            });

            return deferred.promise;
        }

    }

});

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

var transform = function(data) {
    if (data === undefined)
        return data;

    var fd = new FormData();
    angular.forEach(data, function(value, key) {
        if (value != null) { 
            fd.append(key, value);
        }
    });

    return fd;
};
app.factory('Entities', function($resource){
    return $resource(__ENV.apiUrl + "/entities/:id", {}, {
        'save': {
            method:'POST',
            transformRequest: transform,
            headers: {
                'Content-Type': undefined
            }
        },
        'update': {
            method:'POST',
            transformRequest: function (data) {
                var fd = transform(data);
                fd.append('_method', 'PUT');
                return fd;
            },
            headers: {
                'Content-Type': undefined
            }
        }
    });
});

app.factory('ErrorHandler', function($location, Alert){
  return {

    alert: function(error) {
      var msg = this.parse(error).message;
      if(msg)
        return Alert.open("Erreur", msg);
    },

    parse: function(error) {
      console.error(error);

      var e = {
        status : error.status
      };
      if (error.message != undefined) {
        return error;
      }
      if (error.data.meta != undefined) {
        var cerror = error.data.meta;
      } else {
          var cerror = error;
      }

      switch (cerror.status) {
        case 404:
          $location.path("/error/404");
          break;
        case 400:
          e.message = cerror.message;
          break;
        case 409:
          e.message = "Vous tentez de créer une ressource qui existe déjà. Veuillez modifier vos informations.";
          break;
        case 422:
          e.message = this.inputErrors(error);
          break;
        case 401:
          e.message = "Vous n'avez pas l'autorisation d'effectuer cette action.";
          break;
        case 403:
          e.message = "Il est interdit d'effectuer cette action.";
          break;
        default:
          e.message = "Une erreur interne est survenue. Veuillez contacter un administrateur";
          break;
      }

      return e;
    },

    inputErrors : function(error) {
      var m = "";
      for(e in error.data.data) {
        m += error.data.data[e][0] + " ";
      };
      return m;
    }

  }
});

app.factory('Esprima', function($resource){
  return {

    parse : function(js) {
      return esprima.parse(js);
    }

  }
});

app.factory('Expendables', function($resource){
    return $resource(__ENV.apiUrl + "/expendables/:id", null, {
        'save' : { method: 'POST' },
        'update': { method:'PUT' }
    });
});

app.factory('Helpers', function(){
  return {

    dirname : function(path) {

      return path.replace(/\\/g, '/')
        .replace(/\/[^\/]*\/?$/, '')
    }

  }
});

app.factory('JCappuccinoFactory', function() {

    var service = {
        callback: {}
    };

    service.init = function(){
      if(service.ws) service.reset();
      else service.connect();
    }

    service.reset = function() {
      if(service.ws) {
        service.callback = {};
        service.ws.close();
        service.ws = null;
      }
    }

    service.connect = function() {

        var ws = new WebSocket('ws://localhost:9191/events/');

        var handle = function(event, message) {
            for(i in service.callback[event]) {
                service.callback[event][i](message);
            }
        }

        ws.onopen = function() {
            handle("onopen", "");
        };

        ws.onerror = function() {
            handle("onerror", "");
        };

        ws.onclose = function() {
            handle("onclose", "");
        };

        ws.onmessage = function(message) {
            var data = message.data.split(':');
            var event = data[0], data = data[1];
            handle(event, data);
        };

        service.ws = ws;
    }

    service.send = function(event, message) {
        service.ws.send(event + ':' + message);
    }

    service.subscribe = function(event, callback) {
        if(!service.callback[event]) {
            service.callback[event] = [];
        }
        service.callback[event].push(callback);
    }

    return service;
});


app.factory('Mail',function($http){
	return {
		send : function(dataMail){

			$http({
				method : 'POST',
				url : __ENV.apiUrl + "/send",
				headers : {
          			'Content-Type': 'application/json'
        		},
        		data : dataMail,
			});
		}
	}
});

app.factory('Payments', function($http, $q){
  return {

    payBadge : function(token, badge_id, purchaseid) {

      var deferred = $q.defer();

      $http({
        method : 'POST',
        url : __ENV.apiUrl + "/payutc/badge/" + purchaseid,
        headers : {
          'Content-Type': 'application/json'
        },
        data : {
          token : token,
          badge_id : badge_id,
        }
      }).then(function(data){
        deferred.resolve(data);
      }, function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    },
  }
});

app.factory('Permissions', function($resource){
  return $resource(__ENV.apiUrl + "/permissions/:id", {}, {
    });
});

app.factory('Products', function($resource){
  return $resource(__ENV.apiUrl + "/products/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('PurchaseCreator', function($resource, $q, Purchases, PurchasedElements){
    return factory = {

        user : {},

        basket : {
            products : [],
            services : []
        },

        reset : function() {
            this.user = null;
            this.entity = null;
            this.basket.products = [];
            this.basket.services = [];
        },

        uniqueid : function() {
            return "id-" + Math.random().toString(36).substr(2, 16);
        },

        addProduct : function(product) {

            var index = this.getProductBasketByProduct(product);
            if(index != -1) {

                this.more(this.basket.products[index], 1);

            } else {

                var id = this.uniqueid();

                var pelement = {

                    "id_basket" : id,

                    "comment" : "",
                    "suggestedPrice" : 0,
                    "finalPrice" : 0,

                    "purchasedQuantity" : 0,
                    "purchasable_type" : "product",
                    "purchasable_id" : product.id,
                    "purchasable" : product,
                }

                this.basket.products.push(pelement);

                this.more(pelement, 1);
            }
        },

        addService : function(service) {

            var id = this.uniqueid();

            var pelement = {

                "id_basket" : id,

                "args" : {},
                "comment" : service.comment,
                "suggestedPrice" : 0,
                "finalPrice" : 0,

                "purchasedQuantity" : service.quantity,
                "purchasable_type" : "service",
                "purchasable_id" : service.element.id,
                "purchasable" : service.element,
            }

            this.basket.services.push(pelement);
        },

        editService : function(modal) {

            var index = this.getService(modal.id_basket);
            if(index == -1) return false;

            var pelement = {

                "id_basket" : modal.id_basket,

                "args" : modal.args,
                "comment" : modal.comment,
                "suggestedPrice" : modal.pricer.compute(modal.args),
                "finalPrice" : modal.finalPrice,

                "purchasedQuantity" : 1,
                "purchasable_type" : "service",
                "purchasable_id" : modal.element.id,
                "purchasable" : modal.element,
            }

            this.basket.services[index] = pelement;
        },

        delProduct : function(id_basket) {
            var index = this.getProduct(id_basket);

            if(index != -1) {
                this.basket.products.splice(index, 1);
            }

        },

        delService : function(id_basket) {
            var index = this.getService(id_basket);

            if(index != -1) {
                this.basket.services.splice(index, 1);
            }

        },

        buildPurchase : function() {
            var purchase = new Purchases();
            purchase.user = this.user.id;
            purchase.association = this.association;
            purchase.login = this.login;
            if(this.entity) purchase.entity = this.entity.id;
            return purchase;
        },

        buildElements : function() {

            var elements = new PurchasedElements();
            elements.elements = [];

            for(i=0; i<this.basket.products.length; i++) {
                elements.elements.push(this.basket.products[i]);
            }
            for(i=0; i<this.basket.services.length; i++) {
                elements.elements.push(this.basket.services[i]);
            }

            return elements;
        },

        save : function() {
            console.log(this);
            var deferred = $q.defer();
            var that = this;

            that.buildPurchase().$save(function(resP){

                that.buildElements().$save({idP : resP.data.id}, function(resE){
                    if(resE.meta.status == 202) {
                        deferred.resolve({
                            payutc: {
                                synch: false,
                                error: resE.data
                            },
                            dataPurchase: resP
                        });
                    } else {
                        deferred.resolve({
                            payutc: {
                                synch: true
                            },
                            dataPurchase: resP
                        });
                    }

                }, function(errE){
                    deferred.reject(errE);
                });

            }, function(errP){
                deferred.reject(errP);
            });

            return deferred.promise;
        },

        devis : function() {
            var deferred = $q.defer();
            var that = this;

            that.buildElements().$quote({}, function(data){
                saveAs(data.pdf, 'Devis_Fablab_' + new Date().getTime() + '.pdf');
                deferred.resolve(true);
            }, function(error){
                deferred.reject(error);
            });

            return deferred.promise;
        },

        total : function() {
            var s = 0;
            for(var i = 0; i<this.basket.products.length; i++)
            s += this.basket.products[i].finalPrice;
            return s;
        },

        quantity : function() {
            return this.basket.products.length + this.basket.services.length;
        },

        getProductBasketByProduct : function(product) {
            var index = this.basket.products.indexOf(this.basket.products.find(function(pelement){
                return pelement.purchasable_id == product.id;
            }));
            return index;
        },

        getProduct: function(id_basket) {
            var index = this.basket.products.indexOf(this.basket.products.find(function(pelement){
                return pelement.id_basket == id_basket;
            }));
            return index;
        },

        getService: function(id_basket) {
            var index = this.basket.services.indexOf(this.basket.services.find(function(pelement){
                return pelement.id_basket == id_basket;
            }));
            return index;
        },

        more : function(pelement, n) {

            var index = this.getProduct(pelement.id_basket);
            pelement.purchasable.remainingQuantity += -n;

            if(this.basket.products[index].purchasedQuantity+n <= 0) {
                this.basket.products.splice(index, 1);
            }
            else {
                this.basket.products[index].purchasedQuantity += n;
                this.basket.products[index].suggestedPrice = this.basket.products[index].purchasedQuantity * this.basket.products[index].purchasable.price;
                this.basket.products[index].finalPrice = this.basket.products[index].suggestedPrice;
            }

        }

    };
});

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

app.factory('Purchases', function($resource){
  return $resource(__ENV.apiUrl + "/purchases/:id/:verb", {}, {
        'update': { method:'PUT' },

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

app.factory('Roles', function($resource){
  return $resource(__ENV.apiUrl + "/roles/:id", {}, {
      'update': { method:'PUT' }
  });
});

app.factory('Rooms', function($resource){
  return $resource(__ENV.apiUrl + "/rooms/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('ScriptFactory', function(){
  return function(script) {

    var price = eval(script.script);
    var args = eval(script.args);

    var factory = {

      script : script,

      price : price,

      args : args,

      compute : function(args) {

        for(i=0; i<args.length; i++) {
          if(typeof args[args[i].name] == 'undefined')
            return null;
        }

        return this.round(this.price(args));
      },

      round : function(p) {
        return Math.round(p * 100) / 100;
      }

    };

    return factory;
  };
});

app.factory('Scripts', function($resource){
  return $resource(__ENV.apiUrl + "/scripts/:id", {}, {
       'update': { method:'PUT' },
   });
});

app.factory('Services', function($resource){
  return $resource(__ENV.apiUrl + "/services/:id", {}, {
       'update': { method:'PUT' },
   });
});

app.factory('Tasks', function($resource){
  return $resource(__ENV.apiUrl + "/tasks/:id", {}, {
        'update': { method:'PUT' }
    });
});

app.factory('Tools', function($resource){
  return $resource(__ENV.apiUrl + "/tools/:id", {}, {
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

app.factory('Users', function($resource){
  return $resource(__ENV.apiUrl + "/users/:id", {}, {
        'update': { method:'PUT' },
        'self': { method:'GET', url : __ENV.apiUrl + "/client"},
        'selfPermissions': { method:'GET', url : __ENV.apiUrl + "/client/permissions"},
        'gingerSearch': { method: 'GET', url: __ENV.apiUrl + "/users/ginger/search", cache: true},
        'gingerLogin': { method: 'GET', url: __ENV.apiUrl + "/users/ginger/:login"},
        'getSync': { method: 'GET', url: __ENV.apiUrl + "/users/sync"},
        'saveSync': { method: 'POST', url: __ENV.apiUrl + "/users/sync"}
    });
});

app.factory('UTCAuth', function($http, $window, $location, $cookies, $q, Users, Roles, $rootScope){

  var factory = {};
  that=factory;

  factory.auth = false;

  factory.token = null;

  factory.member = {};

  factory.permissions = null;

  factory.saveCookie = function() {
      var member = that.member;
      if (member.role)
        member.role.permissions = null;
      $cookies.putObject('UTCAuth',
          {
            'auth' : that.auth,
            'token' : that.token,
            'member' : member,
          }
      );
  }

  factory.loadCookie = function() {
    if($cookies.getObject('UTCAuth')) {
      that.auth = $cookies.getObject('UTCAuth').auth;
      that.token = $cookies.getObject('UTCAuth').token;
      that.member = $cookies.getObject('UTCAuth').member;
    }
  }

  factory.removeCookies = function(){
    $cookies.remove('UTCAuth');
  }

  factory.setAuth = function(auth) {
    that.auth = auth;
    that.saveCookie();
  }

  factory.setToken = function(token){
    that.token = token;
    that.saveCookie();
  }

  factory.setMember = function(member) {
    that.member = member;
    that.saveCookie();
  }

  factory.clear = function() {
    that.setAuth(false);
    that.setToken('');
    that.setMember({});
    that.removeCookies();
  }

  factory.setPermissions = function(permissions) {
    that.permissions = permissions;
  }

  factory.refreshPermissions = function () {

      var deferred = $q.defer();

      if (that.auth) {
          Users.selfPermissions({}).$promise
              .then(function (data) {
                  that.setPermissions(data.data);
                  deferred.resolve(data.data);
              }).catch(function (error) {
              deferred.reject(error);
          });
      } else {
          that.setPermissions([]);
          deferred.resolve([]);
      }

      return deferred.promise;
  };

  that.deferred = null;

  $rootScope.isExtern = function() {
      return $rootScope.auth.member.role_id == 3;
  }

  $rootScope.can = function(attr) {
      if (that.permissions == null) {
          if (that.deferred == null) {
              that.deferred = $q.defer();
              factory.refreshPermissions()
              .then(function () {
                  that.deferred.resolve(factory.hasPermission(attr));
              }, function (error) {
                  that.deferred.reject(error);
              });
          }

          return that.deferred.promise;
      } else {
          return factory.hasPermission(attr);
      }
  }

  factory.hasPermission = function (permission) {

      var res = false;
      angular.forEach(that.permissions, function (perm) {
          if (perm.slug == permission) {
              res = true;
          }
      });
      return res;
  }

  factory.login = function(token) {
    that.setToken(token);
    that.setAuth(true);
    var deferred = $q.defer();

    Users.self({}).$promise
    .then(function(data){
        that.setMember(data.data);
        return that.refreshPermissions();
    }).then(function (data) {
        deferred.resolve(data);
    }).catch(function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
  }

  factory.logout = function() {
    that.clear();
  }

  factory.goLogin = function() {
    var webapp = encodeURIComponent(__ENV.webappUrl+'/#/login');
    $window.location.href = "https:\/\/cas.utc.fr\/cas\/login?service="+__env.webappUrl+"%2Fapi%2Fv1%2Flogin%3Fwebapp%3D"+__env.webappUrl+"%252F%2523%252Flogin"
  }

  factory.goLogout = function() {
    $http.get(__ENV.apiUrl+'/logout')
      .success(function(data){
        that.logout(); 
        $window.location.href = data.url; 
      }).error(function(error){
      });
  }

  if($cookies.getObject('UTCAuth')) {
      factory.loadCookie();
      factory.refreshPermissions();
  } else {
      factory.saveCookie();
  }

  return factory;
});

app.factory('Wardrobes', function($resource){
  return $resource(__ENV.apiUrl + "/wardrobes/:id", {}, {
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
