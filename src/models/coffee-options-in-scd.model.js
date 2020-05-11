// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOptionsInShoppingCartDetails extends Model {
  static get tableName() {
    return "coffee_options_in_scd";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
        shopping_cart_details_id: { type: "integer" },
        coffee_options_id: { type: "integer" },
        meta_name: { type: "string", maxLength: 255 },
        meta_section_name: { type: "string", maxLength: 255 },
        meta_order_tax_percentege: { type: "number", maxLength: 255 },
        meta_order_price_tax_excl: { type: "number", maxLength: 255 },
        meta_order_price_tax_inc: { type: "number", maxLength: 255 },
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
    .hasTable("coffee_options_in_scd")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_options_in_scd", (table) => {
            table.increments("id");
            table
              .integer("shopping_cart_details_id")
              .unsigned()
              .references("id")
              .inTable("shopping_cart_details")
              .index();
            table
              .integer("coffee_options_id")
              .unsigned()
              .references("id")
              .inTable("coffee_options")
              .index();
            table.string("meta_name");
            table.string("meta_section_name");
            table.double("meta_order_tax_percentege");
            table.double("meta_order_price_tax_excl");
            table.double("meta_order_price_tax_inc");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_options_in_scd table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_options_in_scd table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_options_in_scd table", e)
    ); // eslint-disable-line no-console

  return coffeeOptionsInShoppingCartDetails;
};
