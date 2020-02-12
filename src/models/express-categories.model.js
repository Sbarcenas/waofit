// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressCategories extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "express_categories";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", maxLength: 255 },
        parent_id: { type: "integer" },
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
    expressCategories.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("express_categories")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("express_categories", table => {
              table.increments("id");
              table.string("name");
              table.integer("parent_id");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created express_categories table")) // eslint-disable-line no-console
            .catch(e =>
              console.error("Error creating express_categories table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating express_categories table", e)); // eslint-disable-line no-console
  }
  return expressCategories;
};
