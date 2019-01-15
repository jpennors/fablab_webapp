# Sébastien

Code source du projet `Sébastien`, le __site de gestion du Fablab__.
Pour toute question, ne pas hésiter à nous écrire: <josseln.pennors@etu.utc.fr> et <thomas.legluher@etu.utc.fr>.

### Dépendances

Installer les dépendances npm:
```
npm install
```

Installer les dépendances composer:
```
composer install
```

### Configuration

Créer le fichier d'environnement `.env` à partir de `.env.example`.

Créer le fichier d'environnement `resources/app/env.js` à partir de `resources/app/env.example.js`.

### Compiler l'application

Compiler avec la commande:
```
gulp
```

Vous pouvez vous rendre avec votre navigateur dans `public`.


## Pré-requis

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

### Déployer en preview/production
Executer à la racine :
```
vendor/bin/dep deploy preview
``` 
ou
```
vendor/bin/dep deploy production
```
Le ficher de configuration `server.yml` permet de configurer les paramètres du serveur.

#### Help
Pour débugger le script deployer :
```
vendor/bin/dep deploy production -vvv
```