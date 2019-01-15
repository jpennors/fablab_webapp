<?php

namespace App\Exceptions;
use Exception;

class PayutcException extends Exception
{

  protected $status;

  public function __construct($message, $status = 500)
  {
    parent::__construct($message);
    $this->status = $status;
  }

  public function getStatus()
  {
    // Vérifie que le status est bien un status HTTP
    if($this->status >= 100)
      return $this->status;
    else
      return 500;
  }

}
