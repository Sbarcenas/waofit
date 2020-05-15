// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOrdersHistory extends Model {
  static get tableName() {
    return "coffee_orders_history";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["coffee_order_id", "order_status_id", "user_id"],

      properties: {
        coffee_order_id: { type: "integer" },
        order_status_id: { type: "integer" },
        user_id: { type: "integer" },
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
    .hasTable("coffee_orders_history")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_orders_history", (table) => {
            table.increments("id");
            table
              .integer("coffee_order_id")
              .unsigned()
              .references("id")
              .inTable("coffee_orders")
              .index();
            table
              .integer("order_status_id")
              .unsigned()
              .references("id")
              .inTable("orders_status")
              .index();
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index()
              .nullable();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_orders_history table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_orders_history table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_orders_history table", e)
    ); // eslint-disable-line no-console

  return coffeeOrdersHistory;
};
