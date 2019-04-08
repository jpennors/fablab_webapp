app.directive('filesModel', function (){
    return {
        controller: function($parse, $element, $attrs, $scope){
            var exp = $parse($attrs.filesModel);
            var isMultiple = $attrs.multiple;
            $element.on('change', function(){
                if(isMultiple) {
                    exp.assign($scope, this.files);
                }else {
                    exp.assign($scope, this.files[0]);
                }
                $scope.$apply();
            });
        }
    };
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.directive('inWrapper', function($rootScope) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {},
        controller: function($rootScope, $scope, $element, $attrs) {
        },
        templateUrl: 'app/directives/inWrapper/in_wrapper.html',
    };
});

app.directive('confirm', function(ConfirmFactory) {
    return {
        restrict: 'A',
        scope: {
            eventHandler: '&ngClick'
        },
        link: function(scope, element, attrs){
          element.unbind("click");
          element.bind("click", function(e) {
            ConfirmFactory.open(attrs.confirm, scope.eventHandler);
          });
        }
    }
});

app.controller('ModalConfirmCtrl', function ($scope, $uibModalInstance, text) {

  $scope.text = text || "Êtes-vous sûr de supprimer cet objet ?";

  $scope.ok = function () {
    $uibModalInstance.close(true);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

app.directive('modalConfirm', function() {
  return {
    restrict: 'E',
    scope: {
      object : '@object',
      yes : '&yes',
      no : '&no',
    },
    controller: function($scope, $element, $attrs) {

    },
    templateUrl: 'app/directives/modalConfirm/modal_show.html'
  };
});

app.directive('outWrapper', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: function($rootScope, $scope, $element, $attrs) {
    },
    templateUrl: 'app/directives/outWrapper/out_wrapper.html',
  };
});

app.directive('search', function() {
    return {
        restrict: 'EA',
        scope: {},
        controller: function($scope) {
            $scope.checkIfEnterKeyWasPressed = function($event){
                var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    window.location.href = '#/search/?q='+$scope.q;
                }

            };
        },
        template : '<input ng-keypress="checkIfEnterKeyWasPressed($event)" ng-model="q" type="text" size="40" placeholder="Recherche..." />',
    }
});

app.controller('alertsCtrl', function($http, $scope, ErrorHandler, Products, Expendables, Tools, $uibModal){
    $scope.alerts = {
        expendables:[],
        products:[],
        tools:[]
    };
    Products.get({}, function(res){
        $scope.alerts.products = res.data.filter(p => p.remainingQuantity <= p.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });
    Expendables.get({}, function(res){
        $scope.alerts.expendables = res.data.filter(e => e.remainingQuantity <= e.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });
    Tools.get({}, function(res){
        $scope.alerts.tools = res.data.filter(e => e.remainingQuantity <= e.minQuantity);
    }, function(error){
        ErrorHandler.alert(error);
    });

    $scope.open = function(element, type) {

        var templateUrl, controllerName;
        switch (type) {
            case 'product':
                templateUrl = 'app/components/products/modal/products_edit.html';
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

app.directive('showAlerts', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/showAlerts/alerts_show.html',
    controller: 'alertsCtrl',
  };
});

app.controller('enginePartAlertsCtrl', function($http, $scope, $window, ErrorHandler, EngineParts){

    init = function(){
        EngineParts.get({}, function(res) {
            console.log("pourlet", res)
            $scope.ep = res.data
        }, function(error){
            ErrorHandler.alert(error);
        });
    }
    init()

    $scope.filter = {}
    $scope.filter.statusFilter = function(){
        return function(pe){
            return (pe.need_maintenance == true)
        }
    }

    $scope.resetMaintenance = function($id){
        console.log($id)
        EngineParts.resetMaintenance({id: $id}, function(res){
            init()
        })
    }
});

app.directive('showEnginePartAlerts', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/showEnginePartAlerts/engine_part_alerts_show.html',
        controller: 'enginePartAlertsCtrl',
    };
});

app.directive('showErrors', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            errors : '=errorsData'
        },
        templateUrl: 'app/directives/showErrors/errors_show.html',
    };
});

app.directive('showProducts', function() {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      products : '=productsData',
      callback : '&productsCallback',
    },
    controller: function($scope, $element, $attrs) {

    },
    templateUrl: 'app/directives/showProducts/products_show.html',
  };
});

app.controller('alertsPurchaseCtrl', function($http, $scope, $window, ErrorHandler, PurchasedElements, $rootScope){


    if($rootScope.can('view-all-entity-purchase')){
        PurchasedElements.get({}, function(res) {
            $scope.pes = res.data        
            for (var i = $scope.pes.length - 1; i >= 0; i--) {
                var deadline = $scope.pes[i].deadline
                $scope.pes[i].deadline = new Date(moment(deadline).get('year'), moment(deadline).get('month'), moment(deadline).get('date'))
            }
        }, function(error){
            ErrorHandler.alert(error);
        });
    }   

    $scope.redirect = function(id) {
        $window.location.href = "#/purchases/" + id + "/edit"
    }

    $scope.filter = {}
    $scope.filter.statusFilter = function(){
        return function(pe){
            return (pe.status == 2 || pe.status == 0)
        }
    }
});

app.directive('showPurchaseAlerts', function() {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/showPurchaseAlerts/purchase_alerts_show.html',
        controller: 'alertsPurchaseCtrl',
    };
});

app.directive('showTasks', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/showTasks/tasks_show.html',
    controller: 'tasksCtrl',
  };
});

app.controller('tasksCtrl', function($http, $rootScope, $scope, Tasks, $uibModal, ErrorHandler, uibDateParser, $filter, Users, $timeout){


    $scope.user = $rootScope.auth.member

    if($rootScope.can('list-task')){
        Tasks.get({}, function(res){
            $scope.tasks = res.data;
        }, function(error){
            ErrorHandler.alert(error);
        });
    }

    $scope.dynamicPopover = {
        content: 'Hello, World!',
        templateUrl: 'myPopoverTemplate.html',
        title: '',
        author_id: 0,
        author_firstname: '',
        author_lastname: '',
        deadline: '',
        progress: 0,
    };

    $scope.detectTask = function(task){
        $scope.dynamicPopover.title = task.name;
        $scope.dynamicPopover.author = task.author;
        $scope.dynamicPopover.deadline = task.deadline_date;
        $scope.dynamicPopover.progress = task.percents_realized;
    };

    $scope.newTask = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            component: 'modalComponent',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            resolve: {
                name: function() {
                    return '';
                },
                deadline_date: function () {
                    return null;
                },
                deadline_time: function () {
                    return null;
                },
                progress: function(){
                    return 0;
                },
                description: function(){
                    return '';
                },

            }
        });

        modalInstance.result.then(function (res) {
            if($filter('date')(res.deadline_date, 'yyyy-MM-dd'))
            res.deadline = $filter('date')(res.deadline_date, 'yyyy-MM-dd');
            if($filter('date')(res.deadline_time, 'HH:mm:ss'))
            res.deadline += ' ' + $filter('date')(res.deadline_time, 'HH:mm:ss');

            task = new Tasks({});
            task.name = res.name;
            task.author_id = $scope.user.id;
            task.author_firstname = $scope.user.firstname;
            task.author_lastname = $scope.user.lastname;
            task.description = res.description;
            task.deadline_date = res.deadline;
            task.percents_realized = res.progress;

            task.$save({}, function(retour) {
                $scope.tasks.push(retour.data);
            }, function(error) {

                if(error.status == 422) {
                    $scope.inputErrors = ErrorHandler.parse(error);
                }
                else if(error.status == 409) {
                    $scope.messageError = "Cette tâche existe déjà";
                }

            });

        });

    };

    $scope.modifyTask = function (task) {
        var date, time;
        if(task.deadline_date)
        {
            var spl = task.deadline_date.split(" ");
            date = spl[0];
            time = spl[1];
        }
        else {
            date = time = null;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'modalComponent',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            resolve: {
                id: () => task.id,
                name: function() {
                    return task.name;
                },
                deadline_date: function () {
                    return uibDateParser.parse(date, 'yyyy-MM-dd');
                },
                deadline_time: function () {
                    return uibDateParser.parse(time, 'HH:mm:ss');
                },
                progress: function(){
                    return parseInt(task.percents_realized);
                },
                description: function(){
                    return task.description;
                },

            }
        });

        modalInstance.result.then(function (res) {
            if(res.type === "delete") {
                var aSupprimer = $scope.tasks.filter((t)=>t.id==res.id)[0];
                var index = $scope.tasks.indexOf(aSupprimer);

                Tasks.delete({id:res.id}, function() {
                    $scope.tasks.splice(index, 1);
                })
            }else{

                if($filter('date')(res.deadline_date, 'yyyy-MM-dd'))
                res.deadline = $filter('date')(res.deadline_date, 'yyyy-MM-dd');
                if($filter('date')(res.deadline_time, 'HH:mm:ss'))
                res.deadline += ' ' + $filter('date')(res.deadline_time, 'HH:mm:ss');

                task.name = res.name;
                task.description = res.description;
                task.deadline_date = res.deadline;
                task.percents_realized = res.progress;

                Tasks.update({id:task.id}, task, function(retour) {
                }, function(error) {

                    if(error.status == 422) {
                        $scope.inputErrors = ErrorHandler.parse(error);
                    }
                    else if(error.status == 409) {
                        $scope.messageError = "Cette tâche existe déjà";
                    }

                });
            }

        });

    };

});

app.component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function ($rootScope) {
        var $ctrl = this;
        $ctrl.canDelete = $rootScope.can('delete-task');
        $ctrl.$onInit = function () {
            $ctrl.res = {
                name: $ctrl.resolve.name,
                deadline_date: $ctrl.resolve.deadline_date,
                deadline_time: $ctrl.resolve.deadline_time,
                progress: $ctrl.resolve.progress,
                description: $ctrl.resolve.description,
            };
        };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.res});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };

        $ctrl.delete = function(){
            $ctrl.close({$value: {type:"delete", id : $ctrl.resolve.id}});
        }

        $ctrl.popupDate = {
            opened: false
        };

        $ctrl.openPopupDate = function() {
            $ctrl.popupDate.opened = true;
        };

        $ctrl.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2030, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };


    }
});

app.directive('showUser', function() {
  return {
    restrict: 'E',
    scope: {
      user : '=user'
    },
    templateUrl: 'app/directives/showUser/user_show.html'
  };
});

app.directive('showUsers', function(Roles, ErrorHandler) {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      users : '=usersData',
      title : '@usersTitle',
      callback : '&usersClick',
      maxSize: '@?',
      maxItems: '@?'
    },
    controller: function($scope, $element, $attrs) {
      $scope.roles = [];
      $scope.unselectedRoles = [];
      Roles.get({}, function (data) {
          $scope.roles = data.data;
      }, function (error) {
          ErrorHandler.alert(error);
      });
      $scope.currentPage  = 1;  
      $scope.loading = true; 

      if ($scope.maxSize == undefined)
        $scope.maxSize  = 5;  
      if ($scope.maxItems == undefined)
        $scope.maxItems = 2;  

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
    },
    templateUrl: 'app/directives/showUsers/users_show.html',
  };
});

app.directive('csvExpendables', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvExpendables/csv_expendables.html',
  };
});


app.directive('csvEngines', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvEngines/csv_engines.html',
  };
});


app.directive('csvProducts', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
    	items : '=',
    	headers : '='
    },
    templateUrl: 'app/directives/csv/csvProducts/csv_products.html',
  };
});


app.directive('csvScripts', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
    	items : '=',
    	headers : '='
    },
    templateUrl: 'app/directives/csv/csvScripts/csv_scripts.html',
  };
});


app.directive('csvTools', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvTools/csv_tools.html',
  };
});

