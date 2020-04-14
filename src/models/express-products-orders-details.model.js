// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProductsOrdersDetails extends Model {
  static get tableName() {
    return "express_products_orders_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "express_product_order_id",
        "shipping_status",
        "type_product",
        "express_product_id",
        "unit_price_tax_excl",
        "quantity",
        "unit_price_tax_incl",
        "unit_price_tax",
        "total_price_tax_incl",
        "total_price_tax",
      ],

      properties: {
        express_product_order_id: { type: "integer" },
        shipping_status: {
          type: "string",
          enum: ["sent", "delivered", "pending shipping"],
        },
        type_product: { type: "string", enum: ["scheduled", "not_scheduled"] },
        quantity: { type: "integer" },
        express_product_id: { type: "integer" },
        unit_price_tax_excl: { type: "number" },
        unit_price_tax_incl: { type: "number" },
        unit_price_tax: { type: "number" },
        total_price_tax: { type: "number" },
        total_price_tax_incl: { type: "number" },
        sent: { type: "integer" },
        express_product_name: { type: "string" },
        express_product_image: { type: "string" },
        express_product_details_meta_data: { type: "string" },
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
    .hasTable("express_products_orders_details")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("express_products_orders_details", (table) => {
            table.increments("id");
            table
              .integer("express_product_order_id")
              .unsigned()
              .references("id")
              .inTable("express_products_orders")
              .index();
            table
              .integer("express_product_id")
              .unsigned()
              .references("id")
              .inTable("express_products")
              .index();
            table.enum("type_product", ["scheduled", "not_scheduled"]);
            table.integer("quantity");
            table.decimal("unit_price_tax_excl");
            table.decimal("unit_price_tax_incl");
            table.decimal("unit_price_tax");
            table.decimal("total_price_tax");
            table.decimal("total_price_tax_incl");
            table.integer("sent");
            table.string("express_product_name");
            table.string("express_product_main_image");
            table.string("express_product_details_meta_data");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() =>
            console.log("Created express_products_orders_details table")
          ) // eslint-disable-line no-console
          .catch((e) =>
            console.error(
              "Error creating express_products_orders_details table",
              e
            )
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating express_products_orders_details table", e)
    ); // eslint-disable-line no-console

  return expressProductsOrdersDetails;
};
