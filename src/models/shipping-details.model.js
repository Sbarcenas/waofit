// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shippingDetails extends Model {
  static get tableName() {
    return "shipping_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "shipping_id",
        "sub_order_id",
        "sub_order_detail_id",
        "quantity",
      ],

      properties: {
        shipping_id: { type: "integer" },
        sub_order_id: { type: "integer" },
        type_sub_order: {
          type: "string",
          enum: ["express products", "coffee", "restaurant"],
        },
        sub_order_detail_id: { type: "integer" },
        quantity: { type: "integer" },
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
    .hasTable("shipping_details")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("shipping_details", (table) => {
            table.increments("id");
            table
              .integer("shipping_id")
              .unsigned()
              .references("id")
              .inTable("shipping")
              .index();
            table.integer("sub_order_id");
            table.enum("type_sub_order", [
              "express products",
              "coffee",
              "restaurant",
            ]);
            table.integer("sub_order_detail_id");
            table.integer("quantity");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping_details table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating shipping_details table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating shipping_details table", e)); // eslint-disable-line no-console

  return shippingDetails;
};
