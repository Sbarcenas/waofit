const { Model } = require('objection');

module.exports = function (app) {
  const { client, connection } = app.get('mysql');
  const knex = require('knex')({ client, connection, useNullAsDefault: false });
  // knex.on('query', data => { console.dir(data) })
  Model.knex(knex);

  app.set('knex', knex);
};
