// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class locationsStates extends Model {

  static get tableName() {
    return 'locations_states';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string' },
        deletedAt: { type: 'string', format: 'date-time' }
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

  db.schema.hasTable('locations_states').then(exists => {
    if (!exists) {
      db.schema.createTable('locations_states', table => {
        table.increments('id');
        table.string('name', 255);
        table.timestamp('deletedAt');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created locations_states table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating locations_states table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating locations_states table', e)); // eslint-disable-line no-console

  return locationsStates;
};
