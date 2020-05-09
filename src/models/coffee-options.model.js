// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOptions extends Model {
  static get tableName() {
    return "coffee_options";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
        price: { type: "number" },
        tax_rule_id: { type: "integer" },
        coffee_shop_products_attributes_of_section_id: { type: "integer" },
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
    .hasTable("coffee_options")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_options", (table) => {
            table.increments("id");
            table
              .integer("tax_rule_id")
              .unsigned()
              .references("id")
              .inTable("tax-rule")
              .index();
            table
              .integer("coffee_shop_products_attributes_of_section_id")
              .unsigned()
              .references("id")
              .inTable("coffee-shop-products-attributes-of-section-id")
              .index();
            table.double("price");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_options table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_options table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating coffee_options table", e)); // eslint-disable-line no-console

  return coffeeOptions;
};
