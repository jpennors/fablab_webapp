<!DOCTYPE html>
<html lang="fr">
<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Fablab | {{ $documentName }} n°{{ $purchase->number }}</title>
    <!--<link href="https://fonts.googleapis.com/css?family=Roboto:300,500,700,700i" rel="stylesheet">-->

    <!-- Bootstrap Core CSS -->
    @include("bootstrap")

    <style type="text/css">
        thead:before, thead:after { display: none; }
        tbody:before, tbody:after { display: none; }
        tfoot:before, tfoot:after { display: none; }
        tfoot th { text-align: right; }
        tfoot { font-weight: bold; }
        .top-offset-10 { margin-top: 10px; }
        .category {
            background-color: rgb(89, 89, 89);
            padding: 8px 10px 8px 42px;
            color: white;
            margin-top: 0px;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 30pt;
        }
        footer {
            color: #60605f;
            text-align: justify;
            font-size: 10pt;
        }
        h3 {
            margin: 10px;
            font-weight: 700;
            font-size: 18pt;
            font-style: italic;
        }
        .table { margin-bottom: 10px; }
        html, body {
            font-family: 'Roboto', sans-serif;
            font-weight: lighter;
            color: #000;
            font-size: 14pt;
        }
        .ensemble {
            page-break-inside: avoid !important;
        }
        .header {
            position: relative;
        }
        .doc-title {
            background-color: #ffd912;
            padding: 5px 10px;
            font-size: 16pt;
            vertical-align: middle;
            text-align: right;
            width: 250px;
            font-weight: 500;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .coordonnees strong {
            font-size: 16pt;
            font-weight: 500;
            margin-top: 30px;
        }
        .logo { max-height: 100px; float: left; margin-bottom: 20px; }
        thead tr {
            background: rgb(255, 218, 146);
            text-transform: uppercase;
            font-weight: 700;
            font-size: 14pt;
        }
        td, th {
            padding: 3px 15px !important;
            border: none !important;
        }
        thead th, tfoot td, tfoot th {
            padding: 6px 15px !important;
        }
        thead th {
            border: none !important;
        }
        tr {page-break-inside: avoid;}
        tbody tr { background: #fffcf2; }
        tbody tr:nth-child(even) { background: #fff8e0; }
        tfoot {
            display: table-row-group;
            background: rgb(255, 218, 146);
            text-transform: uppercase;
            font-weight: 700;
            font-size: 14pt;
        }
        tfoot th {
            background: #FFF;
        }
        section {
            margin: 15px 0px;
        }
        .signature {
            border-spacing: 15px;
            border-collapse: initial;
        }
        .signature td {
            background: #ebebeb;
        }
    </style>

</head>
<body>

<div class="container">
    <div class="row">
        <!-- Header -->
        <div class="col-xs-12 header">
            {{-- <img src="/assets/img/logo.png" class="img-responsive logo"> --}}
            <div class="doc-title">#{{ $purchase->number }}</div>
        </div>

        <!-- Coordonnées -->
    </div>

    <div class="row" style="margin-top: 50px">
            <div class="col-xs-4 coordonnees">
                <strong>Contact :</strong><br>
                <p>
                    @isset($purchase->entity->site)
                        <a href="{{ $purchase->entity->site }}">{{ $purchase->entity->site }}</a><br/>
                    @endisset
                    @isset($purchase->entity->mail)
                        <a href="mailto:{{ $purchase->entity->mail }}">{{ $purchase->entity->mail }}</a>
                    @endisset
                </p>
                <p>
                    Créée le {{ $purchase->created_at->format('d/m/Y') }}<br/>
                    Par {{ $user->firstName }} {{ $user->lastName }}<br/>
                    <a href="mailto:{{ $user->email }}">{{ $user->email }}</a>
                </p>
            </div>
            <div class="col-xs-4">
                <address>
                    <strong>{{ $purchase->entity->name }}</strong><br>
                    {!! nl2br($purchase->entity->invoice_address) !!}<br>
                    @isset($purchase->entity->asso_number)
                        Asso n°{{ $purchase->entity->asso_number }}<br>
                    @endisset
                    @isset($purchase->entity->siren)
                        Siren : {{ $purchase->entity->siren }}<br>
                    @endisset
                </address>
            </div>
            <div class="col-xs-4">
                <address>
                    <strong>{{ $purchase->address->name }}</strong><br>
                    {!! nl2br($purchase->address->address) !!}<br>
                    {{ $purchase->address->city }}, {{ $purchase->address->cp }}<br>
                    {{ $purchase->address->country }}
                </address>
            </div>
        </div>
    </div>

    <!-- Détails de la facture -->
    <section>
        <div class="row">
            <div class="col-xs-12">
                <h2 class="category">{{ $documentName }}</h2>
            </div>
        </div>
        <div class="row">

            <!-- Produits -->
            @if ($products = $purchase->getActiveProducts())
                <div class="col-xs-12 ensemble">
                    <h3>Produits</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Quantité</th>
                                <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                        @foreach($products as $p)
                            <tr>
                                <td class="col-xs-6">{{ $p->purchasable->name }}</td>
                                <td class="col-xs-3">{{ $p->purchasedQuantity }}</td>
                                <td class="col-xs-3">{{ number_format($p->finalPrice, 2, '.', ' ') }}€</td>
                            </tr>
                        @endforeach
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="2">Total :</th>
                                <td>{{ number_format($purchase->getTotalProducts(), 2, '.', ' ') }}€</td>
                            </tr>
                        </tfoot>
                    </table>
                </div> <!-- ./Produits -->
            @endif

        <!-- Services -->
            @if ($services = $purchase->getLastActiveVersionServices())
                <div class="col-xs-12 ensemble">
                    <h3>Services</h3>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($services as $s)
                            <tr>
                                <td class="col-xs-6">{{ $s->purchasable->name }}</td>
                                <td class="col-xs-3">{{ $s->purchasedQuantity }}</td>
                                <td class="col-xs-3">{{ number_format($s->finalPrice, 2, '.', ' ') }}€</td>
                            </tr>
                        @endforeach
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colspan="2">Total :</th>
                            <td>{{ number_format($purchase->getTotalServices(), 2, '.', ' ') }}€</td>
                        </tr>
                        </tfoot>
                    </table>
                </div> <!-- ./Services -->
            @endif

        </div>
    </section>

    <section>
        <div class="row">
            <div class="col-xs-12">
                <h2 class="category">Total</h2>
            </div>


        <!-- Total à payer -->
        <div class="col-xs-12 ensemble">
            <table class="table">
                <thead>
                <tr>
                    <th>Catégorie</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="col-xs-8">Produits</td>
                    <td class="col-xs-4">{{ number_format($purchase->getTotalProducts(), 2, '.', ' ') }}€</td>
                </tr>
                <tr>
                    <td class="col-xs-8">Services</td>
                    <td class="col-xs-4">{{ number_format($purchase->getTotalServices(), 2, '.', ' ') }}€</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th class="text-right">Total TTC :</th>
                    {{-- <td>{{$purchase->totalPrice}}</td> --}}
                    <td class="text-left">{{ number_format($purchase->getTotalServices() + $purchase->getTotalProducts(), 2, '.', ' ') }}€</td>
                </tr>
                </tfoot>
            </table>
        </div> <!-- ./Total à payer -->
        @yield('after-total')
        </div>
    </section>

    <footer>
        <div class="row">
            <div class="col-xs-12">
                @isset($purchase->entity->legals)
                    <p>{!! nl2br($purchase->entity->legals) !!}</p>
                @endisset
            </div>
        </div>
    </footer>

</div> <!-- ./container -->

</body>
</html>
