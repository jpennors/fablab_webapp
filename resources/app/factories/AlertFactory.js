/**
 *  Factory pour ouvrir de simples modales
 */
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
