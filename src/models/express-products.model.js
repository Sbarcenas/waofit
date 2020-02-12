// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProducts extends Model {
  static get tableName() {
    return "express_products";
  }

  static get relationMappings() {
    const expressCategoryModel = require("./express-categories.model")();
    const branModel = require("./brands.model")();
    const taxModel = require("./tax-rule.model");
    return {
      category: {
        relation: Model.HasOneRelation,
        modelClass: expressCategoryModel,
        join: {
          from: "express_products.express_category_id",
          to: "express_categories.id"
        }
      },
      brand: {
        relation: Model.HasOneRelation,
        modelClass: branModel,
        join: {
          from: "express_products.brand_id",
          to: "brands.id"
        }
      },
      tax: {
        relation: Model.HasOneRelation,
        modelClass: taxModel,
        join: {
          from: "express_products.tax_rule_id",
          to: "tax_rule.id"
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "name",
        "express_category_id",
        "brand_id",
        "regular_price",
        "price",
        "type",
        "tax_rule_id"
      ],

      properties: {
        name: { type: "string", maxlength: 255 },
        express_category_id: { type: "integer" },
        brand_id: { type: "integer" },
        regular_price: { type: "number" },
        price: { type: "number" },
        description: { type: "string" },
        ingredients: { type: "string" },
        type: { type: "string", enum: ["scheduled", "not_scheduled"] },
        express_category_path_ids: { type: "string" },
        tax_rule_id: { type: "integer" },
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
      .hasTable("express_products")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("express_products", table => {
              table.increments("id");
              table.string("name", 255);
              table
                .integer("express_category_id")
                .unsigned()
                .references("id")
                .inTable("express_categories")
                .index();
              table
                .integer("brand_id")
                .unsigned()
                .references("id")
                .inTable("brands")
                .index();
              table.float("regular_price");
              table.float("price");
              table.text("description");
              table.string("ingredients");
              table
                .enum("type", ["scheduled", "not_scheduled"])
                .defaultTo("not_scheduled");
              table.string("express_category_path_ids");
              table
                .integer("tax_rule_id")
                .unsigned()
                .references("id")
                .inTable("tax_rule")
                .index();
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created express_products table")) // eslint-disable-line no-console
            .catch(e =>
              console.error("Error creating express_products table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating express_products table", e)); // eslint-disable-line no-console
  }
  return expressProducts;
};
