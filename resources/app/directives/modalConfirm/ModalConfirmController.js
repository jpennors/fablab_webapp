app.controller('ModalConfirmCtrl', function ($scope, $uibModalInstance, text) {

  $scope.text = text || "Êtes-vous sûr de supprimer cet objet ?";

  $scope.ok = function () {
    $uibModalInstance.close(true);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
