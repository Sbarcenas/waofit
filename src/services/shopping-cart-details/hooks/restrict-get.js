// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (user.role == "admin") return context;

    if (context.id) {
      const shoppingCartDetails = await context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .where({ id: context.id })
        .then((it) => it[0]);

      const shoppingCart = await context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where({
          id: shoppingCartDetails.shopping_cart_id,
          user_id: user.id,
          deletedAt: null,
        })
        .then((it) => it[0]);
      //   throw "";
      context.params.query["shopping_cart_id"] = shoppingCart.id;
    } else if (!context.id) {
      const shoppingCartIds = await context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where({
          user_id: user.id,
          deletedAt: null,
        })
        .then((it) => it.map((it) => it.id));

      context.params.query["shopping_cart_id"] = { $in: shoppingCartIds };
    }

    // context.params.query = query
    replaceItems(context, records);

    return context;
  };
};
