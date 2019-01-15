<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


/**
*      Application JS
*
*/


Route::get('/', function () {
    return view('app');
});



/**
*      API
*
*/

Route::group(['prefix' => 'api/v1'], function(){



    /**
    *       AUTHENTIFICATION
    *
    */

    Route::get('/login', 'LoginController@login')->name('login');

    Route::get('/cas', 'CasController@get');



    /**
    *       PUBLIC IMAGES
    *
    */

    Route::get('/engines/image/{id}', 'EnginesController@getImage');

    Route::get('/expendables/image/{id}', 'ExpendablesController@getImage');

    Route::get('/products/image/{id}', 'ProductsController@getImage');

    Route::get('/tools/image/{filename}', 'ToolsController@getImage');
    


    /**
    *       ROUTE AVEC SEULEMENT TOKEN
    *
    */

    Route::group(['middleware' => 'UTCAuth'], function () {
        
        Route::get('/logout', 'LoginController@logout');   // Pour se logout
    
        Route::get('/client', 'LoginController@client');   // Pour checker la validité du token
        
        Route::get('/client/permissions', 'LoginController@clientPermissions');   // Pour récuperer ses permissions
    
    });



    /**
    *       ROUTE AVEC TOKEN + PERMISSION
    *
    */

    Route::group(['middleware' => ['UTCAuth', 'FablabAdmin']], function () {



        /**
        *       ADMINISTRATIVES
        *
        */
        
        Route::resource('/administratives', 'AdministrativesController', ['only' => [
            'index', 'update'
        ]]);



        /**
        *       ADDRESSES
        *
        */

        Route::resource('/addresses', 'AddressesController');



        /**
        *       CATEGORIES
        *
        */

        Route::resource('/categories', 'CategoriesController', ['only' => [
            'index'
        ]]);




        /**
        *       ENGINES
        *
        */

        Route::resource('/engines', 'EnginesController');

        Route::post('/engines/{id}/image', 'EnginesController@uploadImage');

        Route::get('export/engines','EnginesController@exportFile');

        Route::post('import/engines','EnginesController@importSave');



        /**
        *       ENTITIES
        *
        */

        Route::resource('/entities', 'EntitiesController');



        /**
        *       EXPENDABLES
        *
        */

        Route::resource('/expendables', 'ExpendablesController');

        Route::get('export/expendables','ExpendablesController@exportFile');

        Route::post('/expendables/{id}/image', 'ExpendablesController@uploadImage');

        Route::post('import/expendables','ExpendablesController@importSave');



        /**
        *       MAIL
        *
        */

        Route::post('/send', 'MailController@send');



        /**
        *       PAYUTC
        *
        */

        Route::post('/payutc/badge/{id}', 'PayutcController@payBadgeuse');

        Route::post('/payutc/card/{id}', 'PayutcController@payCard');
        
        Route::get('/payutc/categories', 'PayutcController@categories');

        Route::get('/payutc/product/{id}', 'PayutcController@product');

        Route::get('/payutc/transaction/info', 'PayutcController@getTransactionInfo');



        /**
        *       PERMISSIONS
        *
        */

        Route::resource('/permissions', 'PermissionsController', ['only' => [
            'index', 'show'
        ]]);



        /**
        *       PRODUCTS
        *
        */
     
        Route::resource('/products', 'ProductsController');

        Route::post('/products/{id}/image', 'ProductsController@uploadImage');

        Route::get('export/products','ProductsController@exportFile');

        Route::post('import/products','ProductsController@importSave');

   

        /**
        *       PURCHASED ELEMENTS
        *
        */

        Route::get('/purchases/elements', 'PurchasedElementsController@index');

        Route::post('/purchases/elements', 'PurchasedElementsController@storeElement');

        Route::post('/purchases/update/elements', 'PurchasedElementsController@updateElement');

        Route::get('/filelist/{id}', 'PurchasedElementsController@getFileList');

        Route::get('/file/purchasedelement/{id}/{fileName}', 'PurchasedElementsController@getFile');

        Route::post('/purchased/{id}/file', 'PurchasedElementsController@saveFile');




        /**
        *       PURCHASES
        *
        */
    
        Route::resource('/purchases', 'PurchasesController', ['only' => [
            'index', 'show', 'store', 'update'
        ]]);

        Route::put('/purchases/{id}/address', 'PurchasesController@address');

        Route::put('/purchases/{id}/address/remove', 'PurchasesController@removeAddress');

        Route::put('/purchases/{id}/entity', 'PurchasesController@entity');

        Route::get('/purchases/{id}/pdf', 'PurchasesController@pdf');

        Route::get('/purchases/{id}/quote', 'PurchasesController@quoteFromId');

        Route::post('/quote', 'PurchasesController@quote');



        /**
        *       ROLES
        *
        */

        Route::resource('/roles', 'RolesController');



        /**
        *       ROOMS
        *
        */

        Route::resource('/rooms', 'RoomsController');



        /**
        *       SERVICES
        *
        */

        Route::resource('/services', 'ServicesController');



        /**
        *       SERVICE SCRIPTS
        *
        */

        Route::resource('/scripts', 'ServiceScriptsController');


        /**
        *       STUDENT BADGE
        *
        */

        Route::resource('/studentbadge', 'StudentBadgeController');



        /**
        *       TASKS
        *
        */

        Route::resource('/tasks', 'TasksController');



        /**
        *       TOOLS
        *
        */

        Route::resource('/tools', 'ToolsController');

        Route::post('/tools/{id}/image', 'ToolsController@uploadImage');

        Route::get('export/tools','ToolsController@exportFile');

        Route::post('import/tools','ToolsController@importSave');



        /**
        *       USERS
        *
        */

        Route::resource('/users', 'UsersController', ['only' => [
            'store', 'update', 'index', 'show',
        ]]);

        Route::get('/users/ginger/search', 'UsersController@gingerSearch');

        Route::get('/users/ginger/{login}', 'UsersController@gingerLogin');
    
        Route::get('/users/sync', 'UsersController@getSync');
    
        Route::post('/users/sync', 'UsersController@processSync');



        /**
        *       WARDROBES
        *
        */

        Route::resource('/wardrobes', 'WardrobesController');
        

    });
    

    /**
    *       FABLAB CLIENT
    *
    */

    Route::group(['middleware' => 'FablabClient'], function () {
        
        /**
        *       STUDENT BADGE
        *
        */

        Route::resource('/studentbadge/badgeuse', 'StudentBadgeController', ['only' => [
            'store'
        ]]);;
    
    });

});
