# FIND RESTO!

C'est une application pour donner des avis  sur des restaurantes de tout le monde sur une échelle de 1 à 10, vous trouverez des avis des 
autres utilisateurs pour mieux s'informer et mieux manger. 
Cette application aidera à trouver facilement les bons lieux locales pour bien manger où ajouter un pour que les personnes le connaissent . 
L’application montrerais un liste avec les meilleurs options d’accord à des autres utilisateurs qui sont allez et ils le recommendent.

On a créé cet API en utilisant de node js et ses librairies et on l'a mis en place avec un démo d’un application mobile avec le framework ionic.

## Les principales fonctionnalités sont:

-Créer, consulter et modifier un compte d’utilisateur

-Créer, consulter et noter des restaurantes

-Créer,  consulter et éliminer des notes


## Installation API


### Dependencies:

-Mysql


```
$ npm install mysql

```

-Sequelize


```
$ npm install -S sequelize

```

```
$ npm install -g sequelize-cli

```

### Deployment:

-Clone ou donwload le project  https://github.com/amanda07511/project_node.git

-Créer un base de données avec le nom Resto

-Ouvrir les projets en console et installe le dependencies

-Changer votre configuration de base de données en config>config 

-Entree 
```
$ sequelize db:migrate

```

### Utilisation:

-Dans console en la  racine du projet  entrée  $ node app.js

-Utiliser votre explorateur ou un tool comme postman pour tester les liens 
