// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    const [taxRule, coffeeShopProductCategory] = await Promise.all([
      context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: records.tax_rule_id, deletedAt: null })
        .then((id) => id[0]),
      context.app
        .service("coffee-shop-product-category")
        .getModel()
        .query()
        .where({ id: records.coffee_shop_category_id, deletedAt: null })
        .then((id) => id[0]),
    ]);

    if (!taxRule) throw new NotFound("No se encontró el iva.");
    if (!coffeeShopProductCategory)
      throw new NotFound("No se encontró la categoria.");

    records.status = "inactive";

    replaceItems(context, records);

    return context;
  };
};
