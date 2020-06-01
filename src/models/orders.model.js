// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class orders extends Model {
  static get tableName() {
    return "orders";
  }

  static get relationMappings() {
    const orderStatusModel = require("./orders-status.model")();

    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: orderStatusModel,
        join: {
          from: "orders.order_status_id",
          to: "orders_status.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null, type: "general" });
          return buildQuery;
        },
      },
    };
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
        total_price_shipping_cost_excl: { type: "number" },
        total_shipping_cost: { type: "number" },
        payment_meta_data: { type: "string" },
        recurrent: { type: "string", enum: ["true", "false"] },
        payment_method: {
          type: "string",
          enum: ["online", "cash_on_delivery"],
        },
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
    .hasTable("orders")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("orders", (table) => {
            table.increments("id");
            table
              .integer("order_status_id")
              .unsigned()
              .references("id")
              .inTable("orders_status")
              .index();
            table.integer("shopping_cart_id");
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
            table.decimal("total_shipping_cost");
            table.text("payment_meta_data");
            table.text("shopping_cart_meta_data");
            table.enum("recurrent", ["true", "false"]).defaultTo("false");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created orders table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating orders table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating orders table", e)); // eslint-disable-line no-console

  return orders;
};
