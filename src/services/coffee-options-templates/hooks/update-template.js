// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;
    let records = getItems(context);

    if (records.status == "active") {
      const coffeeShopProductsAttributesSection = await context.app
        .service("coffee-attributes-of-section")
        .getModel()
        .query()
        .where({ coffee_option_template_id: context.id, deletedAt: null })
        .then((it) => it);

      if (coffeeShopProductsAttributesSection.length < 1)
        throw new NotAcceptable(
          "No se puede activar el template por que no tiene items dentro."
        );
    }

    replaceItems(context, records);

    return context;
  };
};
