// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class usersProductBrandFavorites extends Model {

  static get tableName() {
    return 'users_product_brand_favorites';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'product_brand_id'],

      properties: {
        user_id: { type: 'integer' },
        product_brand_id: { type: 'integer' },
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

  db.schema.hasTable('users_product_brand_favorites').then(exists => {
    if (!exists) {
      db.schema.createTable('users_product_brand_favorites', table => {
        table.increments('id');
        table.integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .index();
        table.integer('product_brand_id')
          .unsigned()
          .references('id')
          .inTable('product_brand')
          .index();
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created users_product_brand_favorites table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating users_product_brand_favorites table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating users_product_brand_favorites table', e)); // eslint-disable-line no-console

  return usersProductBrandFavorites;
};
