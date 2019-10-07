# Site de gestion du Fablab UTC


Code source du projet de __site de gestion du Fablab__.
Pour toute question, ne pas hésiter à m'écrire: <josselin.pennors@etu.utc.fr>.

## Historique

La conception et le développement du site de gestion du Fablab UTC ont démarré en 2017 dans le cadre d'UV Projet à l'UTC (PR). Après de multiples semestres le site est en production depuis janvier 2019.

## Fonctionnalités

### Gestion des utilisateurs

L'authentification passe par le CAS UTC. Il existe différents rôles donnant accès à un certain nombre de droits, le plus petit étant celui de membre CAS UTC.

![User management](/documentation/images/user.png "User management")

### Création de services et de fonctions de prix

Dans le but de vendre des services tels que des découpes lasers en tenant en compte de nombreux paramètres (type de commanditeur, matériel, temps d'utilisation de la machine), des fonctions de prix ont été créées permettant de gérer dynamiquement leur prix. Ainsi des arguments sont crées et utilisées au sein d'un script JavaScript.

![Service management](/documentation/images/service.png "Service management")


### Gestion des commandes

La principale fonctionnalité/utilié de l'application réside dans son gestion des commandes. Il est possible pour n'importe quel utilisateur UTC de réaliser une commande.

![Create order](/documentation/images/create_order.png "Create order")

Une page permet ensuite le dialogue entre les membres du Fablab UTC et le commanditeur. Diverses fonctionnalités sont disponibles telles que la génération de devis, de facture, le choix de l'entité, l'envoi d'un email via la plateforme.

![Edit order](/documentation/images/edit_order.png "Edit order")

Le paiement est également découpé selon 3 aspects: le paiement par badgeuse (websocket + NFC), le paiement via l'interface Nemopay et les paiements externes qui peuvent être réalisés grâce à la possibilité de marquer la commande comme payé.

![Payment](/documentation/images/payment.png "Payment")


### Gestion des semestres

Pour un soucis d'optimisation dans la gestion des commandes, ces dernières sont organisées en semestre.

![Semester management](/documentation/images/semester.png "Semester management")


### Interface principale

L'interface principale permet la gestion des tâches à réaliser avec deadline et avancement, une gestion des stocks en alerte ainsi que des services commandés triés par date de réalisation.

![Dashboard](/documentation/images/dashboard.png "Dashboard")

### Gestion du matériel

Quatre onglets permettent de gérer les produits, les consommables, les outils ainsi que les machines présentes au sein du Fablab.

![Engine management](/documentation/images/engine.png "Engine management")


## Installation

Si vous n'avez jamais utilisé Node ou que vous partez d'une installation vierge, installez tout d'abord NodeJs et Node Package Manager (npm). Les commandes sont adaptées au cas d'un environnement Linux mais les étapes restent les mêmes quel que soit votre système d'exploitation.

```sudo apt install curl```

```curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -```

```sudo apt-get install nodejs```

NodeJS installera les dépendances npm en même temps.

### Installez composer, MySQL, PHP, Apache, gulp

```sudo apt install composer```
```sudo apt install mysql-server```
Pour configurer votre serveur MySQL:
```$ sudo mysql_secure_installation```
Vous pourrez ensuite vous connecter à MySQL avec la commande `` mysql -u root -p `` en entrant ensuite le mot de passe défini lors de l'installation (si le mot de passe est différent de "root", pensez à le modifier dans le fichier .env). Créez enfin la base de données fabalab grâce à la commande 
``` CREATE DATABASE fablab;```
PS: Si vous êtes sur Windows, il peut être plus simple d'installer phpMyAdmin qui propose une interface graphique plus simple d'utilisation.

```sudo apt install php-mysql```
```npm install -g gulp```

Apache est normalement déjà installé sur la plupart des distributions Linux. ``apache2 -v`` pour en avoir le coeur net.

Dans le fichier ``vendor/laravel/framework/src/Illuminate/Foundation/Console/ServeCommand.php`` ligne 35, remplacez le contenu de la ligne par ``chdir("public/");``

Créer les dossiers cache/sessions/views

``php artisan key:generate``
``sudo apt-get install curl``

### Dépendances

```
composer install
```
Il est possible que la commande renvoie une erreur vous indiquant qu'il vous manque certaines extensions php. Pas de panique, il suffit d'installer les extensions manquantes.

### Configuration

```
gulp
```
Une fois que le code est compilé (et que vous n'avez fait aucune modification depuis), vous pouvez utiliser la commande ``gulp watch`` qui restera alerte à toute modification et compilera en permanence. Pensez à lancer ``gulp`` une premiere fois puis ``gulp watch`` à chaque début de session pour pouvoir coder tranquillement.

Vous pouvez vous rendre avec votre navigateur dans `public`.



### Pré-requis

### Génération de PDF

Installer `wkhtmltopdf` & `wkhtmltoimage` sur le serveur et configurer le chemin vers les binaires dans `.env`:
```
WKHTMLTOPDF_BIN=/usr/local/bin/wkhtmltopdf
WKHTMLTOIMG_BIN=/usr/local/bin/wkhtmltoimage
```
Ne pas oublier de donner les droits d'exécution sur ces binaires.

En production sur `gestion.fablabutc.fr`:
```
WKHTMLTOPDF_BIN="xvfb-run -- wkhtmltopdf"
WKHTMLTOIMG_BIN="xvfb-run -- wkhtmltoimage"
```

### Permissions & Apache sous Linux

Donner les permissions `755` aux dossiers `storage` et `bootstrap`:
```
chmod -R o+w storage
chmod -R o+w bootstrap
```

# Déployer

Le déploiement en preview et production se fait via [deployer](https://deployer.org/).

## Déployer en preview/production
Executer à la racine :
```
vendor/bin/dep deploy preview
``` 
ou
```
vendor/bin/dep deploy production
```
Le ficher de configuration `server.yml` permet de configurer les paramètres du serveur.

### Help
Pour débugger le script deployer :
```
vendor/bin/dep deploy production -vvv
```