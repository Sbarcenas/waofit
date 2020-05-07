// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    const [
      coffeShopAttributes,
      coffeeShopProductsAttributesSection,
    ] = await Promise.all([
      context.app
        .service("coffee-shop-attributes")
        .getModel()
        .query()
        .where({ id: records.coffee_shop_attributes_id, deletedAt: null })
        .then((id) => id[0]),
      context.app
        .service("coffee-shop-products-attributes-of-section")
        .getModel()
        .query()
        .where({
          id: records.coffee_shop_products_attributes_section_id,
          deletedAt: null,
        })
        .then((id) => id[0]),
    ]);

    if (!coffeShopAttributes) throw new NotFound("No se encontró el iva.");
    if (!coffeeShopProductsAttributesSection)
      throw new NotFound("No se encontró la categoria.");

    if (records.price < 0)
      throw new NotAcceptable("El precio no puede ser menor a 0.");
    replaceItems(context, records);

    return context;
  };
};
