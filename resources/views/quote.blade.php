<!DOCTYPE html>
<html lang="fr">
<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Fablab | Devis</title>

    <!-- Bootstrap Core CSS -->
    @include("bootstrap")

    <style type="text/css">
    thead:before, thead:after { display: none; }
    tbody:before, tbody:after { display: none; }
    tfoot:before, tfoot:after { display: none; }
    tfoot th { text-align: right; }
    tfoot { font-weight: bold; }
    .top-offset-10 { margin-top: 10px; }
    .category { background-color: #ffc200; padding: 13px 20px 5px 20px; margin-top: 0px;}
    footer { color: #60605f; text-align: justify;}
    h3 { margin: 10px; }
    .table { margin-bottom: 10px; }
    html, body {
      font-family: "Helvetica";
    }
    .ensemble { page-break-inside: avoid !important;}
    tr {page-break-inside: avoid;}
    tfoot {display: table-row-group}
    </style>

</head>
<body>

<div class="container">

  <!-- Header -->
  <div class="row">
    <div class="col-xs-6">
      <h1>{{ $user->entity->name }}</h1>
      <p class="lead">
        Devis créé le {{ Carbon\Carbon::now()->format('d/m/Y') }}<br>
        Par {{ $user->firstName }} {{ $user->lastName }} (<i style="font-size: 0.8em"><a href="mailto:{{ $user->email }}">{{ $user->email }}</a></i>)
      </p>
    </div>
    <div class="col-xs-6">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABoCAYAAABLw827AAAgAElEQVR4nO2df5QcVbXvP7vXrFlz5+XlTWdlZeXm5mLMzWWGiLmKASLqBHmKCMjjlzCNgAEUmIaIgMBFHo+FPMGIEBHpYSG/5CLVAnKRXwIXkWm5EjEiPwKmMcY8FpeVy8vLjLl5WbOy8nq/P07VdE3/rKqu6u7g+WRN5nT1qarTNV279tnne/YBi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrG0gnS6AVHJZDIAvcBsYJaq9ogIwG5gJ7DDcZw9nWuhxWKJm643WK5hmqeqBwEfAj4A7Csi+6jqANAjIqgqAL7ybhHZDrwFvKmqrwMviciLwKTjOB34NBaLpRW60mCNjIz0isihwOeAT6nqvkCqjmEKWy6JyKvA08Djqvp8Pp8vtfHjWSyWiHSNwXI9qRXAWcDxwBxVxe3m4ZVjMFiV5a1AHrgLeNV6XhZL99Jxg5XJZHqBE1X1YhE5AMrGqbLsvYZqAwQ8pqpzROSQFozXc6p6g4g84TiO9bosli6jYwZrZGSkR0ROBa4CFtUzUs0Mloi8AVwMPAmkVHUEWAMsjOp5icgGVb1SRB62HpfF0j203WCNjIwgIocDa4GlQQxVZRlARCaBq4Gc4zi7/efIZDL9wOXARara79aPYrzWichqx3HWJ3IxLBZLKNpqsEZGRuYDN4nISVEMlWtESiJyO3Cl4zjvNjpfJpNZBFyvqie24G3tAW4DLnccZ0d8V8NisYSlLQbLDagfq6o/EJG5UY+jqs8BF+bz+ZdDnv9QYK2qfgiieVvAFuA0x3Gej9p+i8XSGokbLDeovlZVs/5YVEi2AJcAD0aNKbkxsy+p6jUiMjdiYH4PcLWIXNuGoHwP8NUEj78LyDV4fx5weo3t3wemIpxvAPhShP1K7vk8Td1GtxyWHuBEYBIT7+w2hjA6wy3AuhiOdwzQ3+IxvGu/DdgENOzRtINEDVYmk5kPPAB8HMJ1/Vx2A9cANzqOsyuONo2MjMwRkatUNUt90Wkzb+th4IsJdxH7gf8AUgkdfyvw1w3evxQzeFFJBiMDCcti4I8R9qukBLwMOJiuetC/wWzgz8AG4IMxtCNuxoFhzN/l/UR7KPj5E7CoxWNUsgVj7O8AOhLXTcxgZTKZIeBnqrooSqzKKwMPichljuNsirl9S1V1rYgcHtHbeklEjnIcZ2uc7fLRSYOVAl7HPPUrKQArI5wvLoPl513gHMwDpBndbLBWAC/4Xp8B3N3iMf8E7IO5Pq30BmYBfwMsxTgeA+72J4DVwOYWjh2aRAxWJpNZDvwMmAvRDFVFeQrTFbkmTq8mk8mgqseIyA2quiSCt7UJ+IzjOEn80TppsA4B/rXBvh8A3gh5viQMFpib8Tzg1ib1utlg/QQjli5gvKyXgQ+3eMw/AQuB/4TpqcRBL3A0cAVwAKZrfhym3W0hdoOVyWQOAH6uqgMtGqmqMuaJ+k2gD/gHYLGqzheRfqCkqrtEZKuqbhaRVzAX8qVmk6DdONtXgStUdTaEDsZ/0nGcLZEuWH1qGax3MTdcHGwHPl/nvTuAM32vN2MMjsf3MU/XMNQyWG8DbzbYpwdzkwwA8yk/3SvZA3waeK7BsbrVYC0Bihij8n7gX4D9gf8KPNvCcZMwWB4p4OsYWdFO4GBMbDFxYjVYIyMjS0VknPg8q5plCNV92yoi9wNjjuM0vKiZTGa+ql4HnC4iqRDn2gx8Ip/PvxPtytWklsF6kPpGJi5mAf+GucHBeDBnYaYueUwCf4v5sgallsH6HnBBwP1TwALgWOBKzKCAnw0Yr6Tew6lbDdYYcC4mHncO5kFxB/AYZi5tVJI0WB5enPM54JMJnWMGsRksN8D+AgFV6y3osEzDw5dLwH3AZY7jNDQsIyMjy0XkJlU9JMTx12M8rTA3cSM6ZbBWMdM4vQp8FPh3jDHzOAu4M8RxWzVYfvbBdFkXVmw/AXiozj7daLDmYQxLH7AfxtvsA/4X5qHvbYtCOwxWCvgtZnTzI8BLCZ1nxglbJpPJ9AGPquoimO4qkVQ5IilVPVVVX89kMsc3qpjP59er6idE5AuYbksQlqvqjzKZTFIxp3ZxVsXrZzASiCcqto+2pzk1eYvaXdKkjXncrMY8mB6mbJimgFsw92YUY95OSsAP3PLR7ThhyzeXKwq9SVWXBzAqk6p6CXAPrY1ctMIA8EAmkzm/UaV8Pl9yHOc+EdlPVa91A//NOAbjJu+t7IsrQfHxuPv7nyq2L3d/OsVjVOuCDuhEQyIyC9MVBLi+4r1bMYbrdGBOOxsVgRfd323xWuPwBk4BzvZv8LpJvnIJuE1VB/P5/Hccx/ki8DHcD1ujfsNyDKRU9aZmnhaA4zg78/n8FRj3vF53YxpVvSaTyQzH0cgOcEbF6+2Ap+x/GiMg9NNJL2sPprvqJ/Isig6wCtPeAtVC0Xcx4YtZRBPbthNPxNsWw9qSwRoZGVkI3FIrKO4hIgXgI47jnJPP56efiI7jrMPERr4IxBmsDkpKVX8wMjIS6EI7jrNFRE7AjN5U3ih+eoC7MpnMrAZ1upEeqpXtD1GOf+wG7q94f4T6I3ftoDI2s7fM9ewBLnTLld6Vx1r393mYkdJuxRucSSpONoOWDJaI3FxLvuC+fgs4GVjpOE7NuX+O45Qcx7nH7XZ9G5PWuJGEIG7mANmglR3HwXGcZ0XkIyIySrXH4bEYo9DfmzgcMwrn50cVryu7hf3AqYm1qDn7VLwOqw3rFMdjviMbqI4NemzAeLX7uPW7Fa8bHquwux6tdgkvE5HpC+4alV2YHFf7OY5zf5C5f47j7BCRy+iApyUioQO1juPscRznVmBQRL6PbyjdHY3Mq+raugfoTiqD7VuoFgSuo1pvM0py4tZGDGHU137+uQPtiMIl7u8baBzLvcH9fWGDOp3GCyM83rBWTLT0RXMc501VPQo4CvNFzmMM1TfCzv1T1Vm4c5/qeVkJMZTJZHqi7Og4znbHcVZjRKzPYOZXrQQy+Xz+rRjbmDTzqB7lqTcw8sOK196UjXbSi9Ev+b+/72DiPt3OYZjBirdp3t5nMJ7WQZjZB93GmZi//UsYbzBxIhks3Zg+XovpDwHk83kcx3kCM10j4zhO1Bu1B5oLQxMgRYuGO5/Pv6GqnxaRgx3Hed7zKksFPl4a59AY2pg0pzAzTlKiuvvncS/VhqydwfdDMBOFD/Vt86bnxDJBPmE87+ommsd9Sm496D4v60zMQ2MSOI02jfqHDgxpMd2P8icVnQvcLsqVMjTZctoJV7/0v2ky2tCCcLRe+S3Hcd7Xavv9lMbZB1iDMCImQP9hGQ79B60lHH0Oo/JuhTeoTs/yCrDM9/p54BMNjvEUJublMQW8j8bpR2oJR9fR/MnsrT05HxMvWVTxfglzM3+vyXG6QTi6DPgdZnDgfQQbJPCEpHOAv8d01YOQlHD0IEzI50i3Lcdh5j62hShdobMpT4s4G5GTShsHPpsammwph4/jOKVMJvMMcFIrx4lArK6sFjgWE6w2uYiUZQjHECyjQDMOBX7Z4jGOY2ZbljPTWMFMpXst7mKmwerDDNN/O2RbVrg/UdmM8ay6Mb9VLS7BPIDCpMWZwuiy/gdGaHpxyHOuoP50pWakMNKKBZiwx6cwIYBdwHcwA0ttHZkNZbC0mE4prDZumQAKyoAgi4kn6dhaVT0pwCTouNhD2eWOi6VAvwIouE2+gHgMVhJUBtt3YaYANeIRTFfAL2k4B/MlbqcgeD17j5RhIeZhvJvw37lbMILkMzETjoN+5h5M9zlOfgV8mQ6NyIb1sI4EXYwIqBqbFaMNcRxnXSaTuY0KIWpSiMh3HceJK/vBTHwhN1UO1QL7y3BsmRbioh+jpfLzMM1viF0YTZb/77QY43W109s5yf15AmMwg06j6gQXYrq3dxJ+NNwTkp6J8WSbdX89SsC1RH+IpDDfkXmYrBLLMDHE1zADAmtoLaNEaMIarLNAzM0oMLMcD6p6gYgsAQ7zYk0+bVecPIZZWSd+XGNV0eSzaD1wWqL1eIT/y3ss1cLPZt1Bf73KB8so4QzWZpo/qXswXc65mPhVLUHukcBvMClmuu2hAOX00CXKUoWwrMUYq9WY9D5BjFAJ022LK4bVhwlLfBnz3Tkc8+A6i3CZOyITeHRMi+k5Ckck2RiAfD4/BRylqlHS8AblThE5oVmerMi4hqpiYPMkLUSKGfp5CPirFn8e8R2vcirO2wR/YtbSZB1JdQaFRngpVBr9fBaTuuSDwH9xf19L9Q0yH1/SyC7jbEzQ/wmid6U2YLyaJZg5q51gCvNAOgGTA2sDxsP9ObUfJLET+AZS5VgR+rzXkmA6eMdxpjJmVvVTIrJGVefF5GG9gwla5tu5QKrbg16AySbZVhe6AYswmiA/W4F/DHGMytHGHszT96rozWpICXOTXIHx8J5iZmLBhcB1bhu6hT7KWRdq5cgPw1qMV3MhnY+JrsfMB34co8VaSxuue2CDJXCUun0dQfCXk8A1KHdnMpmHRCSrqqMiUjkVIxAisllVbwFuzefzyWp1fF1k8XlaYnrPR9E9BusMqj3sODIwfAnTDUnGey2zCTPi+RtmashOxxi0jq/w4nIKZpRtHeWJ5FF5GuOhDWMkHonnn2rCDoy39TomvnY90fN3BSJQl7BUTPdihjRnGKgkvSwPx3F2OI7zLRF5P/AJEfkW5g8/2WC37UBBVa/FTLD++3w+f2PixgpmxPP8PULXjiXepQ5IitpLeMXBAtrXZXmV6gnZvZiuaTeQoixDWIH5GrTy8/8oT0fqFiHpu5hRzxTwhaRPFszDUv0QIrMBFJ02VP5y0rjrAD7v/jAyMpISkTmY2EU/UBKRXaq6FZjM5/OdybdVGXDXGeUhLTBPhjv+9D+M+JeA8jNKgFQ8MfE41ROwP0zrq87EwZEYA7OVeAcDVmBiRx2Zf1uDhzBedeLThwIZLEFWGBfB1V65W6fLiU71q41rkLZRP2NCZ/C6ge5/blfQK6cwX7ZH6u3eJiqD7SWMLCCKB5rCxC/8we7DMMHhdszgrzUVrFsC75f4ft8b43GvB76GEc1eEeNxo/ImZiRyUdInCmSwFA4WmKm9SkCH9Z6isj9Y5kA6a7DmYIak/RSA21s45oHAV3yvUxgDeEnt6rFSK1dUW3IzNWEFJtb0NtXd1la5GbPK09mYVaQ6PYdyj9uGvmYVWyWYrEEYMi6CeVGlw7LMpIYOy9ctrEyJ0m5GqF7CvN5E56DU0m6tog1fYKpTzEB3CEjDTHIOy1uY2Qhz6Ww+Mo8ezHcqcS1WU4OlxXQKGKpUQVqqKRVYospna+mwtNx7rrWacjup7A5O0XwqTjNepnrEai5wYovHDUKmxrbftuG8jdgX48XuoDXPtRFevrUL6Ew+Mj9DGE830RFCCPJBlbmo9oMZFfTMlkQMt5c2ptFiur9UTA9oMd2qkDIxdJw+LbC4VGCJFqo8kpl1CwyUCtyA8rrUyA1VYesXadvWya1iGdWyhUeIZz7eHTW2JZ125lSqr/dOjMCyk1yIubdup/Fodiu8iJnXt5SZE9E7gffQ+JekTxTEMs/37jh1/1WWg6DF9ILSxoEbRPijqv4HqhPAn0sbB17QYvrrWkxXpudtO1pgjo5zUWmcFxD+rMofgT+g/Lk0zrgWON5vbLRAjxY4V6EocBHQqzW6gaozjFY/5TzY7abSu4LWu4MeeYy35ucQqjNBxMWplJeY8nM3bZomUod5mO5wEhPrK+mGjKT7AOdjHnqJJ1Bs7uEI801WBgGJpsPSjeljVfWHILO9PV36QVaoskKEq7SYvh24SgYn2jrypwX6MKMul2nlFAMTr+tBGVZlWIQHtcBpqgwDN6iyP1D+SD7hqNbeDMo82p9loJfqeMc24kuvsx2jvq6cTH0OZjSrXpuCLGLRizH0CzH5mL5A7SW9ttP5XPqrMbG7+6g9ghknj2DmY3ppX9qdQWEe8CjmAXwe1TMfYieIh9U/8yb0Lb0VwMPSYvoIhAeY4VXUHELrVdWsqr6mxXTbBJZaYKkatfQ1KLNEyuqNOuUTVfmDCE+h7N+wPrXLSHvmXVVwDNXD/fcTb0C4VrfwVOrPMzsXmAjw8++YhHS/xHgVtYxVCeNBdlLj5l9rMOok5zDswYwYpmi/l3UE5r5ZhsnXlWvHSYMYrL6ymMjvUdWRdPvQYnq2qt7FtCdXb6x/xgHmA49rMX2pFtMBmhed0jiHo/wa2N/7eJ6kuFEZYWGg+lqn3J7Rs0qS7A56PEt1RszZmOkpSbILk6a30/q2VZiHwnO0b9rMnZg42Skkrz/zuru/xEw0n48Rr7YtRXbTLqEqveV+TUgdlnIu5kN5OxGwnFJlDfCfS8X0lanBiaCfJzClAkej/AShN3izIpSpLou0nLUhLAupDsy+SXnV3rgoYSQOV1dsP4dkAuF7MEbqcoKPUC3A5CJPAm9KUr21BpNgB8ZoXYTx7v6n770UxgNrJR9WH8ZQ7YsRhqYwXvl9mL9z4iODfpreOCLs9sLsdXVYNYyWFtOoclpdryxAWYT/rsr/Ab7brJ1h0AIrVHlAfMbKL+KPtUx1mfYLG0+l+m/9I5LJDnoPJluD33s/ABN7apXdmLjQq8AvMMYqbJxoDuVuWxK8QftTNt+MEe6OYtJUe9+vFPEkw5zCeM55yte9I13v5h4WTJWHuUKMCqrOBWlJJOme9notpjfI4EQsT+hSgXmY9ev6/LONEin7RgdnlKtH02oxBQxWbIs6+nU31VqrpOagbQH+jurv1iRmEYWwlDCe1E73GFGN7M6I5w9KCtO2VtoYlS2Ya+5X/X+SaGs2+NlN69c9Vpp7WLC93NMJM0IoQ0Aqun81Xe5R1R/qxvQHZWiipVEIHQdV7jIjnyA+7zCJ8vTnkLJw1DVaQT5Hifjm4m2N6ThB2VJneyfnfcZ5PbuRSk9zSycakTTNle6wLYoOS8SsrFNvVDFcWRYgrccFFE5CyqlH/JqpJMo1vSvjeSU+/GuxvBdparAE3pru6xDcy1L1vLcYfCxAVVd5i7dGwdVarQk0UBlTuc7mbamVHZ+sarHslTQ3WIMTO4FtYXVYAjvitQKSonr0KTAKq0RY1ERjFUe51EiHxXvUVbdY2kHQSZNvRNBhvV39Zsvlo7U4sG+zxlaiBVICF1TppOIt7wKuQvlWIx2WSGfWc7NY3gsEMliCmGyJ05HjinKtnqGwCZEp/4YYyilUzgjSZj9qchMNla0LxFkWoxjfT4b5BsL/na7ja4CPV8K232KxGIJ6WC94d2ZNHVYNZHBiSpSX4opheWWFE0Mr4JXP19VJtVKGlxFWyjAny7BvlGZmncpy3GJNi+UvhkAGS9F1td2oJgg/C79T09YsYebSTkE43D8hOabyeoUDU8NUJ4vxjQhOt9qUp+j8SicWy15L0C7hJoQtEfJh3R+vf2Vwu3iB0AKzkXLSPPEZkZbK4KSGgy1l5cs2uk6G7QihxRKVYAZrcAKUp8Pmw5LBiTeVcgapeDRZIPCBIO12d9wX3+eMSWM1hZmCUut85XZW6LCUJDxOiyU4o6Oj/dlstlsW6QhNcOm+8BPg7LD5sES4AZOMnxh9rODJ/oQF5ZgbxFS+U4brqLYrBk9l5nudXq3X8hdINptNAceq6skicjQmc0fcC2O0hTBzjZ4T2Kbo3HDrEspjwDrQFXFYCjGuSuB8Uqr0+3VS3uFaKO8Ssxx6nRPitrNq35dF2zuz3WJx6QUeoPO531sm8AeQwYndIL4UqE11WN5+JUyi/D1xaLJcPVPgbAfT2SZi0lspXCMrG6zKIr76Ph0W8ENZGbTVFkv8yHtgIZmwFtdklAyiw/IhgxMvisj3fFuIXgZCpLZQ5Z3YtFewXoQbg514RnmKeBfStFhCo6qof+h6LySUwZLBiVeB54LosGpwObDedzQil5XXgp5UhA3edBn3dVTt1aTAF2Q4gHdXrcO6r27My2JpE+8FDyt0vhxBrgcODb3f4MRuLQ78lOplpkKiIPJs4PMOs7M0zq9E+DjqRsNcIxSivBs4WYYDxqC8fU38qiQyvYacxdIxPO+qVS/LDeIvUtV9RGQWZtT8bVXdNDY2FkjqE5UoCb6eBNYL4jc8AXOUS41S2LI8K4MTW4Kdz91DuAN3/boIOa12q5JJrQy8usxfVbx+SIbZEKa9lr8cstnsYcAa36aDc7lc02R5o6OjB4nILb5Nn8nlctt9718tIkcCqGpKRFIw7WVdl81mL2Emj+ZyuW80aesyVV2NSQU9T0RQ1WnPTUQms9nsk8A3c7lcIt/58B7W4ESptHHgSlxNkTtKeEtp48Dfich1bnaHpvhHGEOUS6BXhm0zcB/KxcD+7mpl5pjNysIk8PnUyub5yLXAXOCbwJneNhH2qEkXbLHUYw5ur8O9+b3Mpc2YrarLPWOhqpX38iJgud+g+Fisqot9+yIidQ1MNpvtw+Spz4pIqs4xUdUBERkBfg/JPKQjDXMK8qSoPOkzJn0i8nWUYmnjwKnu8vZNjxK2rMrVqaHJX4Vu7zC7EU5G2B5iQPJ5gY+khhsbKy3QqwW+CvxBlbPLecBAldtTwzY7g2XvZXR0dDbwc1U9n5n24l3gSRHJq+qTtCmrbaSczzI0gRbTFyj6iiB9MO0BLUD4J1U9T4vpC2Rwos5E39A6rN2CXKHod6K0F0CGeUMLrFTBwV1P0DuNzDzlJjGLcd4rw/WfdFoAlCMUbhBYWuM42wSieIMWS1O87liD968CbnY9oV7M0lyewblcRJ7xPCW3TtWgUDabTanqA5gVvD02isglwBP+rms2m02JyMeBK5IciYycpF4GJ97UYvo64OrpKLN5ByMS5QXdmL4H4XIZnKhhfQMbrXcQWSmDEy3n45ZhNmiBDyucKHCcwpAIfQrvCryk8KjAs40MFYAWWAKsBY6ebqVvwNRN2HehHRm0hCHsKJ6/fuW+uVxuC26ySLdL56+zOZfLrac5XxGRw337Pg2ckMvlqsI+rvEqZLPZgojMD/VBQtDSqhqq+i1BPofq8mk9Vtm6phRWoXp8qZj+JkqFDkuDlrelYjBW02c2E5bz7k8otMBsVa4EvqJKr9Rv+sNY3ZUlIJ6nUy821Gg/aO5t1arfjGw2OwBc6WvbRhGpaaz85HI5SLB72JJUPzU0uRvhNBHZOa3J8vRZ08hsgTWgryn6Md92wpU7hxZIlcZZpVAU+Fqlsaoov41yjgx3qrWWvZVWPKwE6p+CGRDw9h1tZqzaQctzi2RwYiPw5QA1l6ByRKvnazelAocAv8asaDzfs6HelJ2K8h4gIys7s8ikZe8mTOwnimo9jA5LVU/w1XtJVZ8LdbKEiGUypAxO5EG/DUbm0MrEm27xr7TAQi3wIzHByuVA0zxZIqyWYZ5vYzMt7wFaUaBH8bKa7TM6OtojIit8x//p2NhY1CbGSqsrw5ZRuRxYrOiJMK3Piqq3qiq3i9I4fcDXUC5TmEVw3daNKLe2tbEWSzIsAvq9F6raNVlyYzNYqaGJkhbTpwEDIJ8qv7N3+FhaAFVOxAjkFk0H0YMMZsI9qlySstkYLO8BKkf5ROSdTrWlkljz48jgxJQg/w3UnesXLYVMdTlZtMAyVX4h8EDYtQuBewXOSq0MpE62WGIh4YnM/RWvp2rW6gCxJ/SSwYldIvI54DGzpXuNlhaYWxpnTOG3CId6A51eED1A+TaEMyRgbneLpRFhJQ2NdFgtHn+3v76qBk6YmTSJZCCUwYldKMeJyO2+rUQvx4sW6NEC5ysURTgXpSdkbqySmDmC5wRdiMJiqUOpYvQuUCIBEenzjxQG1WEFHFl8119fRBYF2akdJJYyVYYm9gBfFhE32yhENFoLtJhuMSWNQcdBxzkceEWVmwXmhM6NBTtFyMgw37BaK0sMTK+i5Ho0c+pXncHCpHRYqroZ2O2r/9FQJ0qQRHM8y+AEMjjxPWCliG+h0XDMVdVfazF9V2ljOrLkXwssUfipCk8BS6GulqpuGTMD/WAZ3jsT+Fu6kmnNnuv9DNWvWkZVPxFVh9WMsbGxKeBFX/3js9lsfIqCFmhLUnoZnPgV8A+g09NVwvlakkJZJUJRi+lLtZjuDXruUoHZpXHWAK8Bx0Rci7CEkS0cKDb7giVeNomIf8DmM812yGaz8zA5qQJ5TW7XruSrHyQm9WNf/X2ALwXYJ3HatoqGDE5MishpqhwlwuaI6xLOVtU1qrymxfTRjZas1wIpLbAK+D3CpbixgbBrESK8BHwstZKLZWX3jJZY3hvkcrkdzMwdtarRuoHZbBZgrZvpMxAiMiUi/gV8g6zreQ8zvb/rs9nsAUHO5022ToK2LvsjgxOkhiaeAD4gIpcBk+47/loByrov8KgqT2kxvbTyPKVxVqjyAnAX6q5LOL1r4PI7IpyD6QKua/bZLJaoqOqPfS/nAD/OZrOzK+tls9leVb0ZM89vMujx3QnJG32bRkZHRwcqjp2q2GeHm0bGYxbw82w2e1JlXd8x5oyOjq4Fzg3atrB0pF8qgxNTwLe1mL4d0QtQzgeZE0SlKdN5XBQROVyV32kxPSqDE3cClApcKmbdwFRljqogZYR3xIhHb7PLylvaxK3AhYDnWR2mqr8fHR29B3hFRPZg4q6nAUswuqirgJtCnONx4CC3vAD4TTab/YGqbgUGMTmzZqRNVtV7gINFJOtuGgB+rKqvZrPZR1T19yIyBcwHPqaqx7ie38WhPn0IOhpIk8GJ7cBVpeLA9Qqni8ioqu7fyGiVVxebLvcq6ndx91PXc6zMUdWoLLAO4RaBB2XYdv0s7WNsbGx7Npv9ooj8M8ZwICILgH+srOvGu84C3g2jw1LVnIicB8xz6y8B1vj2u7tGuxgdHV0NTInIRb5zLQOWVZ6zHavydMVKsKnByZ2pwYkc8EHgQOC7iGwp16i8EL2xTVoAAAFLSURBVPXFpeJtCqarekOVa0XZD/ioDHOvNVaWTpDL5Z4APq2qb8JMzZSvvEVVj8rlcvfVqtOIsbGxbcBRuEn9auxbc6bG2NhYSVUvdtu2vkHbUNXdmDxwD0a4BIHoZEKEhmgxnVLVpSCfEmGlqh4kIgvU14Url/VGGZy8GEAL3KVmRBGU6Wygbv3NIryoyi8QnhXYZLVUlm7ClQ8cChyiqu8DUiKyVVX/VUSezuVyu916/cB8n+J9S5DVdtyA+NHAgao6G9ghIq+o6iNjY2MN812Njo4C7C8ih2K6kbMxGsutwO+AZ/0r9yRB1xqsSkrFNKDzBRnC9OP/VlUXiMgA6FMyOHk7QGmcrwIfFWFSlX8T4S1V3hTYKCtJ9GJaLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFY/pL4/y2+TlF0nEyZAAAAAElFTkSuQmCC
      " class="img-responsive" style="float: right">
    </div>
  </div>

  <!-- Coordonnées -->
  <div class="row top-offset-10">
    <div class="col-xs-6 col-xs-6">
      <address>
        <strong>{{ $user->entity->name }}</strong><br>
        {!! nl2br($user->entity->invoice_address) !!}<br>
        @isset($user->entity->asso_number)
          Asso n°{{ $user->entity->asso_number }}<br>
        @endisset
        @isset($user->entity->siren)
          Siren : {{ $user->entity->siren }}<br>
        @endisset
      </address>
    </div>
    <div class="col-xs-6 col-xs-6">
      <!-- Normalement, adresse du client ici -->
    </div>
  </div>

  <!-- Détails du devis -->
  <section>
    <div class="row">
      <div class="col-xs-12">
        <h2 class="category">
          Devis
        </h2>
      </div>
    </div>
    <div class="row">

      <!-- Produits -->
      @if ($elements['products'])
      <div class="col-xs-12 ensemble">
        <h3>Produits</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Commentaire</th>
              <th>Quantité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            @foreach($elements['products'] as $p)
              <tr>
                <td class="col-xs-3">{{ $p['purchasable']['name'] }}</td>
                <td class="col-xs-5">{{ $p['comment'] }}</td>
                <td class="col-xs-2">{{ $p['purchasedQuantity'] }}</td>
                <td class="col-xs-2">{{ number_format($p['finalPrice'], 2, '.', ' ') }}€</td>
              </tr>
            @endforeach
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3">Total:</th>
              <td>{{ number_format($elements['totalProducts'], 2, '.', ' ') }}€</td>
            </tr>
          </tfoot>
        </table>
      </div> <!-- ./Produits -->
      @endif

      <!-- Services -->
      @if ($elements['services'])
      <div class="col-xs-12 ensemble">
        <h3>Services</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Commentaire</th>
              <th>Quantité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            @foreach($elements['services'] as $s)
              <tr>
                <td class="col-xs-3">{{ $s['purchasable']['name'] }}</td>
                <td class="col-xs-5">{{ $s['comment'] }}</td>
                <td class="col-xs-2">{{ $s['purchasedQuantity'] }}</td>
                <td class="col-xs-2">{{ number_format($s['finalPrice'], 2, '.', ' ') }}€</td>
              </tr>
            @endforeach
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3">Total:</th>
              <td>{{ number_format($elements['totalServices'], 2, '.', ' ') }}€</td>
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
              <td class="col-xs-4">{{ number_format($elements['totalProducts'], 2, '.', ' ') }}€</td>
            </tr>
            <tr>
              <td class="col-xs-8">Services</td>
              <td class="col-xs-4">{{ number_format($elements['totalServices'], 2, '.', ' ') }}€</td>
            </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><h4 class="text-right">Total TTC:</h4></td>
            <td><h4 class="text-left">{{ number_format($elements['total'], 2, '.', ' ') }}€</h4></td>
          </tr>
        </tfoot>
      </table>
    </div> <!-- ./Total à payer -->
    <div class="col-xs-12 ensemble">
      <table class="table">
        <tr height="120px">
          <td><b>Bon pour accord :</b></td>
          <td><b>Tampon et date :</b></td>
          <td><b>Nom et fonction du signataire :</b></td>
        </tr>
      </table>
    </div>
  </section>

  <footer>
    <div class="row">
      <div class="col-xs-12">
        @isset($user->entity->legals)
          <p>{!! nl2br($user->entity->legals) !!}</p>
        @endisset
        <p>
          @isset($user->entity->site)
            <a href="{{ $user->entity->site }}">{{ $user->entity->site }}</a>
          @endisset
          @isset($user->entity->mail)
            - <a href="mailto:{{ $user->entity->mail }}">{{ $user->entity->mail }}</a>
          @endisset
        </p>
      </div>
    </div>
  </footer>

</div> <!-- ./container -->

</body>
</html>
