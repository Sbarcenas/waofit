// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class usersAddresses extends Model {

  static get tableName() {
    return 'users_addresses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = function (app) {
  const db = app.get('knex');

  db.schema.hasTable('users_addresses').then(exists => {
    if (!exists) {
      db.schema.createTable('users_addresses', table => {
        table.increments('id');
        table.string('text');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created users_addresses table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating users_addresses table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating users_addresses table', e)); // eslint-disable-line no-console

  return usersAddresses;
};
