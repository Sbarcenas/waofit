// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shippingCost extends Model {
  static get tableName() {
    return "shipping_cost";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["city_id", "ranges", "price"],

      properties: {
        city_id: { type: "integer" },
        ranges: { type: "string" },
        price: { type: "number" },
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
    .hasTable("shipping_cost")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("shipping_cost", (table) => {
            table.increments("id");
            table
              .integer("city_id")
              .unsigned()
              .references("id")
              .inTable("locations-cities")
              .index();
            table.string("ranges");
            table.decimal("price");
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping_cost table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating shipping_cost table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating shipping_cost table", e)); // eslint-disable-line no-console

  return shippingCost;
};
