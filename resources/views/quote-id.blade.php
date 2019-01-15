@extends('base-document')

<?php $documentName = 'Devis' ?>

@section('after-total')
  <div class="col-xs-12 ensemble">
    <table class="table signature">
      <tr height="120px">
        <td><b>Bon pour accord :</b></td>
        <td><b>Tampon et date :</b></td>
        <td><b>Nom et fonction du signataire :</b></td>
      </tr>
    </table>
  </div>
@endsection