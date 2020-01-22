// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class s3Credentials extends Model {

  static get tableName() {
    return 's_3_credentials';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['bucket','region','accessKey','secretKey'],

      properties: {
        bucket: { type: 'string', maxLength:255 },
        region: { type: 'string', maxLength:255 },
        accessKey: { type: 'string' },
        secretKey: { type: 'string' },
        deletedAt: { type: 'string', format:'date-time' },
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

  db.schema.hasTable('s_3_credentials').then(exists => {
    if (!exists) {
      db.schema.createTable('s_3_credentials', table => {
        table.increments('id');
        table.string('bucket', 255);
        table.string('region', 255);
        table.string('accessKey');
        table.string('secretKey');
        table.timestamp('deletedAt');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created s_3_credentials table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating s_3_credentials table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating s_3_credentials table', e)); // eslint-disable-line no-console

  return s3Credentials;
};
