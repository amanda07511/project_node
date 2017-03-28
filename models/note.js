'use strict';
module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define('Note', {
    note: DataTypes.DOUBLE,
    message: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    idResto: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Note.belongsTo(models.User, {foreignKey: 'idUser' });
        Note.belongsTo(models.Resto, {foreignKey: 'idResto' , onDelete: 'cascade'});
      }
    }
  });
  return Note;
};