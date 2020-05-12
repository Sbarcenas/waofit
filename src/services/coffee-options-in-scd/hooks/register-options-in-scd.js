// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    const coffeeShopProductAttributesOfSections =
      context.coffeeShopProductAttributesOfSection;

    const coffeeOptionsIds = [];

    const coffeeOptionIds = await context.app
      .service("coffee-options-in-scd")
      .getModel()
      .query()
      .where({
        shopping_cart_details_id: records.shopping_cart_details_id,
        deletedat: null,
      })
      .then((it) => it.map((it) => it.coffee_options_id));

    await context.app
      .service("coffee-options-in-scd")
      .getModel()
      .query()
      .where({ shopping_cart_details_id: records.shopping_cart_details_id })
      .del();

    for (
      let index = 0;
      index < coffeeShopProductAttributesOfSections.length;
      index++
    ) {
      const coffeeShopProductAttributesOfSection =
        coffeeShopProductAttributesOfSections[index];
      for (const coffeeShopProductAttributeOfSection of coffeeShopProductAttributesOfSection) {
        const coffeeOptionData = {
          tax_rule_id: coffeeShopProductAttributeOfSection.tax_rule_id,
          coffee_attributes_of_section_id:
            coffeeShopProductAttributeOfSection.id,
          price: coffeeShopProductAttributeOfSection.price,
          coffee_shop_product_id: context.coffee_shop_product.id,
        };

        const coffeeOption = await context.app
          .service("coffee-options")
          .getModel()
          .query()
          .insert(coffeeOptionData);

        const coffeeOptionsInShoppingCartDetails = {
          shopping_cart_details_id: records.shopping_cart_details_id,
          coffee_options_id: coffeeOption.id,
        };

        await context.app
          .service("coffee-options-in-scd")
          .getModel()
          .query()
          .insert(coffeeOptionsInShoppingCartDetails)
          .then((it) => it.id);
      }
    }

    await context.app
      .service("coffee-options")
      .getModel()
      .query()
      .whereIn("id", coffeeOptionIds)
      .del();

    context.result = [];

    replaceItems(context, records);

    return context;
  };
};
