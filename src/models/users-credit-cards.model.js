// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class usersCreditCards extends Model {

  static get tableName() {
    return 'users_credit_cards';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'user_id', 'credit_card_token_id', 'owner_name', 'payment_method', 'masked_number', 'gateway',
        'exp_year', 'exp_month', 'customer_id', 'cvv', 'type_document', 'identification_number', 'default'
      ],

      properties: {
        user_id: { type: 'integer' },
        credit_card_token_id: {},
        owner_name: { type: 'string', maxLength: 255 },
        customer_id: { type: 'string' },
        cvv: { type: 'string' },
        type_document: { type: 'string', enum: ['CC', 'CE', 'PPN', 'SSN', 'LIC', 'NIT', 'TI', 'DNI'] },
        identification_number: { type: 'string', maxLength: 255 },
        exp_year: { type: 'integer' },
        exp_month: { type: 'integer' },
        masked_number: { type: 'string', maxLength: 255 },
        meta_data: { type: 'string' },
        payment_method: { type: 'string', maxLength: 255 },
        gateway: { type: 'string', maxLength: 255 },
        active: { type: 'integer' },
        brand: { type: 'string', maxLength: 255 },
        default: { type: 'string', enum: ['true', 'false'] },
        city: { type: 'string', maxLength: 255 },
        address: { type: 'string', maxLength: 255 },
        phone: { type: 'string', maxLength: 255 },
        cell_phone: { type: 'string', maxLength: 255 },
        deleted: { type: 'integer' }
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

  db.schema.hasTable('users_credit_cards').then(exists => {
    if (!exists) {
      db.schema.createTable('users_credit_cards', table => {
        table.increments('id');
        table.integer('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .index();
        table.string('credit_card_token_id', 255);
        table.string('owner_name', 255);
        table.string('customer_id', 255);
        table.string('cvv', 255);
        table.enum('type_document', ['CC', 'CE', 'PPN', 'SSN', 'LIC', 'NIT', 'TI', 'DNI']);
        table.string('identification_number', 255);
        table.integer('exp_year');
        table.integer('exp_month');
        table.string('masked_number', 255);
        table.string('meta_data');
        table.string('payment_method', 255);
        table.string('gateway', 255);
        table.string('active', 255);
        table.string('brand', 255);
        table.enum('default', ['true', 'false']);
        table.string('city', 255);
        table.string('address', 255);
        table.string('phone', 255);
        table.string('cell_phone', 255);
        table.integer('deleted');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created users_credit_cards table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating users_credit_cards table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating users_credit_cards table', e)); // eslint-disable-line no-console

  return usersCreditCards;
};
