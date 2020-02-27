// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);
    await context.app.service("authors").create({
      user_id: records.id,
      name: `${records.first_name} ${records.last_name}`,
      profile_pircture: records.profile_pircture
    });

    replaceItems(context, records);

    return context;
  };
};
