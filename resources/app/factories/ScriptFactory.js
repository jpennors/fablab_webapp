/**
 *  Factory de ServiceScript : permet de parser le script pour effectuer les suggestions de prix de services
 */
app.factory('ScriptFactory', function(){
  return function(script) {

    // Parsing de la fonction et de la liste de paramètres
    var price = eval(script.script);
    var args = eval(script.args);

    var factory = {

      /**
       *  L'objet script initial
       */
      script : script,

      /**
       *  Fonction de calcul du prix suggeré
       */
      price : price,

      /**
       *  Paramètres de la fonction price
       */
      args : args,

      /**
       *  Calcul du prix suggeré
       */
      compute : function(args) {

        // On vérifie qu'on a bien tous les arguments non null
        // pour faire le calcul du prix
        for(i=0; i<args.length; i++) {
          if(typeof args[args[i].name] == 'undefined')
            return null;
        }

        // Calcul du prix
        return this.round(this.price(args));
      },

      /**
       *  Arrondi au centième
       */
      round : function(p) {
        return Math.round(p * 100) / 100;
      }

    };

    return factory;
  };
});
