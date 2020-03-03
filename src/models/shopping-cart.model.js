// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shoppingCart extends Model {
  static get tableName() {
    return "shopping_cart";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "status"],

      properties: {
        user_id: { type: "integer" },
        status: { type: "string", enum: ["Active", "Inactive", "Completed"] },
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
    .hasTable("shopping_cart")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("shopping_cart", table => {
            table.increments("id");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .enum("status", ["Active", "Inactive", "Completed"])
              .defaultTo("Active");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shopping_cart table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating shopping_cart table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating shopping_cart table", e)); // eslint-disable-line no-console

  return shoppingCart;
};
