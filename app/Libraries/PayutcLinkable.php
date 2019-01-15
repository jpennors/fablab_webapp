<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 13/12/2017
 * Time: 17:40
 */

namespace App\Libraries;


use App\Exceptions\PayutcException;
use Illuminate\Database\Eloquent\Model;
use Log;

/**
 * Class PayutcLinkable
 * @package App\Libraries
 * @property mixed payutc_id
 */
abstract class PayutcLinkable extends Model
{
    /**
     * Data from payutc
     * @var \stdClass
     */
    protected $payutcData = null;

    /**
     * Should return the data corresponding this object
     * @return \stdClass
     * @throws PayutcException
     */
    abstract public function payutcRequest($payutcId);

    /**
     * @inheritdoc
     */
    public function getFillable()
    {
        $fillable = parent::getFillable();
        array_push($fillable, "payutc_id");
        return $fillable;
    }

    protected function getAttributeFromArray($key)
    {
        if (isset($this->attributes[$key])) {
            return $this->attributes[$key];
        }

        $payutcId = $this->getAttribute('payutc_id');
        if ($payutcId != null) {
            try {
                if (!$this->payutcData) {
                    $this->payutcData = $this->payutcRequest($payutcId);
                }

                if (isset($this->payutcData->$key)) {
                    return $this->payutcData->$key;
                }
            } catch (PayutcException $e) {
                Log::alert("Unable to get payutc infos : ".$e->getMessage());
            }
        }
    }
}