// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class locationsCities extends Model {

  static get tableName() {
    return 'locations_cities';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'state_id'],

      properties: {
        name: { type: 'string', maxlength: 255 },
        state_id: { type: 'integer' },
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

  db.schema.hasTable('locations_cities').then(exists => {
    if (!exists) {
      db.schema.createTable('locations_cities', table => {
        table.increments('id');
        table.string('name');
        table.integer('state_id')
          .unsigned()
          .references('id')
          .inTable('locations_states')
          .index();
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created locations_cities table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating locations_cities table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating locations_cities table', e)); // eslint-disable-line no-console

  return locationsCities;
};
