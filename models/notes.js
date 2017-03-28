'use strict';
module.exports = function(sequelize, DataTypes) {
  var Notes = sequelize.define('Notes', {
    note: DataTypes.DOUBLE,
    message: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    idResto: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Notes;
};