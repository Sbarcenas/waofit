// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    let records = getItems(context)

    const { user } = context.params

    if(records.default == 'true'){
      const creditCards = await context.app.service('users-credit-cards').find({query:{user_id: user.id }, paginate: false}).then(it =>it);

        if(creditCards.length > 0){
          
            await context.app.service('users-credit-cards').getModel()
              .query()
              .patch({ default: 'false' })
              .where('user_id',user.id)
              .whereNot('id',records.id);
        }
    }
    

    replaceItems(context, records)

    return context;
  };
};
