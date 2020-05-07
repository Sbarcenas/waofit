// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class coffeeOptionsTemplates extends Model {
  static get tableName() {
    return "coffee_options_templates";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string", maxLength: 255 },
        status: { type: "string", enum: ["active", "inactive"] },
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
    .hasTable("coffee_options_templates")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("coffee_options_templates", (table) => {
            table.increments("id");
            table.string("name");
            table.enum("status", ["active", "inactive"]);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created coffee_options_templates table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating coffee_options_templates table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating coffee_options_templates table", e)
    ); // eslint-disable-line no-console

  return coffeeOptionsTemplates;
};
