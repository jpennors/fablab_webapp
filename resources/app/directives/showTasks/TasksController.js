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

            // Envoi de la requête POST
            task.$save({}, function(retour) {
                $scope.tasks.push(retour.data);
            }, function(error) {

                if(error.status == 422) {
                    // On affiche les messages d'erreurs
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

                // Envoi de la requête PUT
                Tasks.update({id:task.id}, task, function(retour) {
                }, function(error) {

                    if(error.status == 422) {
                        // On affiche les messages d'erreurs
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
