# Site de gestion du Fablab UTC


Code source du projet de __site de gestion du Fablab__.
Pour toute question, ne pas hésiter à nous écrire: <josselin.pennors@etu.utc.fr> et <ayman.lamdasni@etu.utc.fr>.

## Historique

La conception et le développement du site de gestion du Fablab UTC ont démarré en 2017 dans le cadre d'UV Projet à l'UTC (PR). Après de multiples semestres le site est en production depuis janvier 2019.

## Fonctionnalités

### Interface principale

L'interface principale permet la gestion des tâches à réaliser avec deadline et avancement, une gestion des stocks en alerte ainsi que des services commandés triés par date de réalisation.

![Dashboard!](/documentation/images/dashboard.png "Dashboard")

### Gestion du matériel

Quatre onglets permettent de gérer les produits, les consommables, les outils ainsi que les machines présentes au sein du Fablab.

![Engine management!](/documentation/images/engine.png "Engine management")

### Gestion des utilisateurs

L'authentification passe par le CAS UTC. Il existe différents rôles donnant accès à un certain nombre de droits, le plus petit étant celui de membre CAS UTC.

![User management!](/documentation/images/user.png "User management")

![Permission management!](/documentation/images/permission.png "Permission management")

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