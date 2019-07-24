/*
 *  Gestion des Semestres
 */
app.controller('adminSemestersCtrl', function($scope, ErrorHandler, Semesters, UTCAuth, $rootScope, $location){

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
        'semester': {}
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
          // Chargement si besoin du semestre utilisé en session
          $scope.loadSession();
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
        UTCAuth.setNewSemesterInSession($scope.semester_in_session.semester.id);
        $scope.semester_in_session.set = true;
      }

      // Suppression du semestre utilisé en session
      // Retour à l'utilisation par défaut
      $scope.removeSemesterFromSession = function(){
        UTCAuth.removeSemesterInSession();
        $scope.semester_in_session.set= false;
        $scope.semester_in_session.activate = false;
      }

      // Active dans le fichier HTML la possibilité de choisir 
      // un semestre à utiliser pour la session
      $scope.activateSemesterInSession = function(){
        $scope.semester_in_session.activate = true;
      }

      // Fonction récupérant la session courante et vérifiant 
      // s'il n'y a pas déjà un semestre utilisé par défaut
      $scope.loadSession = function(){
        if (!UTCAuth.isSemesterNull()) {
          $scope.semester_in_session.set = true;
          $scope.semester_in_session.activate = true;
          const semester_id = UTCAuth.getSemesterInSession();
          $scope.semester_in_session.semester = $scope.semesters.filter((r) => r.id == semester_id)[0]
        }
      }

    }
  });
  