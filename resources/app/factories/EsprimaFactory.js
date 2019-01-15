/**
 *  Factory pour manipuler Esprima
 */
app.factory('Esprima', function($resource){
  return {

    parse : function(js) {
      return esprima.parse(js);
    }

  }
});
