// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeShopProductsAttributesOfSection extends Model {
  static get tableName() {
    return "coffee_shop_products_attributes_of_section";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "coffe_shop_attributes_id",
        "coffee_shop_products_attributes_section_id",
      ],

      properties: {
        coffe_shop_attributes_id: { type: "inetger" },
        coffee_shop_products_attributes_section_id: { type: "integer" },
        price: { type: "number" },
        deletedAt: { type: "string", format: "date-time" },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = function (app) {
  const db = app.get("knex");

  db.schema
    .hasTable("coffee_shop_products_attributes_of_section")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable(
            "coffee_shop_products_attributes_of_section",
            (table) => {
              table.increments("id");
              table.integer("coffe_shop_attributes_id");
              table.integer("coffee_shop_products_attributes_section_id");
              table.double("price");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            }
          )
          .then(() =>
            console.log(
              "Created coffee_shop_products_attributes_of_section table"
            )
          ) // eslint-disable-line no-console
          .catch((e) =>
            console.error(
              "Error creating coffee_shop_products_attributes_of_section table",
              e
            )
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error(
        "Error creating coffee_shop_products_attributes_of_section table",
        e
      )
    ); // eslint-disable-line no-console

  return coffeeShopProductsAttributesOfSection;
};
