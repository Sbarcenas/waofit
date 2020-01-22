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

    if(records.default == 'true'){
      const creditCards = await context.app.service('users-credit-cards').find({query:{user_id: user.id }, paginate: false}).then(it =>it);

        if(creditCards.length > 0){
            await context.app.service('users-credit-cards').patch(null, { default: 'false' }, {
                query: { user_id: user.id }
            });
        }
    }
    

    replaceItems(context, records)

    return context;
  };
};
