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
