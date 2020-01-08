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
      required: ['lat', 'lng', 'city_id', 'user_id'],

      properties: {
        address: { type: 'string', maxLength: 255 },
        user_id: { type: 'integer' },
        city_id: { type: 'integer' },
        lat: { type: 'number' },
        lng: { type: 'number' },
        details: { type: 'string' },
        main: { type: 'string', enum: ['true', 'false'] },
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

  db.schema.hasTable('users_addresses').then(exists => {
    if (!exists) {
      db.schema.createTable('users_addresses', table => {
        table.increments('id');
        table.string('address', 255);
        table.integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .index();
        table.integer('city_id')
          .unsigned()
          .references('id')
          .inTable('locations_cities')
          .index();
        table.double('lat');
        table.double('lng');
        table.string('details')
        table.enum('main', ['true', 'false']);
        table.timestamp('deletedAt').nullable();
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
