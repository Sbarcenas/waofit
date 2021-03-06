// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOrders extends Model {
  static get tableName() {
    return "coffee_orders";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "user_id",
        "order_status_id",
        "type_dispatch",
        "meta_data",
        "shipping_address_meta_data",
        "total_price_tax_excl",
        "total_price_tax_incl",
        "total_tax",
        "order_id",
      ],

      properties: {
        user_id: { type: "integer" },
        order_status_id: { type: "integer" },
        order_id: { type: "integer" },
        type_dispatch: { type: "string", enum: ["pick up", "delivery"] },
        meta_data: { type: "string" },
        shipping_address_meta_data: { type: "string" },
        total_price_tax_excl: { type: "number" },
        total_price_tax_incl: { type: "number" },
        total_tax: { type: "number" },
        shipping_cost_meta_data: { type: "string" },
        shipping_cost: { type: "number" },
        total_price_shipping_cost_excl: { type: "number" },
        total_price: { type: "number" },
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
    .hasTable("coffee_orders")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_orders", (table) => {
            table.increments("id");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .integer("order_status_id")
              .unsigned()
              .references("id")
              .inTable("orders_status")
              .index();
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index();
            table
              .enum("type_dispatch", ["pick up", "delivery"])
              .defaultTo("delivery");
            table.text("meta_data");
            table.text("shipping_address_meta_data");
            table.decimal("total_price_tax_excl");
            table.decimal("total_price_tax_incl");
            table.decimal("total_tax");
            table.text("shipping_cost_meta_data");
            table.decimal("shipping_cost");
            table.decimal("total_price_shipping_cost_excl");
            table.decimal("total_price");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_orders table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating coffee_orders table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating coffee_orders table", e)); // eslint-disable-line no-console

  return coffeeOrders;
};
