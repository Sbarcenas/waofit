// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (records.shop_type != "coffee") return context;

    const coffeeShopProductAttributesOfSections =
      context.coffeeShopProductAttributesOfSection;

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
          coffee_shop_product_id: records.product_id,
        };

        const coffeeOption = await context.app
          .service("coffee-options")
          .getModel()
          .query()
          .insert(coffeeOptionData);

        // seguimos aqui armando el json de los detalles
        const coffeeOptionsInShoppingCartDetails = {
          shopping_cart_details_id: records.id,
          coffee_options_id: coffeeOption.id,
        };
        await context.app
          .service("coffee-options-in-scd")
          .getModel()
          .query()
          .insert(coffeeOptionsInShoppingCartDetails);
      }
    }

    replaceItems(context, records);

    return context;
  };
};
