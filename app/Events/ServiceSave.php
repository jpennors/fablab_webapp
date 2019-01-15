<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 29/11/2017
 * Time: 21:06
 */

namespace App\Events;


use App\Product;
use App\Service;
use Log;
use Payutc;

class ServiceSave extends Event
{
    public function __construct(Service $service)
    {
        $data = [
            "variable_price"      => true,
            "priceVariableValue"  => 1,
        ];
        if ($service->payutc_id) {
            $data = array_merge($data, [
                'obj_id' => $service->payutc_id
            ]);
        }
        $payutc_id = Payutc::setProduct($service->name, $data);
        if ($service->payutc_id != $payutc_id) {
            $service->payutc_id = $payutc_id;
            $service->save();
        }
    }
}