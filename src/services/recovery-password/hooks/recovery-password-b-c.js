// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const generate = require("nanoid/generate");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");

module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
    ]);

    const records = getItems(context);

    if (!records.email) throw new NotAcceptable("Debes enviar el email.");

    const user = await context.app
      .service("users")
      .find({ query: { email: records.email }, paginate: false })
      .then(it => it[0]);

    if (!user) throw new NotFound("Usuario no encontrado.");

    const data = await context.app
      .service("users")
      .patch(user.id, { token_reset_password: generate("123456789", 4) });

    const sendNotication = {
      action: "recovery-password",
      data: { ...data }
    };

    await context.app
      .service("send-notifications")
      .create({ ...sendNotication });

    replaceItems(context, records);

    return context;
  };
};
