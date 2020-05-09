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

    const coffeeShopProduct = context.coffee_shop_product;
    const coffeeShopProductsAttributesOfSectionArray = [];
    for (const coffeeShopProductsAttributes of context.coffee_shop_products_attributes) {
      const [coffeeShopProductsAttribute] = await Promise.all([
        context.app
          .service("coffee-shop-products-attributes")
          .getModel()
          .query()
          .where({
            id: coffeeShopProductsAttributes.coffee_shop_products_attributes_id,
          })
          .then((it) => it[0]),
      ]);

      if (
        coffeeShopProductsAttribute.coffee_options_template_id !=
        coffeeShopProduct.coffee_options_template_id
      )
        throw new NotFound("No se encontró el template");

      if (
        coffeeShopProductsAttribute.field_type == "unique_selection" &&
        coffeeShopProductsAttributes.coffee_shop_products_attributes_of_section
          .length > 1
      )
        throw new NotAcceptable(
          `La sesion con id ${coffeeShopProductsAttribute.id} es de unica selection.`
        );

      const coffeeShopProductAttributesOfSection = await context.app
        .service("coffee-shop-products-attributes-of-section")
        .getModel()
        .query()
        .select("id", "price", "tax_rule_id")
        .whereIn(
          "coffee_shop_attributes_id",
          coffeeShopProductsAttributes.coffee_shop_products_attributes_of_section
        )
        .where({
          coffee_shop_products_attributes_id:
            coffeeShopProductsAttributes.coffee_shop_products_attributes_id,
          deletedAt: null,
        })
        .then((it) => it);

      if (
        coffeeShopProductAttributesOfSection.length !=
        coffeeShopProductsAttributes.coffee_shop_products_attributes_of_section
          .length
      )
        throw new NotFound("No se el atributo en la section");
      coffeeShopProductsAttributesOfSectionArray.push(
        coffeeShopProductAttributesOfSection
      );
      //   console.log(coffeeShopProductAttributes);
    }
    context.coffeeShopProductAttributesOfSection = coffeeShopProductsAttributesOfSectionArray;
    // console.log(context.coffee_shop_products_attributes);
    // console.log(coffeeShopProductsAttributesOfSectionArray);
    replaceItems(context, records);

    return context;
  };
};
