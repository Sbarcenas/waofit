// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class credentials extends Model {

  static get tableName() {
    return 'credentials';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['type','accessKey','secretKey'],
      properties: {
        type:{type:'string', enum:['s3Credential']},
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

  db.schema.hasTable('credentials').then(exists => {
    if (!exists) {
      db.schema.createTable('credentials', table => {
        table.increments('id');
        table.enum('type', ['s3Credential']);
        table.string('bucket', 255);
        table.string('region', 255);
        table.string('accessKey');
        table.string('secretKey');
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created credentials table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating credentials table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating credentials table', e)); // eslint-disable-line no-console

  return credentials;
};
