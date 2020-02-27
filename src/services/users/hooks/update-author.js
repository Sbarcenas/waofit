// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    await context.app.service("authors").patch(user.id, {
      name: `${records.first_name} ${records.last_name}`,
      profile_picture: records.profile_picture
    });

    replaceItems(context, records);

    return context;
  };
};
