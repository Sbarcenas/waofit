// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shippingHistory extends Model {
  static get tableName() {
    return "shipping_history";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["shipping_id", "shipping_status_id"],

      properties: {
        shipping_id: { type: "integer" },
        shipping_status_id: { type: "integer" },
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
    .hasTable("shipping_history")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("shipping_history", (table) => {
            table.increments("id");
            table
              .integer("shipping_id")
              .unsigned()
              .references("id")
              .inTable("shipping")
              .index();
            table
              .integer("shipping_status_id")
              .unsigned()
              .references("id")
              .inTable("shipping_status")
              .index();
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping_history table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating shipping_history table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating shipping_history table", e)); // eslint-disable-line no-console

  return shippingHistory;
};
