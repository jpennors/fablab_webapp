<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

// Pour les erreurs à renvoyer en JSON
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        //ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
      // findOrFail par exemple
      if($e instanceof ModelNotFoundException) {
        return response()->error("Resource not found", 404);
      }
      // Erreur de validation de données
      if ($e instanceof ValidationException) {
        return response()->error($e->getMessage(), 422);
      }
      // L'utilisateur n'est pas autorisé
      if ($e instanceof AuthorizationException) {
          return response()->error($e->getMessage(), 403);
      }
      // Autre
      else {
        if($e->getMessage() == "" && $msg=$this->getError($e->getStatusCode()))
          return response()->error($msg, $e->getStatusCode());
        else
          return response()->error("Internal Server Error", 500);
      }
    }

    /**
     * Retourne le texte normalisé associé à un code erreur HTTP
     *
     * @param  int  $status
     * @return string
     */
    private function getError($status) {

      $http_codes = array(
        array(100, 'Continue'),
        array(101, 'Switching Protocols'),
        array(102, 'Processing'),
        array(200, 'OK'),
        array(201, 'Created'),
        array(202, 'Accepted'),
        array(203, 'Non-Authoritative Information'),
        array(204, 'No Content'),
        array(205, 'Reset Content'),
        array(206, 'Partial Content'),
        array(207, 'Multi-Status'),
        array(300, 'Multiple Choices'),
        array(301, 'Moved Permanently'),
        array(302, 'Found'),
        array(303, 'See Other'),
        array(304, 'Not Modified'),
        array(305, 'Use Proxy'),
        array(306, 'Switch Proxy'),
        array(307, 'Temporary Redirect'),
        array(400, 'Bad Request'),
        array(401, 'Unauthorized'),
        array(402, 'Payment Required'),
        array(403, 'Forbidden'),
        array(404, 'Not Found'),
        array(405, 'Method Not Allowed'),
        array(406, 'Not Acceptable'),
        array(407, 'Proxy Authentication Required'),
        array(408, 'Request Timeout'),
        array(409, 'Conflict'),
        array(410, 'Gone'),
        array(411, 'Length Required'),
        array(412, 'Precondition Failed'),
        array(413, 'Request Entity Too Large'),
        array(414, 'Request-URI Too Long'),
        array(415, 'Unsupported Media Type'),
        array(416, 'Requested Range Not Satisfiable'),
        array(417, 'Expectation Failed'),
        array(418, 'I\'m a teapot'),
        array(422, 'Unprocessable Entity'),
        array(423, 'Locked'),
        array(424, 'Failed Dependency'),
        array(425, 'Unordered Collection'),
        array(426, 'Upgrade Required'),
        array(449, 'Retry With'),
        array(450, 'Blocked by Windows Parental Controls'),
        array(500, 'Internal Server Error'),
        array(501, 'Not Implemented'),
        array(502, 'Bad Gateway'),
        array(503, 'Service Unavailable'),
        array(504, 'Gateway Timeout'),
        array(505, 'HTTP Version Not Supported'),
        array(506, 'Variant Also Negotiates'),
        array(507, 'Insufficient Storage'),
        array(509, 'Bandwidth Limit Exceeded'),
        array(510, 'Not Extended')
      );

      foreach($http_codes as $v) {
        if($v[0] == $status) return $v[1];
      }

      return false;
    }
}
