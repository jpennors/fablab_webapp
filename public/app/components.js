app.controller('accountCtrl', function($scope, Users, Roles, ErrorHandler, $rootScope, $location) {
  $scope.entities = [];

  Users.self({}, function(data){
    if(!$rootScope.can('list-role')){
      $scope.user = data.data;
    }
    else{
      Roles.get({id: data.data.role_id}, function (role) {
          $scope.user = data.data;
          $scope.user.role = role.data;
      }, function (error) {
          ErrorHandler.alert(error);
      });
    }
  }, function(error){
    ErrorHandler.alert(error);
  });
});

app.controller('adminAddressesCtrl', function($scope, $http, ErrorHandler, $uibModal, Addresses, $rootScope, $location){

  if(!$rootScope.can('list-address'))
      $location.path("/error/404");

  else{
    $scope.addresses = [];

    $scope.update = function() {
      Addresses.get({}, function(data){
        $scope.addresses = data.data;
      }, function(error){
        ErrorHandler.alert(error);
      });
    };

    $scope.update();

    $scope.open = function(address, type) {

      var modalInstance = $uibModal.open({
        backdrop: true,
        keyboard: true,

        templateUrl: 'app/components/admin_addresses/modal/edit_address.html',

        resolve: {
          address: function() {
            return address
          },
          type: function() {
            return type
          }
        },
        controller: 'editAddressCtrl'
      });

      modalInstance.result.then(function() {
        $scope.update();
      })

    };
  }
});

app.controller('adminEntitiesCtrl', function($scope, $http, ErrorHandler, $uibModal, Entities, $rootScope, $location){

  if(!$rootScope.can('edit-entity'))
      $location.path("/error/404");

  else{

    $scope.entities = [];

    $scope.update = function() {
      Entities.get({}, function(data){
        $scope.entities = data.data;
      }, function(error){
        ErrorHandler.alert(error);
      });
    };

    $scope.update();

    $scope.open = function(entity, type) {
      var modalInstance = $uibModal.open({
          backdrop: true,
          keyboard: true,
          templateUrl: 'app/components/admin_entities/modal/edit_entity.html',

          resolve: {
              entity: function() {
                return entity;
              },
              type: function(){
                return type
              }
          },
          controller: 'editEntityCtrl'
      });
      modalInstance.result.then(function() {
        $scope.update();
      })

    };
  }
});


app.controller('adminRolesCtrl', function($scope, $http, $log, $uibModal, ErrorHandler, Roles, Permissions, $rootScope, $location){

    if(!$rootScope.can('list-role'))
      $location.path("/error/404");

    else{

        $scope.roles = [];
        var mapPermissions = function(role) {
            var permissions = [];
            role.permissions.forEach(function (permission) {
                if (permission.selected === true) {
                    permissions.push(permission.id);
                }
            });

            return permissions;
        };
        var hasPermission = function(role, permission) {
            var res = false;
            role.permissions.forEach(function (userPerm) {
                if (userPerm.slug == permission) {
                    res = true
                }
            });
            return res;
        };

        $scope.update = function() {
            Roles.get({}, function(data){
                $scope.roles = data.data;
            }, function(error){
                ErrorHandler.alert(error);
            });
            console.log($scope.roles)
        };
        $scope.update();

        $scope.open = function(role, type) {
            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'app/components/admin_roles/modal/edit_role.html',
                resolve: {
                    role: function() {
                        return role;
                    },
                    type: function(){
                        return type;
                    }
                },
                controller: 'editRoleCtrl'
            });

            modalInstance.result.then(function() {
                $scope.update();
            })
        };
    }
});

app.controller('adminScriptsCtrl', function($scope, $http, $location, ErrorHandler, Scripts, $location, $rootScope, $uibModal){

  if(!$rootScope.can('list-price'))
      $location.path("/error/404");

  else{

    $scope.scripts = [];

    $scope.update = function(){
      Scripts.get({}, function(data){
        $scope.scripts = data.data;
      }, function(error) {
        ErrorHandler.alert(error);
      });
    }

    $scope.update();

    $scope.open = function(script, type) {
      var modalInstance = $uibModal.open({
          backdrop: true,
          keyboard: true,
          size:'lg',
          templateUrl: 'app/components/admin_scripts/modal/edit_script.html',

          resolve: {
              script: function() {
                return script;
              },
              type: function(){
                return type
              }
          },
          controller: 'editScriptCtrl'
      });
      modalInstance.result.then(function() {
        $scope.update();
      })

    };

    $scope.goEdit = function(script) {
      $location.path("/admin/scripts/" + script.id + "/edit");
    }
  }

});

app.controller('adminSemestersCtrl', function($scope, ErrorHandler, Semesters, $rootScope, $location){

    if(!$rootScope.can('super-admin'))
        $location.path("/error/404");

      else{

        $scope.semesters = [];
      $scope.current_semester = {}
      $scope.current_semester_changed = false;
      $scope.new_semester = {
        'name': ''
      }
      $scope.semester_added = false;
      $scope.semester_in_session = {
        'activate': false,
        'set' : false,
      }
      $scope.use_semester_in_session = false;

      $scope.update = function() {
        Semesters.get({}, function(data){
          $scope.semesters = data.data;
          $scope.current_semester = $scope.semesters.filter((s => s.current == true))[0]
        }, function(error){
          ErrorHandler.alert(error);
        });
      };

        $scope.update();

      $scope.setNewCurrentSemester = function(){
        Semesters.setCurrentSemester({id: $scope.current_semester.id}, function(){
          $scope.current_semester_changed = true;
        })
      }

      $scope.addNewSemester = function(){
        Semesters.save({}, $scope.new_semester, function(){
          $scope.update();
          $scope.new_semester.name = "";
          $scope.semester_added = true;
        });
      }

      $scope.setSemesterInSession = function(){
        $scope.semester_in_session.set = true;
      }

      $scope.removeSemesterFromSession = function(){
        $scope.semester_in_session.set= false;
        $scope.semester_in_session.activate = false;
      }

      $scope.activateSemesterInSession = function(){
        $scope.semester_in_session.activate = true;
      }

    }
  });

app.controller('adminServicesCtrl', function($scope, $uibModal, ErrorHandler, Services, $location, $rootScope){

	if(!$rootScope.can('edit-service'))
		$location.path("/error/404");

	else{

		$scope.services = []
		$scope.loading = true

        $scope.update = function() {
            Services.get({}, function(data){
                $scope.services = data.data;
                for (var i = $scope.services.length - 1; i >= 0; i--) {
                	switch ($scope.services[i].type) {
                		case 'cutting' :
                			$scope.services[i].typeString = "Découpe"
                			break
                		case 'printing' :
                			$scope.services[i].typeString = "Impression"
                			break
                		case 'other' :
                			$scope.services[i].typeString = "Autre"
                			break
                		default :
                			$scope.services[i].typeString = "Undefined"
                	}
                }
                $scope.loading = false
            }, function(error){
            	$scope.loading = false
                ErrorHandler.alert(error);
            });
        };
        $scope.update();

		$scope.open = function(service, type) {

			var modalInstance = $uibModal.open({
			    backdrop: true,
			    keyboard: true,
			    size:'lg',
			    templateUrl: 'app/components/admin_services/modal/edit_service.html',

			    resolve: {
			        service: function() {
			            return service;
			        },
			        type: function() {
			        	return type;
			        }
			    },

			    controller: 'editServiceCtrl'
			})
			modalInstance.result.then(function() {
	            $scope.update();
	        })
		};
	}

});

app.controller('adminSettingsCtrl', function($scope, $http, $q, ErrorHandler, Administratives, $rootScope, $location){

  if(!$rootScope.can('super-admin'))
    $location.path("/error/404");

  else{
    $scope.saving   = false;
    $scope.error    = false;
    $scope.success  = false;

    Administratives.get({}, function(data){
      $scope.admins = data.data;
    }, function(error) {
      ErrorHandler.alert(error);
    });

    $scope.update = function() {
      $scope.saving   = true;
      $scope.success  = false;
      $scope.error    = false;

      var done = 0;

      for(var i=0; i<$scope.admins.length; i++) {
        Administratives.update({'id' : $scope.admins[i].id}, $scope.admins[i], function(data){
          done++;
          if(done == $scope.admins.length) {
            $scope.saving   = false;
            $scope.success  = true;
          }
        }, function(error) {
          $scope.saving   = false;
          $scope.success  = false;
          $scope.errors    = error.data.meta;
          return false;
        });
      }

    };
  }

});

app.controller('adminUsersCtrl', function($scope, $http, $log, $uibModal, ErrorHandler, Users, Roles, Entities, $rootScope, $location){

  if(!$rootScope.can('list-user'))
    $location.path("/error/404");

  else{

    $scope.users    = [];
    $scope.roles    = [];
    $scope.entities = [];

    Roles.get({}, function (roles) {
        $scope.roles = roles.data;
        for (var i = $scope.roles.length - 1; i >= 0; i--) {
          if ($scope.roles[i].name == "Membre CAS" ) {
            $scope.roles.splice(i, 1)
          }
        }
    }, function (error) {
        ErrorHandler.alert(error);
    });

    Entities.get({}, function (data) {
        $scope.entities = data.data;
    }, function (error) {
        ErrorHandler.alert(error);
    });

    $scope.unselectedRoles = [];

        $scope.loading = true; 

    $scope.$watch("users", function(newValue, oldValue) {
      $scope.totalItems   = $scope.users.length;
      $scope.itemsPerPage = Math.min($scope.users.length, $scope.maxItems);
      if ($scope.totalItems > 0) {
          $scope.loading = false;
      }
    });

    $scope.$watch("userSearch", function(newValue, oldValue) {
      if(newValue !== '')
        $scope.itemsPerPage = $scope.users.length;
      else
        $scope.itemsPerPage = Math.min($scope.users.length, $scope.maxItems);
    });

    $scope.inRole = function(user) {
        return !$scope.unselectedRoles.includes(user.role_id);
    }
    $scope.toggleRole = function(role) {
      role.selected = !role.selected;
      if($scope.unselectedRoles.includes(role.id)) {
          var index = $scope.unselectedRoles.indexOf(role.id);
          $scope.unselectedRoles.splice(index, 1);
      } else {
          $scope.unselectedRoles.push(role.id);
      }
    }

    $scope.getUserIndex = function(id) {
      var index = $scope.users.indexOf($scope.users.find(function(user){
        return user.id == id;
      }));
      return index;
    };

    $scope.refreshUsers = function() {
        Users.get({}, function(data){
            $scope.users = data.data;
        }, function(error) {
            ErrorHandler.alert(error);
        });
    }
    $scope.refreshUsers();

    $scope.open = function(type, id) {
        if (id){
          var index = $scope.getUserIndex(id);
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            templateUrl: 'app/components/admin_users/modal/edit_user.html',
            resolve: {
                scopeParent: function () {
                    return $scope;
                },
                type: function() {
                    return type;
                },
                object: function() {
                  return $scope.users[index];
                }
            },
          controller: 'editUserCtrl'
        });
        modalInstance.result.then(function() {
            $scope.refreshUsers();
        })  
    };

    $scope.synchUsers = function() {

        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size: 'lg',
            templateUrl: 'app/components/admin_users/modal/sync_users.html',
            resolve: {
                scopeParent: function() {
                    return $scope;
                }
            },
            controller: 'syncUserCtrl'
        });

        modalInstance.result.then(function() {
            $scope.refreshUsers();
        })  
      };
  }
});

app.controller('mainCtrl', function($http, $scope){


});

app.controller('dataCtrl', function($scope, $http, ErrorHandler, $uibModal, Csv, CsvVerification, $q, $timeout, $rootScope, $location, Categories, Rooms, Wardrobes){

    if(!$rootScope.can('list-data')) {
        $location.path("/error/404");
    } else {

        $scope.data = {}
        $scope.data.type = "products";



        $scope.export = function(){
            $scope.import= false;
            var type = $scope.data.type;
            $http.get(__ENV.apiUrl + '/export/'+type, {responseType : "blob"}).then(
            function(data){

                saveAs(data.data, 'inventaire_'+type+'.xlsx');
            });
        }


        $scope.data.file=null;
        $scope.import=false;
        $scope.parsing=false;
        $scope.imported = false;


        $scope.inputFile = function(){
            $scope.import = true;
        }

        function parse(file) {
            var deferred = $q.defer();
            config = {
                header: false,
                dynamicTyping: true,
                encoding: "ISO-8859-1"
            }
            config.complete = function onComplete(result) {
                if (config.rejectOnError && result.errors.length) {
                    deferred.reject(result);
                    return;
                }
                deferred.resolve(result);
            };
            config.error = function onError(error) {
                deferred.reject(error);
            };
            Papa.parse(file, config);
            return deferred.promise;
        }


        $scope.csvParse = function(){
            var type = $scope.data.type;
            var file = $scope.data.file;

            if(file instanceof File){
                parse(file).then(function(data){
                    $scope.csvLines = data.data;
                    $scope.items = {};
                    $scope.items.data = [];
                    $scope.headers = {};
                    $scope.headers.data = [];
                    switch(type){
                        case 'products' :
                            $scope.items.data = Csv.products($scope.csvLines)
                            $scope.headers.data = Csv.productsHeader();
                            break;
                        case 'engines' :
                            $scope.items.data = Csv.engines($scope.csvLines)
                            $scope.headers.data = Csv.enginesHeader();
                            break;
                        case 'tools' :
                            $scope.items.data = Csv.tools($scope.csvLines)
                            $scope.headers.data = Csv.toolsHeader();
                            break;
                        case 'expendables' :
                            $scope.items.data = Csv.expendables($scope.csvLines)
                            $scope.headers.data = Csv.expendablesHeader();
                            break;
                        case 'scripts' :
                            $scope.items.data = Csv.scripts($scope.csvLines)
                            $scope.headers.data = Csv.scriptsHeader();
                            break;
                    }
                    $scope.parsing = true
                });
            }
        }


        $scope.saveCsv=function(){
            var validity = checkCsvContent($scope.items.data)
            if (validity == true) {
                $http.post(__ENV.apiUrl + '/import/'+ $scope.data.type, $scope.items, gererErreur).then(function(){
                    $scope.parsing = false;
                    $scope.import = false;
                    $scope.imported = true;
                    $timeout(function() {
                       $scope.imported = false;
                    }, 5000)
                }, gererErreur)
            } 
        }

        var gererErreur = function(error) {
            if(error.status == 422) {
                $scope.inputErrors = error.data.data;
            }
            else if(error.status == 409) {
                $scope.messageError = "Un produit avec le même nom existe déjà.";
            }
            else if (error.status == 500) {
                $scope.messageError = "Problème avec le serveur."
            }

        }

        $scope.errorsFromFront = []
        var checkCsvContent = function (elements) {
            validity = true
            response = []
            $scope.errorsFromFront = []
            switch($scope.data.type){
                case "products":
                    response = CsvVerification.checkProducts($scope.categories, $scope.rooms, $scope.wardrobes, elements)
                    break;
                case "tools":
                    response = CsvVerification.checkTools($scope.rooms, $scope.wardrobes, elements)
                    break;
                case "expendables":
                    response = CsvVerification.checkExpendables($scope.rooms, $scope.wardrobes, elements)
                    break;
                case "engines":
                    response = CsvVerification.checkEngines($scope.rooms, elements)
                    break;
                case "scripts":
                    response = CsvVerification.checkScripts(elements)
                    break;
            }
            if (response.length>0) {
                $scope.errorsFromFront = response
                validity = false
            }
            return validity
        }

        $scope.clearImport = function(){
            $scope.import = false
            $scope.parsing = false
            $scope.errorsFromFront = []
        }


        Categories.get({}, function(res){
            $scope.categories = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });

        Rooms.get({}, function(res){
            $scope.rooms = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });

        Wardrobes.get({}, function(res){
            $scope.wardrobes = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
});

app.controller('enginesCtrl', function($scope, $http, ErrorHandler, Engines, $uibModal, $location, $rootScope) {

    if(!$rootScope.can('list-engine'))
      $location.path("/error/404");

    else{

        $scope.loading = true

        Engines.get({}, function(res){
            $scope.engines = res.data;
            $scope.loading = false
        }, function(error){
            ErrorHandler.alert(error);
            $scope.loading = false
        });

        $scope.iconColor = function(engine) {
            var color;
            switch (engine.status) {
                case "Disponible":
                    color = '#c2db9b';
                    break;
                case "En reparation":
                    color = '#f3997b';
                    break;
                case "En utilisation":
                    color = '#ffdb93';
                    break;
                case "En maintenance":
                    color = '#f3997b';
                    break;
                default:
                    color = '#c2db9b';
            }
            return {'background-color':color};
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.engines.filter((e)=>e.id==id)[0];
            var index = $scope.engines.indexOf(aSupprimer);

            Engines.remove({id:id}, function() {
                $scope.engines.splice(index, 1);
            })
        }

        $scope.open = function(id, type) {
            var selected = $scope.engines.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/engines/modal/engines_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'enginesEditCtrl'
            });

            modalInstance.result.then(function(res) {
                if(res.type == "create") {
                    $scope.engines.push(angular.copy(res.changedEngine));
                }else if(res.type=="edit") {
                    $scope.engines[$scope.engines.indexOf(selected)] = angular.copy(res.changedEngine);
                }
                else if(res.type=="delete"){
                    $scope.delete(res.id);
                }
            })
        }
    }
});

app.controller('enginePartsCtrl', function($scope, $http, ErrorHandler, Engines, EngineParts, $uibModal, $location, $rootScope) {


        EngineParts.get({}, function(res){
            $scope.engineparts = res.data;

        }, function(error){
            ErrorHandler.alert(error);
        });


        $scope.delete = function(id) {
            var aSupprimer = $scope.engineparts.filter((e)=>e.id==id)[0];
            var index = $scope.engineparts.indexOf(aSupprimer);

            EngineParts.remove({id:id}, function() {
                $scope.engineparts.splice(index, 1);
            })
        }

        $scope.open = function(id, type) {
            var selected = $scope.engineparts.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                templateUrl: 'app/components/engine_parts/modal/engine_parts_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'enginePartsEditCtrl'
            });

            modalInstance.result.then(function(res) {
                if(res.type == "create") {
                    $scope.engineparts.push(angular.copy(res.changedEnginePart));
                }else if(res.type=="edit") {
                    $scope.engineparts[$scope.engineparts.indexOf(selected)] = angular.copy(res.changedEnginePart);
                }
                else if(res.type=="delete"){
                    $scope.delete(res.id);
                }
            })
        }
});

app.controller('errorCtrl', function($scope, $routeParams, $location) {

  if ($routeParams.code && $routeParams.code == 401) { 

    $scope.errorCode = 401;
    $scope.errorDesc = "Vous n'êtes pas autorisé à accéder à cette webapp.";

  }
  else if ($routeParams.code && $routeParams.code == 404) {

    $scope.errorCode = 404;
    $scope.errorDesc = "Page demandée introuvable";

  }
  else if ($routeParams.code && $routeParams.code == 500) {

    $scope.errorCode = 500;
    $scope.errorDesc = "Erreur interne, veuillez contacter un administrateur.";

  }
  else {
    $location.path("/");
  }

});

app.controller('expendablesCtrl', function($scope, $http, Expendables, $uibModal, ErrorHandler, $location, $rootScope) {

    if(!$rootScope.can('list-expendable'))
      $location.path("/error/404");

    else{
        function init() {
            $scope.loading = true
            $scope.alertFilterOn = false;
            Expendables.get({}, function(res){
                $scope.expendables = res.data;
                $scope.loading = false
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loading = false
            });
        }

        $scope.alertFilter = function(e) {
            return e.remainingQuantity <= e.minQuantity;
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.expendables.filter((e)=>e.id==id)[0];
            var index = $scope.expendables.indexOf(aSupprimer);

            Expendables.remove({id:id}, function() {
                $scope.expendables.splice(index, 1);
            })
        }

        $scope.open = function(id, type) {
            var selected = $scope.expendables.filter((e)=>e.id==id)[0];
            if(selected === undefined) selected = {
                minQuantity: 0,
                remainingQuantity: 0
            };

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/expendables/modal/expendables_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'expendablesEditCtrl'
            });

            modalInstance.result.then(function(res) {
                init()
                if(res.type == "delete"){
                    $scope.delete(res.id);
                }
            })
        }

        init();
    }
});

app.controller('helpCtrl', function($scope, $location, $rootScope) {

    if ($rootScope.isExtern()) {
        $location.path("/error/404")
    }

});

app.controller('loginCtrl', function($scope, $location, $rootScope, $routeParams, Users) {

  $scope.message = "Connexion";

  if($routeParams.token) { 

    $rootScope.auth.login($routeParams.token)
    .then(function(data){

      $location.path("/");
      $location.url($location.path());  

    }, function(error){

      $location.path("/error/500");
      $location.url($location.path()); 

    });

  }
  else if ($routeParams.error && $routeParams.error == 401) { 

    $scope.message = "Erreur de connexion";

    $location.path("/error/401");
    $location.url($location.path());  

  }
  else {

    $scope.message = "Redirection vers le CAS";

    $rootScope.auth.goLogin();

    if($routeParams.token){

    }

  }

});

app.controller('logoutCtrl', function($location, $rootScope) {

  if($rootScope.auth) { 

    $rootScope.auth.goLogout();

  }
  else {

    $location.path("/login");

  }

});

app.controller('paymentCtrl', function($scope, $timeout, $routeParams, $location, JCappuccinoFactory, ErrorHandler, Purchases, Payments, Alert, UTCAuth, $rootScope) {

    if (!$rootScope.can('pay-someone-payutc')) {
        $location.path('/error/404')
    } else {


        Purchases.get({ id : $routeParams.purchaseid }, function(res) {
            $scope.purchase = res.data;

            if($scope.purchase.paid) {
              $location.path("/purchases/" + $scope.purchase.id + "/edit")
            }

            var ticketRegexp = /\?ticket=(.+)#/g;
            var match = ticketRegexp.exec($location.absUrl());
            $scope.ticket = match[1];
            $scope.service = __ENV.webappUrl + '/#/payments/' + $scope.purchase.id;

        }, function(error) {
            ErrorHandler.alert(error);
        });


      if(!$scope.badgeuse) $scope.badgeuse = {};

            JCappuccinoFactory.init();
      $scope.badgeuse.status = "Connexion à la badgeuse...";

      $scope.payutc = {};
      $scope.payutc.status = "En attente du badge client";

      JCappuccinoFactory.subscribe("cardInserted", function(badge_id) {

        if($scope.payutc.ok) {
          Alert.open('Tentative de paiement', 'Le paiement a déjà été effectué.');
          return;
        }

        $scope.$apply(function(){
          $scope.badge_id = badge_id;
          $scope.badgeuse.ok = true;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Communication avec Payutc...";
        });

        Payments.payBadge(UTCAuth.token, badge_id, $scope.purchase.id)
        .then(function(data){

          $scope.purchase.paid = true;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Paiement correctement effectué !";
          $scope.payutc.ok = true;

        }, function(error){


          if (error.data.meta.status == 498) {
            ErrorHandler.alert(error.data.meta)
            UTCAuth.clear()
            $location.path('/login')
          }

          $scope.purchase.paid = false;
          $scope.badgeuse.status = "Carte lue";
          $scope.payutc.status = "Échec lors du paiement. ";
          $scope.payutc.status += ErrorHandler.parse(error).message;
          $scope.payutc.ok = false;

        });

      });

      JCappuccinoFactory.subscribe("badgeuseNotFound", function(message) {

        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Impossible de trouver la badgeuse.";
        });

        $timeout(JCappuccinoFactory.connect, 2000);
      });

      JCappuccinoFactory.subscribe("onopen", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = true;
          $scope.badgeuse.status = "Connecté à la badgeuse. En attente.";
        });
      });

      JCappuccinoFactory.subscribe("onerror", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Erreur de la badgeuse... En attente.";
        });
      });

      JCappuccinoFactory.subscribe("onclose", function(message) {
        $scope.$apply(function(){
          $scope.badgeuse.ok = false;
          $scope.badgeuse.status = "Perte de la badgeuse... En attente.";
        });
        $timeout(JCappuccinoFactory.connect, 2000);
      });
    }

});

app.controller('productsCtrl', function($scope, $http, ErrorHandler, $uibModal, Elements, $rootScope, $location){

    if(!$rootScope.can('list-product'))
        $location.path("/error/404");

    $scope.products = [];

    function init() {
        $scope.loading = true
        $scope.alertFilterOn = false;
        Elements.productsResource.get({}, function(data){
            $scope.products = data.data;
            $scope.loading = false
        }, function(error){
            ErrorHandler.alert(error);
            $scope.loading = false
        });
    }
    init();

    $scope.alertFilter = function(e) {
        return e.remainingQuantity <= e.minQuantity;
    }

    $scope.delete = function(id) {
        var aSupprimer = $scope.products.filter((e)=>e.id==id)[0];
        var index = $scope.products.indexOf(aSupprimer);
        Elements.productsResource.delete({id:id}, function() {
            $scope.products.splice(index, 1);
        })
    }

    $scope.export = function(){
        $http.get(__ENV.apiUrl + '/product/export', {responseType : "blob"}).then(
        function(data){
            saveAs(data.data, 'inventaire_produits.xlsx');
        });
    }

    $scope.open = function(id, type) {

        var selected = $scope.products.filter((e)=>e.id==id)[0];
        if(selected === undefined) selected = {
            minQuantity: 0,
            remainingQuantity: 0,
            price:0
        };
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: 'app/components/products/modal/products_edit.html',
            resolve:{
                object: function() {
                    return angular.copy(selected);
                },
                type: function() {
                    return type;
                }
            },
            controller: 'productsEditCtrl'
        });

        modalInstance.result.then(function(res) {
            init()
            if(res.type == "delete"){
                $scope.delete(res.id);
            }
        })
    }

});

app.controller('roomsCtrl', function($scope, $http, Rooms, $uibModal, ErrorHandler, $location, $rootScope) {

    if(!$rootScope.can('list-room'))
      $location.path("/error/404");

    else{
        function init() {
            $scope.alertFilterOn = false;
            Rooms.get({}, function(res){
                $scope.rooms = res.data;
                console.log(res.data);
            }, function(error){
                ErrorHandler.alert(error);
            });
        }

        $scope.alertFilter = function(e) {
            return e.remainingQuantity <= e.minQuantity;
        }

        $scope.delete = function(id) {
            var aSupprimer = $scope.rooms.filter((e)=>e.id==id)[0];
            var index = $scope.rooms.indexOf(aSupprimer);

            Rooms.remove({id:id}, function() {
                $scope.rooms.splice(index, 1);
            })
        }

        $scope.open = function(id, type) {
            var selected = $scope.rooms.filter((e)=>e.id==id)[0];

            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/rooms/modal/rooms_edit.html',

                resolve:{
                    object: function() {
                        return angular.copy(selected);
                    },
                    type: function() {
                        return type;
                    }
                },
                controller: 'roomsEditCtrl'
            });

            modalInstance.result.then(function(res) {
                console.log(res.changedRoom);
                if(res.type == "delete"){
                    $scope.delete(res.id);
                }
                if(res.type == "create") {
                    $scope.rooms.push(angular.copy(res.changedRoom));
                }else if(res.type=="edit") {
                    $scope.rooms[$scope.rooms.indexOf(selected)] = angular.copy(res.changedRoom);
                }
            })
        }
        init();
    }
});

app.controller('searchCtrl', function($scope, $routeParams, Expendables, Tools, Products, Engines, $uibModal) {

    $scope.filterWord = $routeParams.q;
    $scope.loaded = 0;
    Expendables.get({}, function(res){
        $scope.expendables = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Engines.get({}, function(res){
        $scope.engines = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Products.get({}, function(res){
        $scope.products = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });
    Tools.get({}, function(res){
        $scope.tools = res.data;
        $scope.loaded += 1;
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch('filterWord', function(newv){

    });

    $scope.open = function(element, type) {
        var templateUrl, controllerName;
        switch (type) {
            case 'product':
                templateUrl = 'app/components/admin_products/modal/products_edit.html';
                controllerName = 'productsEditCtrl';
                break;
            case 'expendable':
                templateUrl = 'app/components/expendables/modal/expendables_edit.html';
                controllerName = 'expendablesEditCtrl';
                break;
            case 'tool':
                templateUrl = 'app/components/tools/modal/tools_edit.html';
                controllerName = 'toolsEditCtrl';
                break;
            case 'engine':
                templateUrl = 'app/components/engines/modal/engines_edit.html';
                controllerName = 'enginesEditCtrl';
                break;
            default:
        }

        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: templateUrl,

            resolve:{
                object: function() {
                    return angular.copy(element);
                },
                type: function() {
                    return 'show';
                }
            },
            controller: controllerName
        });

    }
});

app.controller('toolsCtrl', function($scope, $http, Tools, $uibModal, ErrorHandler) {

    init = function(){

        $scope.loading = true

        Tools.get({}, function(res){
            $scope.tools = res.data;
            $scope.loading = false
        }, function(error){
            ErrorHandler.alert(error);
            $scope.loading = false
        });
    }
    init()

    $scope.delete = function(id) {
        var aSupprimer = $scope.tools.filter((e)=>e.id==id)[0];
        var index = $scope.tools.indexOf(aSupprimer);

        Tools.remove({id:id}, function() {
            $scope.tools.splice(index, 1);
        })
    }

    $scope.alertFilter = function(e) {
        return e.remainingQuantity <= e.minQuantity;
    }

    $scope.open = function(id, type) {
        var selected;
        if(id == null){
            selected = {
                minQuantity: 0,
                remainingQuantity: 0
            };
        }else {
            selected = $scope.tools.filter((e)=>e.id==id)[0];
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size:'lg',
            templateUrl: 'app/components/tools/modal/tools_edit.html',

            resolve:{
                object: function() {
                    return angular.copy(selected);
                },
                type: function() {
                    return type;
                }
            },
            controller: 'toolsEditCtrl'
        });

        modalInstance.result.then(function(res) {
            if(res.type == "delete"){
                $scope.delete(res.id);
            }
            init()
        })
    }
});

app.controller('usersCtrl', function($scope, $http, $filter, ErrorHandler, Users) {

  Users.get({}, function(res){
    $scope.users = res.data;
  }, function(error){
    ErrorHandler.alert(error);
  });

  $scope.displayUser = function(userId) {
    var found = $filter('filter')($scope.users, {id: userId}, true);
    if (found.length) {
       $scope.user = found[0];
    }
  }

});

app.controller('usersCreateCtrl', function($scope, ErrorHandler, Users) {

  $scope.submiting = false;

  $scope.submited = false;
  $scope.success = false;

  $scope.user = new Users({});

  $scope.submit = function() {
    $scope.submiting = true;
    $scope.submited = false;
    $scope.success = false;

    $scope.user.$save({}, function(res) {
      $scope.submited = true;
      $scope.submiting = false;
      $scope.success = true;
    }, function(error) {
      $scope.submiting = false;
      $scope.submited = true;
      $scope.success = false;

      if(error.status == 422) {
        $scope.inputErrors = ErrorHandler.parse(error);
      }
      else if(error.status == 409) {
        $scope.messageError = "Cet utilisateur existe déjà";
      }

    });
  };


});

app.controller('usersEditCtrl', function($scope, $http, $filter, $routeParams, ErrorHandler, Users) {

  $scope.submiting = false;

  $scope.submited = false;
  $scope.success = false;

  Users.get({ id : $routeParams.id }, function(res) {
    $scope.user = res.data;
  }, function(error) {
    ErrorHandler.alert(error);
  });

  $scope.submit = function() {
    $scope.submiting = true;
    $scope.submited = false;
    $scope.success = false;
    $scope.inputErrors = false;
    $scope.messageError = false;

    Users.update({id:$routeParams.id}, $scope.user, function(res) {
      $scope.submited = true;
      $scope.submiting = false;
      $scope.success = true;
    }, function(error) {
      $scope.submiting = false;
      $scope.submited = true;
      $scope.success = false;

      if(error.status == 422) {
        $scope.inputErrors = ErrorHandler.parse(error);
      }
      else if(error.status == 409) {
        $scope.messageError = "cet utilisateur existe déjà";
      }

    });
  };


});

app.controller('usersShowCtrl', function($scope, $http, $filter, $routeParams, ErrorHandler, Users) {

  Users.get({ id : $routeParams.id }, function(res) {
    $scope.user = res.data;
  }, function(error) {
    ErrorHandler.alert(error);
  });

});

app.controller('editAddressCtrl', function($scope, $uibModalInstance, address, type, Addresses, ErrorHandler) {
    $scope.address = address; 
    $scope.errors  = false;
    $scope.saving  = false;
    $scope.type = type

    $scope.save = function() {
		$scope.errors   = false;
		$scope.saving   = true;

		if($scope.type == "edit"){
			Addresses.update({id : $scope.address.id}, $scope.address, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		} else if ($scope.type == "create") {
			Addresses.save($scope.address, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		}
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.deleteModal = function() {
    	$scope.saving = true
	    Addresses.delete({id : $scope.address.id}, function(data){
			$uibModalInstance.close();
			$scope.saving = false;
	    }, function(error){
			ErrorHandler.alert(error);
			$scope.saving = false;
	    });

    }
});
app.controller('editEntityCtrl', function($scope, $uibModalInstance, entity, type, Entities, ErrorHandler) {

    $scope.entity = entity;  
    $scope.errors  = false;
    $scope.saving  = false;
    $scope.type = type;

    $scope.save = function() {
        $scope.errors   = false;
        $scope.saving   = true;
        if ($scope.type == "edit"){
            Entities.update({id : $scope.entity.id}, $scope.entity, function(data){
                $uibModalInstance.close();
                $scope.saving = false;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        } else if ($scope.type == "create"){
            Entities.save($scope.entity, function(data){
                $uibModalInstance.close();
                $scope.saving = false;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        }
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.deleteModal = function() {
        Entities.delete({id : $scope.entity.id}, function(data){
            $uibModalInstance.close()
        }, function(error){
            var newError = {}
            newError.message = error.data.data
            ErrorHandler.alert(newError);
        });
    };
})
app.controller("editRoleCtrl", function($scope, $uibModalInstance, role, type, Roles, ErrorHandler, Permissions, UTCAuth) {

    $scope.errors  = false;
    $scope.loading = true;
    $scope.saving  = false;
    $scope.type = type
    $scope.role = role;


        var mapPermissions = function(role) {
        var permissions = [];
        role.permissions.forEach(function (permission) {
            if (permission.selected === true) {
                permissions.push(permission.id);
            }
        });

        return permissions;
    };

    var hasPermission = function(role, permission) {
        var res = false;
        role.permissions.forEach(function (userPerm) {
            if (userPerm.slug == permission) {
                res = true
            }
        });
        return res;
    };

    var getPermissions = function() {
        Permissions.get({}, function (permissions) {
            permissions.data.forEach(function (permission) {
                if ($scope.type == 'create'){
                    $scope.role = {}
                }
                permissions.data.forEach(function (permission) {
                    if ($scope.type == 'edit'){
                        permission.selected = hasPermission($scope.role, permission.slug);
                        permission.changed  = false;
                    }
                    permission.toggleSelected = function() {
                        permission.selected = !permission.selected;
                        permission.changed  = !permission.changed;
                    };
                });


                            });
            $scope.role.permissions = permissions.data;
            $scope.loading = false
        }, function(error) {
            ErrorHandler.alert(error);
        });
    }

    if ($scope.type == "edit"){
        Roles.get({'id' : role.id}, function(data) {
            $scope.role = data.data;
            getPermissions()
        }, function(error) {
            ErrorHandler.alert(error);
        });
    } else if ($scope.type == "create"){
        getPermissions()
    }

    $scope.save = function() {
        $scope.errors   = false;
        $scope.saving   = true;

        var role = Object.assign({}, $scope.role);
        role.permissions = mapPermissions($scope.role);

        if ($scope.type == "create"){
            Roles.save({}, role, function (data) {
                $uibModalInstance.close();
                $scope.saving = false;
            }, function (error) {
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        } else if ($scope.type == "edit") {
            Roles.update({id : $scope.role.id}, role, function (data) {
                UTCAuth.refreshPermissions().then(function () {
                    $uibModalInstance.close();
                    $scope.saving = false;
                });
            }, function (error) {
                $scope.errors = ErrorHandler.parse(error);
                $scope.saving = false;
            });
        }  
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.deleteModal = function() {


        if ($scope.role.name == "Membre CAS") {
            var error = {}          
            error.message = "Erreur 403 : Impossible de supprimer le rôle Membre CAS"
            ErrorHandler.alert(error)

        } else {

            Roles.delete({id: $scope.role.id}, function(data) {
                $uibModalInstance.close();
            }, function (error) {
                ErrorHandler.alert(error);
            });

        }

    };

})

app.controller('editScriptCtrl', function($scope, $uibModalInstance, ErrorHandler, Scripts, Esprima, $rootScope, type, script){

  $scope.type = type
  $scope.script = script 
  $scope.errors = false;
  $scope.scriptErrors = [];
  $scope.saving = false;

  if($scope.script) {
    Scripts.get({ id : $scope.script.id }, function(data) {
      $scope.script = data.data;

      $scope.script.args = JSON.parse($scope.script.args);
        for(var i=0; i<$scope.script.args.length; i++){
            $scope.script.args[i].id = $scope.uniqueid();
            if($scope.script.args[i].listChoices){
                $scope.script.args[i].listChoices = $scope.script.args[i].listChoices.join(',')
            }
        }

    }, function(error) {
      ErrorHandler.alert(error);
    });

  } else {

    $scope.script       = {};
    $scope.script.args  = [];
    $scope.script.script = "(function(args){\n\n\t// écrire le corps du script ici\n\n});"

  }
  $scope.editorEnabled= false;

  $scope.editorOptions = {
    lineWrapping: true,
    mode: 'javascript',
    theme: 'monokai',
    autoRefresh : true
  };

  var checkScript = function(js) {

    $scope.scriptErrors = [];

    try {
      var syntax = Esprima.parse(js);
      var errors = syntax.errors;

      if(errors && errors.length > 0) {
        for(var i=0; i<errors.length; i++) {
          $scope.scriptErrors.push(errors[i]);
        }
        return false;
      }
      else {
        $scope.scriptErrors = [];
      }

    } catch(e) {
      $scope.scriptErrors.push(e);
      return false;
    }

    return true;
  };

  $scope.$watch('script.script', function(newValue, oldValue) {
    if(newValue) {
      checkScript(newValue);
    }
  });

  $scope.uniqueid = function() {
    return "id-" + Math.random().toString(36).substr(2, 16);
  };

  $scope.addArg = function() {
    $scope.script.args.push({id: $scope.uniqueid(), type: "float", permission: false});
  };

  $scope.delArg = function(arg) {
    if(!arg.id) return false;
    $scope.script.args = _.reject($scope.script.args, function(e) { return e.id === arg.id; });
  }

  $scope.save = function() {

    $scope.saving = true;

    if(!checkScript($scope.script.script))
      return false;

    for (var i = $scope.script.args.length - 1; i >= 0; i--) {
        if($scope.script.args[i].type == 'list') {
            if($scope.script.args[i].listChoices){
                $scope.script.args[i].listChoices = $scope.script.args[i].listChoices.split(',')
            } else {
                $scope.saving = false;
                $scope.argListError = true
                return 
            }
        } else {
            delete $scope.script.args[i].listChoices
        }
    }

    if($scope.script.id){


      Scripts.update({'id' : $scope.script.id}, $scope.script, function(data){
        $uibModalInstance.close();
        $scope.saving = false;
      }, function(error){
        for (var i = $scope.script.length - 1; i >= 0; i--) {
            if ($scope.script.args[i].listChoices && $scope.script.args[i].type == 'List')
                $scope.script.args[i].listChoices = $scope.script.args[i].listChoices.split(',')
        }
        $scope.saving = false;
        $scope.errors = ErrorHandler.parse(error);
      });

    }
    else {
      Scripts.save({}, $scope.script, function(data){
        $uibModalInstance.close();
        $scope.saving = false;
      }, function(error){
        for (var i = $scope.script.length - 1; i >= 0; i--) {
            if ($scope.script.args[i].listChoices && $scope.script.args[i].type == 'List')
                $scope.script.args[i].listChoices = $scope.script.args[i].listChoices.split(',')
        }
        $scope.saving = false;
        $scope.errors = ErrorHandler.parse(error);
      });

    }

  };

    $scope.deleteModal = function() {

        Scripts.delete({id: $scope.script.id}, function(data) {
            $uibModalInstance.close();
        }, function (error) {
            ErrorHandler.alert(error);
        });
    };
});

app.controller('editServiceCtrl', function($scope, $uibModalInstance, service, type, Scripts, Services, Engines, ErrorHandler) {

	if(service){
		$scope.service = service;  
	} else {
		$scope.service = {}
	}

		$scope.type = type
	$scope.errors  = false;
	$scope.saving  = false;
	$scope.scripts = [];

	Scripts.get({}, function(data){
		$scope.scripts = data.data;
	}, function(error) {
		ErrorHandler.alert(error);
	});

	Engines.get({}, function(data){
		$scope.engines = data.data;
		if ($scope.service.engine_id) {
			$scope.service.engine = data.data.filter((r)=>r.id == $scope.service.engine_id)[0]
		}
	}, function(error) {
		ErrorHandler.alert(error);
	});

	$scope.save = function() {
		$scope.errors   = false;
		$scope.saving   = true;

		$scope.service.script_id = $scope.service.script.id
		if($scope.service.engine)
			$scope.service.engine_id = $scope.service.engine.id
		else 
			$scope.service.engine_id = null

				if ($scope.type == "create"){
			Services.save($scope.service, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		} else if ($scope.type == "edit"){
			Services.update({id : $scope.service.id}, $scope.service, function(data){
				$uibModalInstance.close();
				$scope.saving = false;
			}, function(error){
				$scope.errors = ErrorHandler.parse(error);
				$scope.saving = false;
			});
		}
	};

	$scope.deleteModal = function() {
		Services.delete({id : $scope.service.id}, $scope.service, function(data){
			$uibModalInstance.close();
			$scope.saving = false;
		}, function(error){
			ErrorHandler.alert(error);
			$scope.saving = false;
		});
	};

	$scope.setScript = function(script) {
		$scope.service.script = script;
	};

	$scope.setEngine = function(engine) {
		$scope.service.engine = engine;
	};

	$scope.cancel = function() {
	$uibModalInstance.dismiss('cancel');
	};
});

app.controller('editUserCtrl', function($scope, $uibModalInstance, scopeParent, type, object, Users, ErrorHandler, Roles, $rootScope, UTCAuth, $location) {

  $scope.user     = object;
  $scope.errors   = false;
  $scope.saving   = false;
  $scope.entities = scopeParent.entities;
  $scope.type = type
  $scope.suggestedUsers = [];
  $scope.loginSearch = {}

  Roles.get({}, function (roles) {
      $scope.roles = roles.data;
  }, function (error) {
      ErrorHandler.alert(error);
  });

  $scope.autocomplete = function () {
    if ($scope.loginSearch.string.length > 3) {
        $scope.loading = true;
        Users.gingerSearch({'query': $scope.loginSearch.string}, function (data) {
            $scope.suggestedUsers = data.data;
            $scope.loading = false;
        }, function (error) {
            ErrorHandler.alert(error);
        });
    } else {
        $scope.suggestedUsers = [];
    }
  }

  $scope.selectUser = function (login) {
      $scope.loading = true;
      $scope.suggestedUsers = [];
      Users.gingerLogin({'login': login}, function (data) {
          data = data;
          $scope.user = {
              firstName: data.prenom,
              lastName: data.nom,
              login: data.login,
              email: data.mail,
              status: data.type,
              terms: false
          };
          $scope.loginSearch.string = '';
          $scope.loading = false;
      }, function (error) {
          $scope.loading = false;
          if (error.status == 404) {
              $scope.errors.message = "Impossible de trouver l'utilisateur '"+login+"'.";
          } else {
              ErrorHandler.alert(error);
          }
      })
  }


  $scope.save = function () {
      $scope.errors = false;
      $scope.saving = true;

      if($scope.user.entity_id == null){
        delete $scope.user.entity_id
      }

      if($scope.type=="create"){
        Users.save({}, $scope.user, function (data) {
            $scope.saving = false;
            $uibModalInstance.close();
        }, function (error) {
            $scope.errors = ErrorHandler.parse(error);
            $scope.saving = false;
        });
      } else if ($scope.type=="edit"){
        if ($scope.user.entity_id == null) {
          delete $scope.user.entity_id
        }
        Users.update({id : $scope.user.id}, $scope.user, function(data){
          if ($scope.user.login == $rootScope.auth.member.login) {
            UTCAuth.clear()
            $location.path('/login')
          }
          $uibModalInstance.close();
          $scope.saving = false;
        }, function(error){
          $scope.errors = ErrorHandler.parse(error);
          $scope.saving = false;
        });
      }
  };

  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };

  $scope.deleteModal = function () {
        var  membreCAS = $scope.roles.filter((r)=>r.name == "Membre CAS")[0];

        if (membreCAS) {
            $scope.user.role_id = membreCAS.id
            if($scope.user.entity_id == null){
                delete $scope.user.entity_id
            }

            Users.update({id : $scope.user.id}, $scope.user, function(data){
              $uibModalInstance.close();
            }, function(error){
              ErrorHandler.alert(error);
            });
        }
  };



})

app.controller("syncUserCtrl", function($scope, $uibModalInstance, scopeParent, Users){

        $scope.users = [];
    $scope.removedUsers = [];
    $scope.waiting = true;
    $scope.roles = scopeParent.roles;

    $scope.getRoleFromId = function(id) {
        var r = null;
        $scope.roles.forEach(function (role) {
            if (role.id == id) {
                r = role;
            }
        });
        return r;
    };

    $scope.roleChanged = function (user) {
        if (user.role_id == null) {
            user.action = 'delete';
        } else if(user.action != 'add') {
            user.action = 'edit';
        }
    };

    Users.getSync({}, function (data) {
        $scope.users = data.data.users;
        $scope.waiting = false;
    }, function(error) {
       ErrorHandler.alert(error);
    });

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.remove = function (user) {
        var index = $scope.users.indexOf(user);
        $scope.users.splice(index, 1);
        $scope.removedUsers.push(user);
    }

    $scope.unremove = function (user) {
        var index = $scope.removedUsers.indexOf(user);
        $scope.removedUsers.splice(index, 1);
        $scope.users.push(user);
    }

    $scope.save = function () {
        $scope.errors = false;
        $scope.saving = true;

        Users.saveSync({}, $scope.users, function (data) {
            $scope.saving = false;
            scopeParent.refreshUsers();
            $uibModalInstance.dismiss('cancel');
        }, function (error) {
            $scope.errors = ErrorHandler.parse(error);
            $scope.saving = false;
        });
    };
})
app.controller('enginesEditCtrl', function($scope, $window, object, type, $uibModalInstance, $http, Engines, ErrorHandler, Rooms) {
    $scope.engine = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.engine.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/engines/image/" + $scope.engine.id;
    }
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.engine.room = res.data.filter((r)=>r.id == $scope.engine.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.engine.id, type:"delete"});
    }

    $scope.$watch("engine.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    function updatePreview() {
        if($scope.engine.pic instanceof File && !$scope.engine.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.engine.pic);
        }
    }

    $scope.iconColor = function() {
        var color;
        switch ($scope.engine.status) {
            case "Disponible":
                color = '#c2db9b';
                break;
            case "En utilisation":
                color = '#ffdb93';
                break;
            case "En maintenance":
                color = '#f3997b';
                break;
            default:
                color = '#c2db9b';
        }
        return {'background-color':color};
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        if ($scope.engine.room) {
            $scope.engine.room_id = $scope.engine.room.id;
        }

        if ($scope.type=='edit') {
            Engines.update({id:$scope.engine.id}, $scope.engine, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Engines.save({}, $scope.engine, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.engine.id = res.data.newId;
        }

        if($scope.engine.pic && $scope.engine.pic instanceof File){

            var url = __ENV.apiUrl + "/engines/"+$scope.engine.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.engine.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.engine.picture = r.data
                $uibModalInstance.close({changedEngine:$scope.engine, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedEngine:$scope.engine, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Une machine avec le même nom existe déjà";
        }

    }
});

app.controller('enginePartsEditCtrl', function($scope, $window, object, type, $uibModalInstance, $http, Engines, ErrorHandler, Rooms, EngineParts) {
    $scope.enginepart = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;


    Engines.get({}, function(res){
        $scope.engines = res.data;
        $scope.enginepart.engine = res.data.filter((e)=>e.id == $scope.enginepart.engine_id)[0];

    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.enginepart.id, type:"delete"});
    }





    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.enginepart.engine_id = $scope.enginepart.engine.id;
        if ($scope.type=='edit') {
            EngineParts.update({id:$scope.enginepart.id}, $scope.enginepart, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            EngineParts.save({}, $scope.enginepart, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.enginepart.id = res.data.newId;
        }

        if($scope.enginepart.pic && $scope.enginepart.pic instanceof File){

            var url = __ENV.apiUrl + "/engines/"+$scope.enginepart.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.enginepart.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.enginepart.picture = r.data
                $uibModalInstance.close({changedEnginePart:$scope.enginepart, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedEnginePart:$scope.enginepart, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Une machine avec le même nom existe déjà";
        }

    }
});

app.controller('expendablesEditCtrl', function($scope, object, type, $uibModalInstance, $http, Expendables, $window, ErrorHandler, Helpers, Rooms, Wardrobes) {
    $scope.expendable = object;
    $scope.type = type;
    if($scope.expendable.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/expendables/image/" + $scope.expendable.id;
    }
    $scope.errors = null;
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        console.log(res.data);
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.expendable.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.expendable.wardrobe_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

    $scope.$watch("expendable.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.expendable.id, type:"delete"});
    }

    function updatePreview() {
        if($scope.expendable.pic instanceof File && !$scope.expendable.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.expendable.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.expendable.room_id = null
        $scope.expendable.wardrobe_id = null
        if($scope.selectedRoom) {
            $scope.expendable.room_id = $scope.selectedRoom.id;
            $scope.expendable.roomName = $scope.selectedRoom.name;

            if($scope.selectedWardrobe) {
                $scope.expendable.wardrobeName = $scope.selectedWardrobe.name;
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.expendable.room_id){
                        $scope.expendable.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 

                if ($scope.type=='edit') {
            Expendables.update({id:$scope.expendable.id}, $scope.expendable, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Expendables.save({}, $scope.expendable, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.expendable.id = res.data.newId;
        }

        if($scope.expendable.pic && $scope.expendable.pic instanceof File){

            var url = __ENV.apiUrl + "/expendables/"+$scope.expendable.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.expendable.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.expendable.picture = r.data
                $uibModalInstance.close({changedExpendable:$scope.expendable, type:$scope.type});
            })
            .error(function(r){
                alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedExpendable:$scope.expendable, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un consommable avec le même nom existe déjà";
        }

    }
});

app.controller('paymentConfirmationCtrl', function($scope, $http, ErrorHandler, $location) {

	$scope.loading = true

		init = function(){

		$http({
	        method : 'GET', 
	        url : __ENV.apiUrl + "/payutc/transaction/info",
	    }).then(function(data){
			$scope.loading = false
	    	$scope.transaction = data.data.data

	    }, function(error){
	    	$scope.loading = false
            ErrorHandler.alert(error.data.meta);
            $location.path("/")
	    });

	}

		init()


})

app.controller('productsEditCtrl', function($scope, object, type, $uibModalInstance, $http, Elements, $window, ErrorHandler, Rooms, Wardrobes, Categories) {
    $scope.product = object;
    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.product.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/products/image/" + $scope.product.id;
    }
    Categories.get({}, function(res){
        $scope.categories = res.data;
    }, function(error){
        ErrorHandler.alert(error);
    });

    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.product.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.product.wardrobe_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }


    $scope.$watch("product.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.product.id, type:"delete"});
    }

    function updatePreview() {
        if($scope.product.pic instanceof File && !$scope.product.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.product.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.product.wardrobe_id = null
        $scope.product.room_id = null
        if($scope.selectedRoom) {
            $scope.product.room_id = $scope.selectedRoom.id;
            $scope.product.roomName = $scope.selectedRoom.name;

                        if($scope.selectedWardrobe) {
                $scope.product.wardrobeName = $scope.selectedWardrobe.name;
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.product.room_id){
                        $scope.product.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 

        $scope.product.categorie_id = null
        if($scope.product.categorie){
            $scope.product.categorie_id = $scope.product.categorie.id;
            $scope.product.categorieName = $scope.product.categorie.name;
        }
        if ($scope.type=='edit') {
            Elements.productsResource.update({id : $scope.product.id}, $scope.product, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Elements.productsResource.save({}, $scope.product, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.product.id = res.data.newId;
        }
        if($scope.product.pic && $scope.product.pic instanceof File){
            var url = __ENV.apiUrl + "/products/"+$scope.product.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.product.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.product.picture = r.data
                $uibModalInstance.close({changedProduct:$scope.product, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedProduct:$scope.product, type:$scope.type});
        }

    }
    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un produit avec le même nom existe déjà";
        }

    }
});

app.controller('purchasesCreateCtrl', function($scope, $q, $location, $http, $rootScope, ErrorHandler, Mail, Users, Services, Products, Purchases, PurchasedElements, Entities, $uibModal) {

    if(!$rootScope.can('order-CAS-member')){
        $location.path("/error/404")
    } else {


        $scope.purchase = {
            login : $rootScope.auth.user,
            products : [],
            services : [],
            association : ""
        };
        $scope.entities = [];
        $scope.purchase.price = "0.00 €"

        $scope.membreCAS = $rootScope.isExtern();
        if($scope.membreCAS) {
            $scope.purchase.user = $rootScope.auth.member;
        }


        if(!$scope.membreCAS) {
            Products.get({},function(res){
                $scope.products = res.data;
            }, function(error) {
                ErrorHandler.alert(error);
                $scope.error = ErrorHandler.parse(error);
            }); 
        }


        Services.get({},function(res){
            $scope.services = res.data;
        }, function(error) {
            ErrorHandler.alert(error);
            $scope.error = ErrorHandler.parse(error);
        });


        Entities.get({}, function(res) {
            $scope.entities = res.data;
            if ($scope.membreCAS){
                $scope.purchase.entity = res.data.filter((r)=>r.name == "Fablab UTC")[0];
            }
        }, function (error) {
            ErrorHandler.alert(error);
        });



        $scope.setUserFromLogin = function() {
            $http({
                method : 'GET',
                url : __ENV.apiUrl + '/users/ginger/' + $scope.purchase.login
            }).then(function(res){
                if(res.data != null) {
                    $scope.error = null;
                    var data = {
                        "login" : res.data.login,
                        "firstName" : res.data.prenom,
                        "lastName" : res.data.nom,
                        "email" : res.data.mail,
                        "status" : res.data.type,
                        "isCotisant" : res.data.is_cotisant
                    };
                    $scope.purchase.user = data;
                }else {
                    $scope.error = "Login invalide";
                }
            }, function(error){
                $scope.error = "Login invalide ou expiré";
            });
        }


        $scope.autocomplete = function () {
            if ($scope.purchase.login.length >= 3) {
                Users.gingerSearch({'query': $scope.purchase.login}, function (data) {
                    $scope.suggestedUsers = data.data;
                });
            } else {
                $scope.suggestedUsers = [];
            }
        }

        $scope.selectUser = function(login){
            $scope.purchase.login = login;
            this.setUserFromLogin();
        }



        $scope.selectEntity = function(entity){
            $scope.purchase.entity = entity;
        };



        $scope.addProduct = function(product) {
            product.remainingQuantity -= 1;
            var index = $scope.purchase.products.map((p) => { return p.id; }).indexOf(product.id);
            if(index == -1) {
                $scope.purchase.products.push({
                    id: product.id,
                    purchasable: product,
                    finalPrice: product.price,
                    suggestedPrice: product.price,
                    purchasable_type : "product",
                    purchasedQuantity: 1
                })
            }else {
                var a = $scope.purchase.products[index]
                a.purchasedQuantity += 1;
                a.finalPrice += a.purchasable.price;
            }
            $scope.priceCalculation()
        }

        $scope.openModalServices = function(service, type) {
            var modalInstance = $uibModal.open({
                backdrop: true,
                keyboard: true,
                size:'lg',
                templateUrl: 'app/components/purchases/modalServices/configure_service.html',

                resolve:{
                    object: function() {
                        return angular.copy(service);
                    },
                    type: function() {
                        return type
                    },
                    email: function(){
                        return $scope.purchase.user.email
                    },
                    num_commande: function(){
                        return null
                    }
                },
                controller: 'configureServiceCtrl'
            });

            modalInstance.result.then(function(res) {
                $scope.purchase.services.push(res.service);
                $scope.priceCalculation()
            })
        }



        $scope.addProductByIndex = function(index) {
            var aAugmenter = $scope.purchase.products[index];
            if(aAugmenter.purchasable.remainingQuantity > 0){
                aAugmenter.purchasedQuantity += 1;
                aAugmenter.finalPrice += aAugmenter.purchasable.price;
                aAugmenter.purchasable.remainingQuantity -= 1;
            }
            $scope.priceCalculation()
        }

        $scope.removeProductByIndex = function(index) {
            var aReduire = $scope.purchase.products[index];
            aReduire.purchasedQuantity -= 1;
            aReduire.finalPrice -= aReduire.purchasable.price;
            aReduire.purchasable.remainingQuantity += 1;
            if(aReduire.purchasedQuantity == 0){
                $scope.purchase.products.splice(index, 1);
            }
            $scope.priceCalculation()
        } 

        $scope.priceCalculation = function(){
            var price = 0
            for (var i = $scope.purchase.services.length - 1; i >= 0; i--) {
                if (!$scope.purchase.services[i].finalPrice){
                    price = "A déterminer"
                    break;
                } else {
                    price += $scope.purchase.services[i].finalPrice
                }
            }
            if (price != "A déterminer") {
                for (var i = $scope.purchase.products.length - 1; i >= 0; i--) {
                    price += $scope.purchase.products[i].finalPrice
                }
                $scope.purchase.price = price.toFixed(2) + " €"
            } else {
                $scope.purchase.price = price
            }
        }


        $scope.save = function() {
            $scope.saving = true;

            var purchaseToSave = new Purchases();

            purchaseToSave.association = $scope.purchase.association;
            purchaseToSave.login = $scope.purchase.user.login;
            if($scope.purchase.entity) 
                purchaseToSave.entity_id = $scope.purchase.entity.id;

            purchaseToSave.$save(function(resP){
                var idPurchase = resP.data.id;
                var num_commande = resP.data.number
                var pe;

                $scope.saveProductsElements(idPurchase).then(function(res){

                    $scope.saveServicesElements(idPurchase).then(function(res){

                                                Mail.demande_envoyée($scope.purchase.user.email, num_commande)

                        if($scope.membreCAS){
                            $location.path('/purchases/success');
                        } else {
                            $location.path('/purchases/' + idPurchase + '/edit');
                        }
                    }, function(error){
                        $scope.saving = false
                    })

                })
            });
        }

        $scope.devis = function() {
            $scope.loadingQuote = true;

            $scope.purchase.devis().then(function(res){
                $scope.loadingQuote = false;
            }, function(error){
                $scope.loadingQuote = false;
                $scope.error = ErrorHandler.parse(error);
            });

        }

        $scope.saveProductsElements = function(idPurchase){

            var promises = $scope.purchase.products.map(function(product) {
                product.purchase_id = idPurchase
                return PurchasedElements.storeElement(product)
            });

            return $q.all(promises); 
        }


        $scope.saveServicesElements = function(idPurchase){

            var promises = $scope.purchase.services.map(function(service) {
                service.purchase_id = idPurchase
                return PurchasedElements.storeElement(service, function(res){
                    var idPE = res.data.newId;

                    if(service.files != undefined) {
                        Array.prototype.forEach.call(service.files, function(file) {
                            if(file instanceof File){
                                var url = __ENV.apiUrl + "/purchased/"+idPE+"/file";
                                var fd = new FormData();
                                fd.append('file', file);
                                $http.post(url, fd, {
                                    transformRequest: angular.identity,
                                    headers: {'Content-Type': undefined}
                                });
                            }
                        });
                    }
                })
            });

            return $q.all(promises); 
        }
    }

});

app.controller('purchasesEditCtrl', function($rootScope, $location, $window, $scope, $http, $routeParams, $location, $uibModal, ErrorHandler, PurchasedElements, Purchases, Entities, UTCAuth, Mail) {

    if (!$rootScope.can('order-CAS-member')) {
        $location.path('/error/404')
    } else {

        $scope.loading = true;


        $scope.purchase       = {};
        $scope.loadingPDF     = false;
        $scope.saving         = false;
        $scope.errors         = false;
        $scope.entities       = [];

        $scope.email = {
            content : '',
            sent: false,
            error: false,
            loading : false
        }


        Purchases.get({ id : $routeParams.id }, function(res) {
            $scope.purchase = res.data;

            $http({
                method : 'GET',
                url : __ENV.apiUrl + '/users/ginger/' + res.data.login
            }).then(function(res){
                var data = {
                    "login" : res.data.login,
                    "firstName" : res.data.prenom,
                    "lastName" : res.data.nom,
                    "email" : res.data.mail,
                    "status" : res.data.type,
                    "isCotisant" : res.data.is_cotisant
                };
                $scope.purchase.user = data;

                $scope.loading = false;

            });
            $scope.membreCAS = $rootScope.isExtern()

            $scope.payurl = "https://cas.utc.fr/cas/login?service=" + encodeURIComponent(__ENV.webappUrl + '/#/payments/' + $scope.purchase.id);

            Entities.get({}, function (res) {
                $scope.entities = res.data;
                $scope.entities.forEach(function (entity) {
                    if($scope.purchase.entity) {
                        if (entity.id === $scope.purchase.entity.id) {
                            entity.selected = true;
                        }
                    }
                })
            });
            updateElements();
        }, function(error) {
            ErrorHandler.alert(error);
        });


        function updateElements(){

            var res = [];
            $scope.purchase.elements.forEach(function(elem){
                var trouve = false;
                res.forEach(function(existant) {
                    if(existant.id == elem.id){
                        existant.elements.push(elem);
                        trouve = true;
                    }
                })
                if(!trouve){
                    res.push({
                        id:elem.id,
                        elements:[elem]
                    })
                }
            })
        }




        $scope.getInvoicePDF = function(purchase) {
            $scope.loadingPDF = true;

            Purchases.pdf({'id' : purchase.id}, function(data){
                saveAs(data.pdf, 'Facture_Fablab_' + purchase.number + '.pdf');
                $scope.loadingPDF = false;
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loadingPDF = false;
            });

        };

        $scope.getQuotePDF = function(purchase) {
            $scope.loadingQuote = true;

            Purchases.quote({'id' : purchase.id}, function(data){
                saveAs(data.pdf, 'Devis_Fablab_' + purchase.number + '.pdf');
                $scope.loadingQuote = false;
            }, function(error){
                ErrorHandler.alert(error);
                $scope.loadingQuote = false;
            });

        };

        $scope.removeAddress = function () {
            Purchases.removeAddress({'id' : $scope.purchase.id}, null, function(res){
                $scope.purchase.address = null;
            }, function(error){
                $scope.errors = ErrorHandler.parse(error);
            });
        };

        $scope.loadModalAddress = function() {

            var dialogOpts = {
                backdrop: true,
                keyboard: true,

                templateUrl: 'app/components/purchases/edition/modal_address.html',

                controller: function($scope, $uibModalInstance, scopeParent, Purchases) {
                    $scope.errors  = false;
                    $scope.saving  = false;

                    if(scopeParent.purchase.address)
                    $scope.address = scopeParent.purchase.address;
                    else
                    $scope.address = {};

                    $scope.selectedAddress = function (address) {
                        $scope.address = address;
                    }
                    $scope.save = function() {
                        $scope.errors  = false;
                        $scope.saving = true;

                        Purchases.address({'id' : scopeParent.purchase.id}, $scope.address, function(res){
                            scopeParent.purchase.address = $scope.address;
                            $uibModalInstance.close();
                        }, function(error){
                            $scope.errors = ErrorHandler.parse(error);
                        });

                        $scope.saving = false;

                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                resolve: {
                    scopeParent: function() {
                        return $scope;
                    }
                }
            };

            $uibModal.open(dialogOpts);
        };



        $scope.loadModalEntity = function() {

            var dialogOpts = {
                backdrop: true,
                keyboard: true,

                templateUrl: 'app/components/purchases/edition/modal_entity.html',

                controller: function($scope, $uibModalInstance, scopeParent, Purchases) {
                    $scope.errors  = false;
                    $scope.saving  = false;
                    $scope.entities = scopeParent.entities;


                    $scope.selectedEntity = function (entity) {
                        scopeParent.purchase.entity = entity;
                        $scope.entities.forEach(function (entity) {
                            entity.selected = false;
                        });
                        entity.selected = true;
                    }
                    $scope.save = function() {
                        $scope.errors  = false;
                        $scope.saving = true;

                        Purchases.entity({'id' : scopeParent.purchase.id}, { 'entity_id' : scopeParent.purchase.entity.id }, function(res){
                            $uibModalInstance.close();
                        }, function(error){
                            $scope.errors = ErrorHandler.parse(error);
                        });

                        $scope.saving = false;

                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                resolve: {
                    scopeParent: function() {
                        return $scope;
                    }
                }
            };

            $uibModal.open(dialogOpts);
        };



        $scope.externalPaid = function() {

            var newPurchase = angular.copy($scope.purchase);
            newPurchase.paid = true;
            newPurchase.externalPaid = true;

            Purchases.externalPaid({ id : $scope.purchase.id }, newPurchase, function(data){
                Purchases.get({ id : $scope.purchase.id }, function(data){
                    $scope.purchase = data.data;
                    $scope.externalPaidSaving = true;
                }, function(error){
                    $scope.externalPaidSaving = false;
                    ErrorHandler.alert(error);
                });

            }, function(error){
                $scope.externalPaidSaving = false;
                ErrorHandler.alert(error);
            });

        };

        $scope.payCard = function(){

            $scope.loading = true;

            $http({
                method : 'POST', 
                url : __ENV.apiUrl + "/payutc/card/" + $scope.purchase.id,
                data : { return_url : __ENV.webappUrl + "/#/payment/confirmation/" + $scope.purchase.id}
            }).then(function(data){

                $window.location.href = data.data.data
            }, function(error){
                ErrorHandler.alert(error.data.meta)

                                if (error.data.meta.status == 498) {
                    UTCAuth.clear()
                    $location.path('/login')
                }

                $scope.loading = false;
            });

        }


        $scope.send_email = function(){

            $scope.email.sent = false;
            $scope.email.error = false;
            $scope.email.loading = true;

            const subject = "Site de gestion du Fablab : commande n° " + $scope.purchase.number

            dataMail = {
                "subject" : subject,
                "content" : $scope.email.content,
                "receiver" : $scope.membreCAS ? "fablab@assos.utc.fr": $scope.purchase.user.email,
            }

            $http({
                method : 'POST',
				url : __ENV.apiUrl + "/send",
				headers : {
          			'Content-Type': 'application/json'
        		},
        		data : dataMail,
                }).then(function successCallback(response) {
                    $scope.email.sent = true;
                    $scope.email.content = "";
                    $scope.email.loading = false;
                }, function errorCallback(response) {
                    $scope.email.error = true;
                    $scope.email.loading = false;
            });

        }



        $scope.cancelPurchase = function(){
            for (var i = $scope.purchase.lastVersionElements.length - 1; i >= 0; i--) {
                if ($scope.purchase.lastVersionElements[0].login_edit == $rootScope.auth.member.login){
                    $scope.purchase.lastVersionElements[i].status = 4
                } else {
                    $scope.purchase.lastVersionElements[i].status = 5
                }
                $scope.purchase.lastVersionElements[i].purchasable_id = $scope.purchase.lastVersionElements[i].purchasable.id
                $scope.purchase.lastVersionElements[i].version = $scope.purchase.lastVersionElements[i].version+1

                PurchasedElements.updateElement($scope.purchase.lastVersionElements[i], function(res){
                    var pe = res.data
                    if ($scope.membreCAS)
                        Mail.annulation_client($scope.purchase.user.email, pe.purchasable, $scope.purchase.number)
                    else 
                        Mail.annulation_fablab($scope.purchase.user.email, pe.purchasable, $scope.purchase.number)

                                       Purchases.get({ id : $routeParams.id }, function(res) {
                        $scope.purchase = res.data;
                        updateElements()
                    })
                }) 
            }
        }

        $scope.open = function(element, type) {
            if (element.purchasable_type == "App\\Service")
            {
                var i = 0;
                    if($scope.purchase.lastVersionElements.length>0)
                    while(i < $scope.purchase.lastVersionElements.length){
                        if($scope.purchase.lastVersionElements[i].id==element.id){
                            selected = $scope.purchase.lastVersionElements[i];
                            break;
                        }
                        i++;
                    }

                    var tabElements = $scope.purchase.elements.filter((e)=>e.id==selected.id)
                    var modalInstance = $uibModal.open({
                        backdrop: true,
                        keyboard: true,
                        size:'lg',
                        templateUrl: 'app/components/purchases/modalServices/configure_service.html',

                                resolve:{
                            object: function() {
                                return angular.copy(tabElements);
                            },
                            type: function() {
                                return type;
                            },
                            email: function(){
                                return $scope.purchase.user.email
                            },
                            num_commande: function(){
                                return $scope.purchase.number
                            }
                        },
                        controller: 'configureServiceCtrl'
                    });

                    modalInstance.result.then(function(res) {

                        $scope.loading = true;

                                Purchases.get({ id : $routeParams.id }, function(res) {
                            $scope.purchase = res.data;
                            updateElements();
                        });

                        $scope.loading = false;

                            });
                }
        }


        $scope.iconColor = function(element) {
            var color;
            switch (element.status) {
                case 4:
                color = '#f3997b'
                break
                case 3:
                color = '#c2db9b';
                break;
                case 2:
                color = '#ffdb93';
                break;
                case 1:
                color = '#ffdb93';
                break;
                case 0:
                color = '#f3997b';
                break;
                default:
                color = '#ffdb93';
            }
            return {'background-color':color};
        };

    }
});

app.controller('purchasesCtrl', function($scope, $http, $filter, ErrorHandler, $rootScope, $location, Purchases, PurchasedElements, $uibModal, $window) {

    if(!$rootScope.can('order-CAS-member')){
        $location.path('error/404')
    } else {

        $scope.user = $rootScope.auth.member;
        $scope.membreCAS = $rootScope.isExtern();
        $scope.apiUrl = __ENV.apiUrl;

        $scope.selectedTab = 'commandes';

        $scope.filter = {}
        $scope.filter.type = "3"

        $scope.loading = true;

        $scope.filter.statusFilter = function(){
            return function(purchase){
                switch ($scope.filter.type){
                    case "0":
                        return purchase.status == 0
                    case "1":
                        return purchase.status == 1
                    case "2":
                        return purchase.status == 2
                    case "3":
                        return purchase.status < 3
                }
            }

                    }

        $scope.filter.unpaidFilter = function(){
            return function(purchase){
                if (purchase.status == 3 && !purchase.paid) {
                    return true;
                } else {
                    return false
                }
            }

                    }

        $scope.filter.enCours = function(){
            return function(purchase){
                if (purchase.status < 3) {
                    return true
                } else {
                    return false
                }
            }
        }

        $scope.triStatus = 3;


        switch ($location.path()){
            case '/mypurchases':
                Purchases.getMyPurchases({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
            case '/purchases':
                Purchases.get({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
            case '/purchases/history':
                Purchases.getHistoryPurchases({}, function(res){
                    $scope.purchases = res.data
                    $scope.loading = false;
                }, function(error){
                    ErrorHandler.alert(error);
                    $scope.loading = false;
                });
                break;
        }


        if (!$scope.membreCAS) {
            PurchasedElements.get({}, function(res){
                $scope.elements = res.data;
            }, function(error){
                ErrorHandler.alert(error);
            });
        }




        $scope.open = function(id) {
            window.open(
                window.__env.webappUrl + "#/purchases/" + id + "/edit",
                '_blank' 
            );
        }
    }

});

app.controller('configureServiceCtrl', function($window, Engines, $scope, $http, $q, object, type, email, num_commande, $uibModalInstance, $filter, ScriptFactory, $rootScope, PurchasedElements, Mail) {


    $scope.user = $rootScope.auth.member
    $scope.membreCAS = $rootScope.isExtern()
    $scope.num_commande = num_commande

    $scope.fonctionPrix = {}

    $scope.type = type
    if ($scope.type == 'create') {

        $scope.element = {}
        $scope.element.args = {}
        $scope.element.comment = ""
        $scope.element.finalPrice = null
        $scope.element.files = []
        $scope.element.newFiles = []

        $scope.service = object;

        $scope.service.script.args = JSON.parse($scope.service.script.args);

        $scope.fonctionPrix.element = $scope.service
        $scope.fonctionPrix.pricer = ScriptFactory($scope.service.script)

            } else if ($scope.type == 'view') {

        $scope.versions = object

        for (var i = $scope.versions.length - 1; i >= 0; i--) {
            var deadline = $scope.versions[i].deadline
            $scope.versions[i].deadlineInput = new Date(moment(deadline).get('year'), moment(deadline).get('month'), moment(deadline).get('date'))
        }

        $scope.element = $scope.versions[object.length-1];

        if($scope.element.status < 3){
            $scope.element.files = []
            $scope.element.addedFiles = []
            $scope.element.deletedFiles = []
            PurchasedElements.getFileList({id: $scope.element.id}, function(data){
                var fileNames = data.data
                for (var i = fileNames.length - 1; i >= 0; i--) {
                    var fileName = fileNames[i]
                    getFile($scope.element.id, fileNames[i])
                }
            })
        }

        $scope.service = $scope.element.purchasable
        $scope.service.script.args = JSON.parse($scope.service.script.args);

        if($scope.element.args.length == 0){
            $scope.element.args = {}
        }

        $scope.fonctionPrix.element = $scope.element.purchasable
        $scope.fonctionPrix.pricer = ScriptFactory($scope.element.purchasable.script)
    }

    $scope.fonctionPrix.args = $scope.element.args;

    $scope.hasPublicPermission = false
    if ($scope.service.script.args){
        for (var i = $scope.service.script.args.length - 1; i >= 0; i--) {
            if ($scope.service.script.args[i].permission) {
                $scope.hasPublicPermission = true
                break;
            }
        }
    }


    $scope.$watch("element.newFiles", function(newV, oldV){
        if(newV instanceof FileList) {


                        for (var i = newV.length - 1; i >= 0; i--) {
                if(newV[i].size < 20971520){ 
                    if ($scope.element.files.length >= 9) {
                        $scope.element.fileError = "Le nombre de fichiers est limité à 9."
                    } else {
                        $scope.element.fileError = ""
                        $scope.element.files.push(newV[i])
                        if($scope.type != "create"){
                            $scope.element.addedFiles.push(newV[i])
                        }
                    }
                } else {
                    $scope.element.fileError = "Fichier trop volumineux (20 Mo maximum). Vous pouvez le réduire ou mettre un lien Filex dans le commentaire."
                } 
            }
        }   
    });

    $scope.$watch("element.args",() => {
        $scope.fonctionPrix.args = $scope.element.args;
    });

    $scope.editType = function(type){
        $scope.type = type
    }



    $scope.deleteFile = function($index, name){
        $scope.element.files.splice($index, 1)
        $scope.element.fileError = "" 
        if ($scope.element.files != "create") {
            if (!fileIsInAddedFile(name)) {
                $scope.element.deletedFiles.push(name)
            } else {
                removeFromAddedFiles(name)
            }

                    }
    }

    var fileIsInAddedFile = function(name){
        for (var i = $scope.element.addedFiles.length - 1; i >= 0; i--) {
            if($scope.element.addedFiles[i].name == name){
                return true;
                break;
            }
        }
        return false
    }

    var removeFromAddedFiles = function(name){
        for (var i = $scope.element.addedFiles.length - 1; i >= 0; i--) {
            if($scope.element.addedFiles[i].name == name) {
                $scope.element.addedFiles.splice(i, 1)
            }
        }
    }

    $scope.downloadFile = function(file){
        if ($scope.type == "create") {
            saveAs(file, file.name)
        } else {
            saveAs(file.file, file.name);
        }
    }

    var getFile = function(id, fileName){

            $http.get(__ENV.apiUrl + '/file/purchasedelement/' + id + '/' + fileName, {responseType : "blob"}).then(function(data){

                var fileObject = {
                    name: fileName,
                    file: data.data
                }
                $scope.element.files.push(fileObject)
            })
    }


    $scope.showPriceModal = function(){
        if($scope.fonctionPrix.args) {
            var price = $scope.fonctionPrix.pricer.compute($scope.fonctionPrix.args);
            if(price != null) return price;
            else return null;
        }
    };


    $scope.changeVersion = function(version){
        $scope.element = $scope.versions[version-1];
    }


    $scope.add = function() {
        if($scope.service.time == undefined || $scope.service.time < 2) {
            $scope.error = "Le champ intervalle de temps est obligatoire et doit être supérieur à 2";
        }else {
            $scope.error = "";            
            var deadline = new Date();
            deadline.setDate(deadline.getDate()+$scope.service.time);
            var status = 0
            if( !$scope.membreCAS && $scope.element.finalPrice) {
                status = 2
            } 

            $uibModalInstance.close({service:{
                purchasable : $scope.service,
                comment : $scope.element.comment,
                deadline : deadline,
                purchasedQuantity : 1,
                files : $scope.element.files,
                args : $scope.element.args,
                suggestedPrice : $scope.showPriceModal(),
                finalPrice : $scope.element.finalPrice,
                purchasable_type : 'service',
                status : status
            }});
        }
    }


    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }


    $scope.delete = function(){
        if ($scope.membreCAS)
            $scope.update(5)
        else 
            $scope.update(4)
    }


    $scope.confirm = function(status){
        $scope.update(status)
    }


    $scope.edit = function(element){
        if ($scope.membreCAS){
            $scope.update(0)
        }
        else {
            if (!$scope.element.finalPrice) {
                $scope.update(0)
            } else if ($scope.versions[0].login_edit == $rootScope.auth.member.login) {
                $scope.update(2)
            } else {
                $scope.update(1)
            }
        }
    }


    $scope.update = function(status) {

        $scope.element.deadline = $filter('date')($scope.element.deadlineInput, "yyyy-MM-dd");

        $scope.messageError = null;
        $scope.inputErrors = null;

        $scope.element.args = $scope.fonctionPrix.args;

        var pe = {}
        pe.id=$scope.element.id;
        pe.purchase_id = $scope.element.purchase_id;
        pe.purchasedQuantity = $scope.element.purchasedQuantity;
        pe.finalPrice = $scope.element.finalPrice;
        pe.suggestedPrice =  $scope.showPriceModal();
        pe.version = $scope.element.version+1;
        pe.comment = $scope.element.comment;
        pe.args = $scope.element.args;
        pe.deadline = $scope.element.deadline;
        pe.login_edit = $scope.user.login
        pe.purchasable_id = $scope.element.purchasable.id;
        pe.deleted_files = $scope.element.deletedFiles;

        pe.status = status;

        if($scope.element.PurchasedName=="Produit") {
            pe.purchasable_type = "product";
        }
        else {
            pe.purchasable_type="service";
        }

        PurchasedElements.updateElement(pe, function(res){
            $scope.saveFiles().then(function(res){

                switch(status){
                    case 0 :
                    Mail.demande_modifiée(email, $scope.element.purchasable, $scope.num_commande)

                    break;
                    case 1 :
                    Mail.validation_fablab(email, $scope.element.purchasable, $scope.num_commande)

                    break;
                    case 2 :
                    Mail.validation_client(email, $scope.element.purchasable, $scope.num_commande)

                    break;
                    case 3 :
                    Mail.realisation(email, $scope.element.purchasable, $scope.num_commande)
                    if ("t" in $scope.element.args){
                        Engines.usedEngine({id : $scope.service.engine_id, time: $scope.element.args["t"]}, function(res){
                        })
                    }

                    break;
                    case 4 :
                    Mail.annulation_fablab(email, $scope.element.purchasable, $scope.num_commande)

                    break;
                    case 5 :
                    Mail.annulation_client(email, $scope.element.purchasable, $scope.num_commande)

                    break;
                }

                $scope.element.status = status;
                $uibModalInstance.close({changedElement : $scope.element});

            })


                    });

        $scope.saveFiles = function(){


            var promises = $scope.element.addedFiles.map(function(file){
                if(file instanceof File){
                    var idPE = $scope.element.id;
                    var url = __ENV.apiUrl + "/purchased/"+idPE+"/file";
                    var fd = new FormData();
                    fd.append('file', file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    });
                }
            })

            return $q.all(promises); 
        }


            };

});

app.controller('roomsEditCtrl', function($scope, object, type, $uibModalInstance, $http, Rooms, $window, ErrorHandler, Helpers, Wardrobes) {
    $scope.room = object;
    $scope.type = type;
    $scope.errors = null;




    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canChange = $scope.type == 'view';
        $scope.canDelete = $scope.type == 'edit' || $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }


console.log("DEBUT MODALE");




function init_test(room_id) {     
            Wardrobes.get({}, function(res){
                $scope.wardrobes_associate_to_room = res.data.filter((e)=>e.room_id==room_id);  
                console.log(res.data);
            }, function(error){
                ErrorHandler.alert(error);
            });
        }

if($scope.type=='view' || $scope.type=='edit')  
    {
        $scope.room_id=$scope.room.id;  
        init_test($scope.room_id);  
    }

    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.room.id, type:"delete"});
    }

    $scope.save = function() {
        console.log("save");
        $scope.messageError = null;
        $scope.inputErrors = null;
        if($scope.selectedRoom) {
            $scope.room.room_id = $scope.selectedRoom.id;
            $scope.room.roomName = $scope.selectedRoom.name;
        }


                if ($scope.type=='edit') 
        {

            for (id in $scope.wardrobe_id_to_delete)
            {
                Wardrobes.delete({id: $scope.wardrobe_id_to_delete[id]});
                console.log("deleting wardrobe id :"+$scope.wardrobe_id_to_delete[id]);
            }

                        Rooms.update({id:$scope.room.id}, $scope.room, envoyerImage, gererErreur);
            var Wardrobes_not_updated=[]                
            var Wardrobes_not_created=[]

            for(x in $scope.wardrobes_associate_to_room)                            
            { 
                var name_wardrobe_temp=$scope.wardrobes_associate_to_room[x].name 
                if(name_wardrobe_temp)                                             
                {
                    var regex_wardrobes =name_wardrobe_temp.match(/[a,c][0-9]n[0-9]+/)   
                }
                if(regex_wardrobes)
                {
                Wardrobes.update({id:$scope.wardrobes_associate_to_room[x].id},$scope.wardrobes_associate_to_room[x]); 
                }
                else
                {
                    Wardrobes_not_updated.push(name_wardrobe_temp)
                    console.log("update",name_wardrobe_temp, "échouée");
                }
            }


                        console.log("Création et ajout de wardrobes");
            var wardrobe_new = document.getElementsByName("new_wardrobes_to_create");  
            for (i in wardrobe_new)  
            {   
                if(wardrobe_new[i].value)
                {
                    var regex_wardrobes =wardrobe_new[i].value.match(/[a,c][0-9]n[0-9]+/)   
                    console.log( regex_wardrobes)
                    if(regex_wardrobes)  
                    {
                        Wardrobes.save({name:wardrobe_new[i].value,room_id:$scope.room.id},gererErreur);
                        console.log("Wardrobe "+wardrobe_new[i].value+" ajoutée");
                    }
                    else
                        { 
                            Wardrobes_not_created.push(wardrobe_new[i].name)
                            console.log("Echec de l'ajout "+wardrobe_new[i].value);
                        }
                }
            }


                   }
        else if($scope.type=='create') {
            Rooms.save({}, $scope.room, envoyerImage, gererErreur);

        }
    } 

$scope.inputs = [];
$scope.moreInputs = function()
    {
    console.log('added an input');
    $scope.inputs.push(0);
}


$scope.text_button=[] 
$scope.wardrobe_id_to_delete=[]; 
$scope.Delete_button = function(id_wardrobe){

    var id_of_tab=$scope.wardrobe_id_to_delete.indexOf(id_wardrobe);

    if($scope.wardrobe_id_to_delete.indexOf(id_wardrobe) == -1)
    {
        $scope.wardrobe_id_to_delete.push(id_wardrobe); 
        $scope.text_button[id_wardrobe]="Oui";
    }
    else
    {
        $scope.wardrobe_id_to_delete.splice($scope.wardrobe_id_to_delete.indexOf(id_of_tab),1);  
        $scope.text_button[id_wardrobe]="Non";
    }
}

$scope.text_button_2=[] 
$scope.wardrobe_id_to_modify=[]; 
$scope.Modify_button = function(id_wardrobe){

    var id_of_tab=$scope.wardrobe_id_to_modify.indexOf(id_wardrobe);

    if($scope.wardrobe_id_to_modify.indexOf(id_wardrobe) == -1)
    {
        $scope.wardrobe_id_to_modify.push(id_wardrobe); 
        $scope.text_button_2[id_wardrobe]="Oui";
    }
    else
    {
        $scope.wardrobe_id_to_modify.splice($scope.wardrobe_id_to_modify.indexOf(id_of_tab),1);  
        $scope.text_button_2[id_wardrobe]="Non";
    }
}

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.room.id = res.data.newId;
        }
            $uibModalInstance.close({changedRoom:$scope.room, type:$scope.type});
    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Une salle avec le même nom existe déjà";
        }

    }
});

app.controller('toolsEditCtrl', function($scope, object, type, $uibModalInstance, ErrorHandler, $http, Tools, $window, Rooms, Wardrobes, $filter, moment) {
    $scope.tool = object;

    var expiryDate = $scope.tool.expiryDate
    var dateOfPurchase = $scope.tool.dateOfPurchase
    $scope.tool.expiryDate = new Date(moment(expiryDate).get('year'), moment(expiryDate).get('month'), moment(expiryDate).get('date'))
    $scope.tool.dateOfPurchase = new Date(moment(dateOfPurchase).get('year'), moment(dateOfPurchase).get('month'), moment(dateOfPurchase).get('date'))
    $scope.currentDate = new Date();

    $scope.type = type;
    $scope.previewSrc = null;
    $scope.errors = null;
    if($scope.tool.picture) {
        $scope.previewSrc = __ENV.apiUrl + "/tools/image/" + $scope.tool.id;
    }
    Rooms.get({}, function(res){
        $scope.rooms = res.data;
        $scope.selectedRoom = res.data.filter((r)=>r.id == $scope.tool.room_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    Wardrobes.get({}, function(res){
        $scope.wardrobes = res.data;
        $scope.selectedWardrobe = res.data.filter((r)=>r.id == $scope.tool.wardrobe_id)[0];
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.$watch("type", () => {
        $scope.show = $scope.type == 'show' || $scope.type == 'view';
        $scope.edit = $scope.type == 'edit' || $scope.type == 'create';
        $scope.canDelete = $scope.type == 'view' || $scope.type == 'edit';
        $scope.canChange = $scope.type == 'view';
    })

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }


    $scope.delete = function() {
        $uibModalInstance.close({id:$scope.tool.id, type:"delete"});
    }

    $scope.$watch("tool.pic", function(newV, oldV) {
        if(newV !== oldV && newV instanceof File) {
            $scope.previewSrc = $window.URL.createObjectURL(newV);
        }
    });

    function updatePreview() {
        if($scope.tool.pic instanceof File && !$scope.tool.picture) {
            $scope.previewSrc = $window.URL.createObjectURL($scope.tool.pic);
        }
    }

    $scope.save = function() {
        $scope.messageError = null;
        $scope.inputErrors = null;
        $scope.tool.room_id = null
        $scope.tool.wardrobe_id = null
        if($scope.selectedRoom) {
            $scope.tool.room_id = $scope.selectedRoom.id;
            $scope.tool.roomName = $scope.selectedRoom.name;

            if($scope.selectedWardrobe) {
                $scope.tool.wardrobeName = $scope.selectedWardrobe.name;
                for (var i = $scope.wardrobes.length - 1; i >= 0; i--) {
                    if ($scope.wardrobes[i].name == $scope.selectedWardrobe.name && $scope.wardrobes[i].room_id == $scope.tool.room_id){
                        $scope.tool.wardrobe_id = $scope.wardrobes[i].id
                        break
                    }
                }
            }
        } 

        if($scope.tool.type=='chemical'){
            $scope.tool.dateOfPurchase = $filter('date')($scope.tool.dateOfPurchase, "yyyy-MM-dd");
            $scope.tool.expiryDate = $filter('date')($scope.tool.expiryDate, "yyyy-MM-dd");
        }
        if ($scope.type=='edit') {
            Tools.update({id:$scope.tool.id}, $scope.tool, envoyerImage, gererErreur);
        }else if($scope.type=='create') {
            Tools.save({}, $scope.tool, envoyerImage, gererErreur);
        }
    }

    var envoyerImage = function(res) {
        if(res.meta.status == 201) {
            $scope.tool.id = res.data.newId;
        }

        if($scope.tool.pic && $scope.tool.pic instanceof File){

            var url = __ENV.apiUrl + "/tools/"+$scope.tool.id+"/image";
            var fd = new FormData();
            fd.append('updatePic', $scope.tool.pic);
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(r){
                $scope.tool.picture = r.data
                $uibModalInstance.close({changedTool:$scope.tool, type:$scope.type});
            })
            .error(function(r){
                ErrorHandler.alert("Erreur lors de la sauvegarde de l'image");
            });
        }else {
            $uibModalInstance.close({changedTool:$scope.tool, type:$scope.type});
        }

    }

    var gererErreur = function(error) {
        if(error.status == 422) {
            $scope.inputErrors = error.data.data;
        }
        else if(error.status == 409) {
            $scope.messageError = "Un outil avec le même nom existe déjà";
        }

    }
});
