// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common')
const { NotAcceptable } = require('@feathersjs/errors');
const users = require('../../../models/users.model');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    let records = getItems(context)

    // const users = await context.app.service('users').find({
    //   query: {
    //     $joinRelation: 'user-device-tokens',
    //     $eager: 'user-device-tokens',
    //   }
    // }).then(it => it.data[0])

    const valid = ajv.validate(users().jsonSchema, records);

    if (!valid) {
      throw new NotAcceptable(ajv.errors)
    }

    records.role = 'user'
    records.status = 'active'


    replaceItems(context, records)

    return context;
  };
};
