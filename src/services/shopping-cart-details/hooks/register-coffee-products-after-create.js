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

    const coffeeShopProductAttributesOfSection =
      context.coffeeShopProductAttributesOfSection;

    for (
      let index = 0;
      index < coffeeShopProductAttributesOfSection.length;
      index++
    ) {
      const coffeeShopProductAttributeOfSection =
        coffeeShopProductAttributesOfSection[index];

      const coffeeOptionData = {
        tax_rule_id: coffeeShopProductAttributeOfSection[0].tax_rule_id,
        coffee_shop_products_attributes_of_section_id:
          coffeeShopProductAttributeOfSection[0].id,
        price: coffeeShopProductAttributeOfSection[0].price,
      };

      const coffeeOption = await context.app
        .service("coffee-options")
        .getModel()
        .query()
        .insert(coffeeOptionData);

      //   const attibute = await context.app
      //     .service("coffee-shop-products-attributes-of-section")
      //     .getModel()
      //     .query()
      //     .where({ id: coffeeShopProductAttributeOfSection[0].id })
      //     .then((id) => id[0]);

      //seguimos aqui armando el json de los detalles
      const coffeeOptionsInShoppingCartDetails = {
        shopping_cart_details_id: records.id,
        coffee_options_id: coffeeOption.id,
      };
      await context.app
        .service("coffee-options-in-shopping-cart-details")
        .getModel()
        .query()
        .insert(coffeeOptionsInShoppingCartDetails);
    }

    replaceItems(context, records);

    return context;
  };
};
