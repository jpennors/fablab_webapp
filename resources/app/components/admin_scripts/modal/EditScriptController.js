/*
 *  Gestion des scripts de prix de services
 */
app.controller('editScriptCtrl', function($scope, $uibModalInstance, ErrorHandler, Scripts, Esprima, $rootScope, type, script){

  /**
   *  Initialisation de la page
   */
  $scope.type = type
  $scope.script = script 
  $scope.errors = false;
  $scope.scriptErrors = [];
  $scope.saving = false;

  if($scope.script) {
    // Édition
    Scripts.get({ id : $scope.script.id }, function(data) {
      $scope.script = data.data;

      // On parse le JSON des args
      $scope.script.args = JSON.parse($scope.script.args);
      // On ajoute un uniqueid pour gérer de ce côté les args et fonction choice pour type list
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

    // Nouveau
    $scope.script       = {};
    $scope.script.args  = [];
    $scope.script.script = "(function(args){\n\n\t// écrire le corps du script ici\n\n});"

  }
  $scope.editorEnabled= false;

  /**
   *  Options CodeMirror
   */
  $scope.editorOptions = {
    lineWrapping: true,
    mode: 'javascript',
    theme: 'monokai',
    autoRefresh : true
  };

  /**
   *  Vérifie que le code du script est bon
   */
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

  /**
   *  Esprima
   */
  $scope.$watch('script.script', function(newValue, oldValue) {
    if(newValue) {
      checkScript(newValue);
    }
  });

  /**
   *  Génère un id unique pour chaque élément du panier
   */
  $scope.uniqueid = function() {
    return "id-" + Math.random().toString(36).substr(2, 16);
  };

  /*
   *  Ajout d'un argument
   */
  $scope.addArg = function() {
    $scope.script.args.push({id: $scope.uniqueid(), type: "float", permission: false});
  };

  /*
   *  Suppression d'un argument
   */
  $scope.delArg = function(arg) {
    if(!arg.id) return false;
    $scope.script.args = _.reject($scope.script.args, function(e) { return e.id === arg.id; });
  }

  /*
   *  Enregistre la fonction de prix
   */
  $scope.save = function() {

    $scope.saving = true;

    // On vérifie que le script est bon
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


      // Update
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
      // Store
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

    /**
     *  Supprime la fonction de prix
     */
    $scope.deleteModal = function() {

        Scripts.delete({id: $scope.script.id}, function(data) {
            $uibModalInstance.close();
        }, function (error) {
            ErrorHandler.alert(error);
        });
    };
});
