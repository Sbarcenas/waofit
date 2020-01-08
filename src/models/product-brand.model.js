// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class productBrand extends Model {

  static get tableName() {
    return 'product_brand';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string', maxLength: 255 },
        icon_path: { type: 'string' },
        description: { type: 'string' },
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

  db.schema.hasTable('product_brand').then(exists => {
    if (!exists) {
      db.schema.createTable('product_brand', table => {
        table.increments('id');
        table.string('name', 255);
        table.string('icon_path');
        table.string('description');
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created product_brand table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating product_brand table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating product_brand table', e)); // eslint-disable-line no-console

  return productBrand;
};
