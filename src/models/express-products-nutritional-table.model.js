// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProductsNutritionalTable extends Model {
  static get tableName() {
    return "express_products_nutritional_table";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "product_id",
        "express_nu_ta_opt_id",
        "name",
        "value",
        "value2",
        "parent_id",
        "section",
        "json"
      ],

      properties: {
        name: { type: "string", maxLength: 255 },
        product_id: { type: "integer" },
        express_nutritional_table_options_id: { type: "integer" },
        value: { type: "string", maxLength: 255 },
        value2: { type: "string", maxLength: 255 },
        parent_id: { type: "integer" },
        section: { type: "string", enum: ["a", "b", "c"] },
        position: { type: "integer" },
        json: { type: "string" },
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
    .hasTable("express_products_nutritional_table")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("express_products_nutritional_table", table => {
            table.increments("id");
            table.string("name");
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("express_products")
              .index();
            table
              .integer("express_nu_ta_opt_id")
              .unsigned()
              .references("id")
              .inTable("express_nu_ta_opt")
              .index();
            table.string("value", 255);
            table.string("value2", 255);
            table.integer("parent_id");
            table.string("section");
            table.string("position");
            table.string("json");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() =>
            console.log("Created express_products_nutritional_table table")
          ) // eslint-disable-line no-console
          .catch(e =>
            console.error(
              "Error creating express_products_nutritional_table table",
              e
            )
          ); // eslint-disable-line no-console
      }
    })
    .catch(e =>
      console.error(
        "Error creating express_products_nutritional_table table",
        e
      )
    ); // eslint-disable-line no-console

  return expressProductsNutritionalTable;
};
