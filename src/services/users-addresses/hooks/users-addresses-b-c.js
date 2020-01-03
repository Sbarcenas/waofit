// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        let records = getItems(context)

        const { user } = context.params

        records.user_id = user.id

        replaceItems(context, records)

        return context;
    };
};
