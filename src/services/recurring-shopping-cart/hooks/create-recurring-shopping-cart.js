// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    let query = null;
    records.user_address_id
      ? (query = {
          id: records.user_address_id,
          user_id: user.id,
          deletedAt: null,
        })
      : (query = { user_id: user.id, main: "true", deletedAt: null });

    const userAddress = await context.app
      .service("users-addresses")
      .getModel()
      .query()
      .where(query)
      .then((it) => it[0]);

    if (!userAddress) throw new NotFound("No se encontró la dirección.");

    records.next_delivery = await context.app
      .service("calculate-next-delivery")
      .find()
      .then((it) => moment(it.next_delivery).format("YYYY-MM-DD"));

    records.user_address_id = userAddress.id;
    records.user_address_meta_data = JSON.stringify(userAddress);
    records.status = "preparing";
    records.user_id = user.id;

    replaceItems(context, records);

    return context;
  };
};
