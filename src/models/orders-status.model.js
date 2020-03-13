// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class ordersStatus extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "orders_status";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "description", "type"],

      properties: {
        name: { type: "string", maxLength: 255 },
        description: { type: "string" },
        type: {
          type: "string",
          enum: ["general", "express-products", "coffe"]
        },
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
  if (app) {
    const db = app.get("knex");

    db.schema
      .hasTable("orders_status")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("orders_status", table => {
              table.increments("id");
              table.string("name");
              table.text("description");
              table
                .enum("type", ["general", "express-products", "coffe"])
                .defaultTo("general");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created orders_status table")) // eslint-disable-line no-console
            .catch(e => console.error("Error creating orders_status table", e)); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating orders_status table", e)); // eslint-disable-line no-console
  }

  return ordersStatus;
};
