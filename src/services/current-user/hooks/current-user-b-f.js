// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require("moment");

const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    context.result = await context.app.service("users").get(user.id, {
      query: {
        $select: [
          "id",
          "email",
          "first_name",
          "last_name",
          "status",
          "role",
          "facebookId",
          "gender",
          "birthday",
          "token_reset_password",
          "phone",
          "credits",
          "profile_picture"
        ]
      }
    });

    replaceItems(context, records);

    return context;
  };
};
