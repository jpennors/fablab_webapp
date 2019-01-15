<?php

return array(


    'pdf' => array(
        'enabled' => true,
        'binary' => env('WKHTMLTOPDF_BIN', '"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf"'),
        'timeout' => false,
        'options' => array(),
        'env'     => array(),
    ),
    'image' => array(
        'enabled' => true,
        'binary'  => env('WKHTMLTOIMG_BIN', '/usr/local/bin/wkhtmltoimage'),
        'timeout' => false,
        'options' => array(),
        'env'     => array(),
    ),


);
