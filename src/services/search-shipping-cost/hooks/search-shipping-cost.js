// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const inside = require("point-in-polygon");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    const userAddress = await context.app
      .service("users-addresses")
      .getModel()
      .query()
      .where({ id: context.params.query.user_address_id })
      .then((it) => it[0]);

    if (!userAddress) throw new NotFound("No se encontró la dirección.");

    const coordinate = [userAddress.lat, userAddress.lng];

    const shippingCosts = await context.app
      .service("shipping-costs")
      .getModel()
      .query()
      .where({ city_id: userAddress.city_id, deletedAt: null })
      .then((it) => it);

    let shippingCostSelect = null;
    for (let index = 0; index < shippingCosts.length; index++) {
      const shippingCost = shippingCosts[index];
      const polygon = JSON.parse(shippingCost.polygon).map((it) => [
        it.lat,
        it.lng,
      ]);

      if (inside(coordinate, polygon)) {
        shippingCostSelect = shippingCost;
        break;
      }
    }

    if (!shippingCostSelect)
      throw new NotAcceptable("No tenemos cubertura para tu ubicación.");

    context.result = {
      shippingCost: shippingCostSelect,
    };

    replaceItems(context, records);

    return context;
  };
};
