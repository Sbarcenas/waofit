// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProductsHubs extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "express_products_hubs";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["hub_id", "product_id"],

      properties: {
        hub_id: { type: "integer" },
        product_id: { type: "integer" },
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
    expressProductsHubs.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("express_products_hubs")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("express_products_hubs", table => {
              table.increments("id");
              table
                .integer("hub_id")
                .unsigned()
                .references("id")
                .inTable("express_hubs")
                .index();
              table
                .integer("product_id")
                .unsigned()
                .references("id")
                .inTable("express_products")
                .index();
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created express_products_hubs table")) // eslint-disable-line no-console
            .catch(e =>
              console.error("Error creating express_products_hubs table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch(e =>
        console.error("Error creating express_products_hubs table", e)
      ); // eslint-disable-line no-console
  }
  return expressProductsHubs;
};
