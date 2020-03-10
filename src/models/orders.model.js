// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class orders extends Model {
  static get tableName() {
    return "orders";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_status_id", "shopping_cart_id"],

      properties: {
        order_status_id: { type: "integer" },
        shopping_cart_id: { type: "integer" },
        payment_id: { type: "integer" },
        total_price: { type: "number" },
        total_price_tax_excl: { type: "number" },
        total_tax: { type: "number" },
        shopping_cart_meta_data: { type: "string" },
        payment_meta_data: { type: "string" },
        deletedAt: { type: "string", format: "date-time" }
      }
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = function(app) {
  const db = app.get("knex");

  db.schema
    .hasTable("orders")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("orders", table => {
            table.increments("id");
            table
              .integer("order_status_id")
              .unsigned()
              .references("id")
              .inTable("orders_status")
              .index();
            table
              .integer("shopping_cart_id")
              .unsigned()
              .references("id")
              .inTable("shopping_cart")
              .index();
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table.integer("payment_id");
            table.decimal("total_price");
            table.decimal("total_price_tax_excl");
            table.decimal("total_tax");
            table.text("payment_meta_data");
            table.text("shopping_cart_meta_data");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created orders table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating orders table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating orders table", e)); // eslint-disable-line no-console

  return orders;
};
