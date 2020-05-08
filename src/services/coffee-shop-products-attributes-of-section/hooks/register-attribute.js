// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    const [
      coffeShopAttributes,
      coffeeShopProductsAttributes,
      coffeeShopProductsAttributesOfSection,
      taxRule,
    ] = await Promise.all([
      context.app
        .service("coffee-shop-attributes")
        .getModel()
        .query()
        .where({ id: records.coffee_shop_attributes_id, deletedAt: null })
        .then((id) => id[0]),
      context.app
        .service("coffee-shop-products-attributes")
        .getModel()
        .query()
        .where({
          id: records.coffee_shop_products_attributes_id,
          deletedAt: null,
        })
        .then((id) => id[0]),
      context.app
        .service("coffee-shop-products-attributes-of-section")
        .getModel()
        .query()
        .where({
          coffee_shop_products_attributes_id:
            records.coffee_shop_products_attributes_id,
          coffee_shop_attributes_id: records.coffee_shop_attributes_id,
          deletedAt: null,
        })
        .then((it) => it[0]),
      context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: records.tax_rule_id, deletedAt: null })
        .then((id) => id[0]),
    ]);

    if (!coffeShopAttributes)
      throw new NotFound("No se encontró el atributo 1");
    if (!coffeeShopProductsAttributes)
      throw new NotFound("No se encontró el atributo");
    if (coffeeShopProductsAttributesOfSection)
      throw new NotAcceptable("Ya existe este atributo en la plantilla.");

    if (!taxRule) throw new NotAcceptable("No se encontró el iva.");

    if (records.price < 0)
      throw new NotAcceptable("El precio no puede ser menor a 0.");

    records.position = records.position ? records.position : 0;
    replaceItems(context, records);

    return context;
  };
};
