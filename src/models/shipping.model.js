// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shipping extends Model {
  static get tableName() {
    return "shipping";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "type_sub_order",
        "sub_order_id",
        "order_id",
        "private_notes",
        "delivery_guy_user_id",
        "shipping_status"
      ],

      properties: {
        type_sub_order: {
          type: "string",
          enum: ["express products", "coffee", "restaurant"]
        },
        sub_order_id: { type: "integer" },
        order_id: { type: "integer" },
        private_notes: { type: "string" },
        delivery_guy_user_id: { type: "integer" },
        shipping_status: { type: "integer" },
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
    .hasTable("shipping")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("shipping", table => {
            table.increments("id");
            table.integer("sub_order_id");
            table.enum("type_sub_order", [
              "express products",
              "coffee",
              "restaurant"
            ]);
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index();
            table
              .integer("delivery_guy_user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .integer("shipping_status_id")
              .unsigned()
              .references("id")
              .inTable("shipping_status")
              .index();
            table.text("private_notes");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating shipping table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating shipping table", e)); // eslint-disable-line no-console

  return shipping;
};
