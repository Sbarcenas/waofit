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
    for (const coffeeShopProductsAttributes of context.coffee_products_attrib) {
      const [coffeeShopProductsAttribute] = await Promise.all([
        context.app
          .service("coffee-products-attrib")
          .getModel()
          .query()
          .where({
            id: coffeeShopProductsAttributes.coffee_products_attrib_id,
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
        coffeeShopProductsAttributes.coffee_attributes_of_section_ids.length > 1
      )
        throw new NotAcceptable(
          `La sesion con id ${coffeeShopProductsAttribute.id} es de unica selection.`
        );

      if (coffeeShopProductsAttribute.field_type == "multiple_selection") {
        if (
          coffeeShopProductsAttribute.max_select <
          coffeeShopProductsAttributes.coffee_attributes_of_section_ids.length
        )
          throw new NotAcceptable(
            `Los atributos del ${coffeeShopProductsAttribute.id} excede el maximo de atributos que se pueden escoger.`
          );

        if (
          coffeeShopProductsAttribute.min_select >
          coffeeShopProductsAttributes.coffee_attributes_of_section_ids.length
        )
          throw new NotAcceptable(
            `Los atributos del ${coffeeShopProductsAttribute.id} no son suficientes.`
          );
      }

      const coffeeShopProductAttributesOfSection = await context.app
        .service("coffee-attributes-of-section")
        .getModel()
        .query()
        .select("id", "price", "tax_rule_id")
        .whereIn(
          "id",
          coffeeShopProductsAttributes.coffee_attributes_of_section_ids
        )
        .where({
          coffee_products_attrib_id:
            coffeeShopProductsAttributes.coffee_products_attrib_id,
          deletedAt: null,
        })
        .then((it) => it);

      if (
        coffeeShopProductAttributesOfSection.length !=
        coffeeShopProductsAttributes.coffee_attributes_of_section_ids.length
      )
        throw new NotFound("No se encontró el atributo en la section");

      coffeeShopProductsAttributesOfSectionArray.push(
        coffeeShopProductAttributesOfSection
      );
    }

    context.coffeeShopProductAttributesOfSection = coffeeShopProductsAttributesOfSectionArray;

    replaceItems(context, records);

    return context;
  };
};
