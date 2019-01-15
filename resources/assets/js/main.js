$(document).ready(function() {

  // Initialisation de tooltip
  $(function () {
    $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
  });

  //Popover index.html
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
});
