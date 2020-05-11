// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeShopProducts extends Model {
  static get tableName() {
    return "coffee_shop_products";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "name",
        "coffee_shop_category_id",
        "tax_rule_id",
        "status",
        "price",
      ],

      properties: {
        name: { type: "string", maxLength: 255 },
        description: { type: "string" },
        regular_price: { type: "double" },
        price: { type: "double" },
        coffee_options_template_id: { type: "integer" },
        position: { type: "integer" },
        coffee_shop_category_id: { type: "integer" },
        tax_rule_id: { type: "integer" },
        status: { type: "string", enum: ["active", "inactive"] },
        image_path: { type: "string" },
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
    .hasTable("coffee_shop_products")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_shop_products", (table) => {
            table.increments("id");
            table.string("name");
            table.text("description");
            table.double("price");
            table
              .integer("coffee_options_template_id")
              .unsigned()
              .references("id")
              .inTable("coffee_options_templates")
              .index();
            table.integer("position");
            table
              .integer("coffee_shop_category_id")
              .unsigned()
              .references("id")
              .inTable("coffee_shop_categories")
              .index();
            table
              .integer("tax_rule_id")
              .unsigned()
              .references("id")
              .inTable("tax_rule")
              .index();
            table.enum("status", ["active", "inactive"]);
            table.text("image_path");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_shop_products table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_shop_products table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_shop_products table", e)
    ); // eslint-disable-line no-console

  return coffeeShopProducts;
};
