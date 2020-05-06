// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeShopAttributes extends Model {
  static get tableName() {
    return "coffee_shop_attributes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string", maxLength: 255 },
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
    .hasTable("coffee_shop_attributes")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_shop_attributes", (table) => {
            table.increments("id");
            table.string("name");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_shop_attributes table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_shop_attributes table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_shop_attributes table", e)
    ); // eslint-disable-line no-console

  return coffeeShopAttributes;
};
