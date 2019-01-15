<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 29/11/2017
 * Time: 21:06
 */

namespace App\Events;


use App\Product;
use Log;
use Payutc;

class ProductSave extends Event
{
    /*public mas($product)
    {
        $data = [
            'stock' => $product->remainingQuantity,
            'prix'  => $product->price * 100,
        ];
        //if ($product->payutc_id) {
        //    $data = array_merge($data, [
        //    'obj_id' => $product->payutc_id
        //  ]);
        //}
        $payutc_id = $product->payutc_id;
        if(!$payutc_id)
            $payutc_id = Payutc::setProduct($product->name, $data);
        //if ($product->payutc_id != $payutc_id) {
            //$product->payutc_id = $payutc_id;
            //$product->save();
        //}
        $product->payutc_id = $payutc_id;
        $product->save();
    }*/
}