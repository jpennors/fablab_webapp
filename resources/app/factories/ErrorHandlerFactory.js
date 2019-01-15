/**
 *  Factory pour gérer les erreurs
 */
app.factory('ErrorHandler', function($location, Alert){
  return {

    alert: function(error) {
      var msg = this.parse(error).message;
      if(msg)
        return Alert.open("Erreur", msg);
    },

    parse: function(error) {
      console.error(error);

      var e = {
        status : error.status
      };
      if (error.message != undefined) {
        return error;
      }
      if (error.data.meta != undefined) {
        var cerror = error.data.meta;
      } else {
          var cerror = error;
      }

      switch (cerror.status) {
        case 404:
          $location.path("/error/404");
          break;
        case 400:
          e.message = cerror.message;
          break;
        case 409:
          e.message = "Vous tentez de créer une ressource qui existe déjà. Veuillez modifier vos informations.";
          break;
        case 422:
          e.message = this.inputErrors(error);
          break;
        case 401:
          e.message = "Vous n'avez pas l'autorisation d'effectuer cette action.";
          break;
        case 403:
          e.message = "Il est interdit d'effectuer cette action.";
          break;
        default:
          e.message = "Une erreur interne est survenue. Veuillez contacter un administrateur";
          break;
      }

      return e;
    },

    inputErrors : function(error) {
      var m = "";
      for(e in error.data.data) {
        m += error.data.data[e][0] + " ";
      };
      return m;
    }

  }
});
