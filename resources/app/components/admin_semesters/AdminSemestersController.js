/*
 *  Gestion des Semestres
 */
app.controller('adminSemestersCtrl', function($scope, ErrorHandler, Semesters, $rootScope, $location){

    //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
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
  
      /*
       *  Mise à jour des Semestres
       */
      $scope.update = function() {
        // Chargement des Semestres
        Semesters.get({}, function(data){
          $scope.semesters = data.data;
          $scope.current_semester = $scope.semesters.filter((s => s.current == true))[0]
        }, function(error){
          ErrorHandler.alert(error);
        });
      };
  
      $scope.update();

      // Redéfinition du semestre courant à utiliser dans l'application
      $scope.setNewCurrentSemester = function(){
        Semesters.setCurrentSemester({id: $scope.current_semester.id}, function(){
          $scope.current_semester_changed = true;
        })
      }

      // Création d'un nouveau semestre
      $scope.addNewSemester = function(){
        Semesters.save({}, $scope.new_semester, function(){
          $scope.update();
          $scope.new_semester.name = "";
          $scope.semester_added = true;
        });
      }

      // Ajout d'un semestre provisoire utilisé dans la session
      // Il sera envoyé à UTCAuth et récupéré au moment de l'envoi de chaque requête
      $scope.setSemesterInSession = function(){
        $scope.semester_in_session.set = true;
        // TO DO in UTC AUth
      }

      // Suppression du semestre utilisé en session
      // Retour à l'utilisation par défaut
      $scope.removeSemesterFromSession = function(){
        $scope.semester_in_session.set= false;
        $scope.semester_in_session.activate = false;
        // TO DO Remove from UTCAuth
      }

      // Active dans le fichier HTML la possibilité de choisir 
      // un semestre à utiliser pour la session
      $scope.activateSemesterInSession = function(){
        $scope.semester_in_session.activate = true;
      }

    }
  });
  