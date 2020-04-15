// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProductsRecipes extends Model {
  static get tableName() {
    return "express_products_recipes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["express_product_id", "recipe_id"],

      properties: {
        express_product_id: { type: "integer" },
        recipe_id: { type: "integer" },
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
    .hasTable("express_products_recipes")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("express_products_recipes", (table) => {
            table.increments("id");
            table
              .integer("express_product_id")
              .unsigned()
              .references("id")
              .inTable("express_products")
              .index();
            table
              .integer("recipe_id")
              .unsigned()
              .references("id")
              .inTable("recipes")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created express_products_recipes table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating express_products_recipes table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating express_products_recipes table", e)
    ); // eslint-disable-line no-console

  return expressProductsRecipes;
};
