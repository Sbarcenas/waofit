// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeShopProductsAttributesSection extends Model {
  static get tableName() {
    return "coffee_shop_products_attributes_section";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "field_type"],

      properties: {
        name: { type: "string", maxLength: 255 },
        field_type: {
          type: "string",
          enum: ["unique_selection", "multiple_selection"],
        },
        position: { type: "integer" },
        max_selects: { type: "integer" },
        min_selects: { type: "integer" },
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
    .hasTable("coffee_shop_products_attributes_section")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_shop_products_attributes_section", (table) => {
            table.increments("id");
            table.string("name");
            table.enum("field_type", [
              "unique_selection",
              "multiple_selection",
            ]);
            table.integer("max_selects");
            table.integer("mim_selects");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() =>
            console.log("Created coffee_shop_products_attributes_section table")
          ) // eslint-disable-line no-console
          .catch((e) =>
            console.error(
              "Error creating coffee_shop_products_attributes_section table",
              e
            )
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error(
        "Error creating coffee_shop_products_attributes_section table",
        e
      )
    ); // eslint-disable-line no-console

  return coffeeShopProductsAttributesSection;
};
