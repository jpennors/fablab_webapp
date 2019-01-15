/**
 *  Variables d'environnement
 */

(function (window) {
  window.__env = window.__env || {};

  // URL de la webapp
  window.__env.webappUrl = window.location.protocol + '//gestion.fablabutc.fr';

  // URL de l'API
  window.__env.apiUrl = window.location.protocol + '//gestion.fablabutc.fr/api/v1';

}(this));
