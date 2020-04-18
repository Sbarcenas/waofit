// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shippingCosts extends Model {
  static get tableName() {
    return "shipping_costs";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["city_id", "polygon", "price"],

      properties: {
        name: { type: "string", maxLength: 255 },
        city_id: { type: "integer" },
        polygon: { type: "string" },
        price: { type: "number" },
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
    .hasTable("shipping_costs")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("shipping_costs", (table) => {
            table.increments("id");
            table.string("name");
            table
              .integer("city_id")
              .unsigned()
              .references("id")
              .inTable("locations-cities")
              .index();
            table.text("polygon");
            table.decimal("price");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping_costs table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating shipping_costs table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating shipping_costs table", e)); // eslint-disable-line no-console

  return shippingCosts;
};
