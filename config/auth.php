<?php

return [

    'services'  => [

        'cas'   => [
            'name'          =>  'CAS-UTC',
            'description'   =>  'Connexion CAS réservée aux étudiants utcéens',
            'active'        =>  env('APP_AUTH', ''),
            'url'           =>  env('CAS_URL', '')
        ],

        'payutc' => [
            'name'          =>  'PayUTC',
            'description'   =>  'Service de paiement Nemopay pour les étudiants utcéens',
            'active'        =>  env('NEMOPAY_ACTIVATE'),
            'url'           =>  env('NEMOPAY_API_URL'),
            'fundation'     =>  env('NEMOPAY_FUN_ID'),
            'app_key'       =>  env('NEMOPAY_APP_KEY'),
            'categories'    =>  [
                'category_obj_id'       =>  env('NEMOPAY_CATEGORY_OBJ_ID'),
                'category_service_id'   =>  env('NEMOPAY_CATEGORY_SERVICE_ID')
            ],
            'price'         =>  [
                'service_price_0001_id' =>  env('NEMOPAY_SERVICE_PRICE_0001_ID'),
                'service_price_0010_id' =>  env('NEMOPAY_SERVICE_PRICE_0010_ID'),
                'service_price_0100_id' =>  env('NEMOPAY_SERVICE_PRICE_0100_ID'),
                'service_price_1000_id' =>  env('NEMOPAY_SERVICE_PRICE_1000_ID')
            ]
        ],

        'portail' => [
            'name'          =>  'Portail UTC',
            'description'   =>  'Portail des associations UTC',
            'url'           =>  env('PORTAIL_URL')
        ],

        'ginger' => [
            'name'          =>  'Ginger',
            'description'   =>  'API pour la gestion des cotisants BDE-UTC',
            'url'           =>  env('GINGER_URL'),
            'app_key'       =>  env('GINGER_APP_KEY')
        ]

    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option controls the default authentication "guard" and password
    | reset options for your application. You may change these defaults
    | as required, but they're a perfect start for most applications.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Next, you may define every authentication guard for your application.
    | Of course, a great default configuration has been defined for you
    | here which uses session storage and the Eloquent user provider.
    |
    | All authentication drivers have a user provider. This defines how the
    | users are actually retrieved out of your database or other storage
    | mechanisms used by this application to persist your user's data.
    |
    | Supported: "session", "token"
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver' => 'token',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | All authentication drivers have a user provider. This defines how the
    | users are actually retrieved out of your database or other storage
    | mechanisms used by this application to persist your user's data.
    |
    | If you have multiple user tables or models you may configure multiple
    | sources which represent each model / table. These sources may then
    | be assigned to any extra authentication guards you have defined.
    |
    | Supported: "database", "eloquent"
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\User::class,
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | Here you may set the options for resetting passwords including the view
    | that is your password reset e-mail. You may also set the name of the
    | table that maintains all of the reset tokens for your application.
    |
    | You may specify multiple password reset configurations if you have more
    | than one user table or model in the application and you want to have
    | separate password reset settings based on the specific user types.
    |
    | The expire time is the number of minutes that the reset token should be
    | considered valid. This security feature keeps tokens short-lived so
    | they have less time to be guessed. You may change this as needed.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'email' => 'auth.emails.password',
            'table' => 'password_resets',
            'expire' => 60,
        ],
    ],

];
