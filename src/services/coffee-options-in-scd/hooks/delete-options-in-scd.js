// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    if (user.role == "admin") return context;

    if (!context.id) throw new NotAcceptable("Debes enviar el id.");

    const coffeeOptionsInshoppingCart = await context.app
      .service("coffee-options-in-scd")
      .getModel()
      .query()
      .where({ id: context.id, deletedAt: null })
      .then((it) => it[0]);

    if (coffeeOptionsInshoppingCart)
      throw new NotFound(
        "No se encontro el detalle del carro de compras de productos coffee."
      );
    else {
      const shoppingCartDetails = await context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .where({
          id: coffeeOptionsInshoppingCart.shopping_cart_details_id,
          deletedAt: null,
        })
        .then((it) => it[0]);

      if (!shoppingCartDetails)
        throw new NotFound("No se encontro el detalle del carro de compras.");

      const shoppingCart = await context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where({ id: shoppingCartDetails.shopping_cart_id, deletedAt: null })
        .then((it) => it[0]);
    }

    if (!shoppingCart)
      throw new NotFound("No se encontro el carro de compras.");

    replaceItems(context, records);

    return context;
  };
};
