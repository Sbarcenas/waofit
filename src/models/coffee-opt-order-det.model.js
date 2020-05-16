// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOptCoffeeOrderDet extends Model {
  static get tableName() {
    return "coffee_opt_order_det";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "coffee_order_details_id",
        "coffee_attributes_of_section_id",
        "total_price_tax_inc",
        "total_price_tax_excl",
        "total_tax",
        "total_price",
        "unit_price_tax_excl",
        "unit_price_tax_inc",
      ],

      properties: {
        coffee_order_details_id: { type: "integer" },
        coffee_attributes_of_section_id: { type: "integer" },
        total_price_tax_inc: { type: "number" },
        total_price_tax_excl: { type: "number" },
        total_tax: { type: "number" },
        total_price: { type: "number" },
        unit_price_tax_excl: { type: "number" },
        unit_price_tax_inc: { type: "number" },
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
    .hasTable("coffee_opt_order_det")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_opt_order_det", (table) => {
            table.increments("id");
            table
              .integer("coffee_order_details_id")
              .unsigned()
              .references("id")
              .inTable("coffee_order_details")
              .index();
            table
              .integer("coffee_attributes_of_section_id")
              .unsigned()
              .references("id")
              .inTable("coffee_attributes_of_section")
              .index();
            table.double("total_price_tax_inc");
            table.double("total_price_tax_excl");
            table.double("total_tax");
            table.double("total_price");
            table.double("unit_price_tax_excl");
            table.double("unit_price_tax_inc");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_opt_order_det table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_opt_order_det table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_opt_order_det table", e)
    ); // eslint-disable-line no-console

  return coffeeOptCoffeeOrderDet;
};
