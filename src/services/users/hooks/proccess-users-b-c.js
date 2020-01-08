// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common')
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


    records.role = 'user'
    records.status = 'active'


    replaceItems(context, records)

    return context;
  };
};
