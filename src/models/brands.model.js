// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");
const softDelete = require("objection-soft-delete");

class brands extends softDelete({ columnName: "deletedAt" })(Model) {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "brands";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "status"],

      properties: {
        name: { type: "string", maxLength: 255 },
        description: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] },
        priority: { type: "integer" },
        path_logo: { type: "string" },
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
    brands.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("brands")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("brands", table => {
              table.increments("id");
              table.string("name");
              table.text("description");
              table.enum("status", ["active", "inactive"]);
              table.integer("priority").defaultTo(0);
              table.text("path_logo");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created brands table")) // eslint-disable-line no-console
            .catch(e => console.error("Error creating brands table", e)); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating brands table", e)); // eslint-disable-line no-console
  }
  return brands;
};
