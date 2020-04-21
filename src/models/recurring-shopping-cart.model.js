// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class recurringShoppingCart extends Model {
  static get tableName() {
    return "recurring_shopping_cart";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["status", "name", "frequency"],

      properties: {
        name: { type: "string" },
        user_id: { type: "integer" },
        status: {
          type: "string",
          enum: ["active", "inactive", "paused"],
        },
        frequency: { type: "string", enum: ["7 days", "15 days", "1 month"] },
        user_address_id: { type: "integer" },
        user_address_meta_data: { type: "string" },
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
    .hasTable("recurring_shopping_cart")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("recurring_shopping_cart", (table) => {
            table.increments("id");
            table.string("name");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .enum("status", ["active", "inactive", "paused"])
              .defaultTo("active");
            table.enum("frequency", ["7 days", "15 days", "1 month"]);
            table
              .integer("user_address_id")
              .unsigned()
              .references("id")
              .inTable("users_addresses")
              .index();
            table.text("user_address_meta_data");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created recurring_shopping_cart table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating recurring_shopping_cart table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating recurring_shopping_cart table", e)
    ); // eslint-disable-line no-console

  return recurringShoppingCart;
};
