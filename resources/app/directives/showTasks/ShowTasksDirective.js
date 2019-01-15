app.directive('showTasks', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/showTasks/tasks_show.html',
    controller: 'tasksCtrl',
  };
});
