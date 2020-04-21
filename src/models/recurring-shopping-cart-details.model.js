// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class recurringShoppingCartDetails extends Model {
  static get tableName() {
    return "recurring_shopping_cart_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "recurring_shopping_cart_id",
        "shop_type",
        "product_id",
        "quantity",
      ],

      properties: {
        recurring_shopping_cart_id: { type: "integer" },
        shop_type: { type: "string", enum: ["express_product", "coffee"] },
        product_id: { type: "integer" },
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
    .hasTable("recurring_shopping_cart_details")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("recurring_shopping_cart_details", (table) => {
            table.increments("id");
            table.integer("recurring_shopping_cart_id");
            table.enum("shop_type", ["express_product", "coffee"]);
            table.integer("product_id");
            table.integer("quantity");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() =>
            console.log("Created recurring_shopping_cart_details table")
          ) // eslint-disable-line no-console
          .catch((e) =>
            console.error(
              "Error creating recurring_shopping_cart_details table",
              e
            )
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating recurring_shopping_cart_details table", e)
    ); // eslint-disable-line no-console

  return recurringShoppingCartDetails;
};
