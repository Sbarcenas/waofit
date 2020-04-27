// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.quantity == 0)
      throw new NotAcceptable("La cantidad no puede ser 0.");

    const recurringShoppingCartDetailt = await context.app
      .service("recurring-shopping-cart-details")
      .getModel()
      .query()
      .where({ id: context.id })
      .then((it) => it[0]);

    const query =
      user.role == "user"
        ? {
            id: recurringShoppingCartDetailt.recurring_shopping_cart_id,
            user_id: user.id,
          }
        : { id: recurringShoppingCartDetailt.recurring_shopping_cart_id };

    const recurringShoppingCart = await context.app
      .service("recurring-shopping-cart")
      .getModel()
      .query()
      .where(query)
      .then((it) => it[0]);

    if (!recurringShoppingCart)
      throw new NotFound("No se encontró el carro de compras recurrente.");

    let product = null;
    switch (recurringShoppingCartDetailt.shop_type) {
      case "express_product":
        product = await context.app
          .service("express-products")
          .getModel()
          .query()
          .where({ id: recurringShoppingCartDetailt.product_id })
          .then((it) => it[0]);

        break;

      default:
        break;
    }

    if (records.quantity > product.quantity)
      throw new NotAcceptable("El producto no cuenta con sufiente stock.");

    replaceItems(context, records);

    return context;
  };
};
