// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class orderHistory extends Model {
  static get tableName() {
    return "order_history";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_id", "order_status_id"],

      properties: {
        order_id: { type: "integer" },
        order_status_id: { type: "integer" },
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
    .hasTable("order_history")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("order_history", table => {
            table.increments("id");
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index();
            table
              .integer("order_status_id")
              .unsigned()
              .references("id")
              .inTable("orders_status")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created order_history table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating order_history table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating order_history table", e)); // eslint-disable-line no-console

  return orderHistory;
};
