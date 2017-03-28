'use strict';

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Resto, {foreignKey: 'idUser' });
        User.hasMany(models.Note, {foreignKey: 'idUser' });
      }
    }
  });
  return User;
};


