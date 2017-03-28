'use strict';
module.exports = function(sequelize, DataTypes) {
  var Resto = sequelize.define('Resto', {
    nom: DataTypes.STRING,
    type: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    note: DataTypes.DOUBLE,
    idUser: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Resto.hasMany(models.Notes, {foreignKey: 'idResto' });
      }
    }
  });
  return Resto;
};