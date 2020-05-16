// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOrderDetails extends Model {
  static get tableName() {
    return "coffee_order_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "coffee_order_id",
        "shipping_status",
        "coffee_shop_product_id",
        "unit_price_tax_excl",
        "quantity",
        "unit_price_tax_incl",
        "unit_price_tax",
        "total_price_tax_incl",
        "total_price_tax",
      ],

      properties: {
        coffee_order_id: { type: "integer" },
        coffee_shop_product_id: { type: "integer" },
        sent: { type: "integer" },
        shipping_status: {
          type: "string",
          enum: ["sent", "delivered", "pending shipping"],
        },
        unit_price_tax_excl: { type: "number" },
        unit_price_tax_incl: { type: "number" },
        quantity: { type: "integer" },
        unit_price_tax: { type: "number" },
        total_price_tax: { type: "number" },
        total_price_tax_incl: { type: "number" },
        coffee_shop_product_name: { type: "string" },
        coffee_shop_product_image: { type: "string" },
        coffee_shop_product_details_meta_data: { type: "string" },
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
    .hasTable("coffee_order_details")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_order_details", (table) => {
            table.increments("id");
            table
              .integer("coffee_order_id")
              .unsigned()
              .references("id")
              .inTable("coffee_orders")
              .index();
            table
              .integer("coffee_shop_product_id")
              .unsigned()
              .references("id")
              .inTable("coffee_shop_products")
              .index();
            table.integer("quantity");
            table.decimal("unit_price_tax_excl");
            table.decimal("unit_price_tax_incl");
            table.decimal("unit_price_tax");
            table.decimal("total_price_tax");
            table.decimal("total_price_tax_incl");
            table.integer("sent");
            table.enum("shipping_status", [
              "sent",
              "delivered",
              "pending shipping",
            ]);
            table.string("coffee_shop_product_name");
            table.string("coffee_shop_product_image");
            table.text("coffee_shop_product_details_meta_data");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_order_details table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_order_details table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_order_details table", e)
    ); // eslint-disable-line no-console

  return coffeeOrderDetails;
};
