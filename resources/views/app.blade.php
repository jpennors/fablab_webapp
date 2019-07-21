<!DOCTYPE html>
<html lang="fr" ng-app="fablabApp">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Fablab | Site de gestion</title>

    <!-- Vendor -->
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/vendor/metisMenu/metisMenu.min.css" rel="stylesheet">
    <link href="assets/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="assets/vendor/codemirror/codemirror.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="assets/css/main.css" rel="stylesheet">

    <link rel="icon" type="image/png" href="assets/img/logo_ico.png"/>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <div ng-view></div>

    <!-- Assets vendor -->
    <script src="assets/vendor/jquery/jquery.min.js"></script>
    <script src="assets/vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/vendor/metisMenu/metisMenu.min.js"></script>
    <script src="assets/vendor/codemirror/codemirror.min.js"></script>

    <!-- Main JS -->
    <script src="assets/js/main.js"></script>

    <!-- App Vendor -->
    <script src="app/vendor/angular/angular.min.js"></script>
    <script src="app/vendor/tools/tools.min.js"></script>

    <!-- App -->
    <script src="app/env.js"></script>
    <script src="app/app.js"></script>
    <script src="app/factories.js"></script>
    <script src="app/directives.js"></script>
    <script src="app/components.js"></script>

</body>
</html>
