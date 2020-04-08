// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class authors extends Model {
  static setup(app) {
    this.app = app;
  }
  static get tableName() {
    return "authors";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        user_id: { type: "integer" },
        name: { type: "string", maxLength: 255 },
        profile_picture: { type: "string" },
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
  if (app) {
    const db = app.get("knex");

    db.schema
      .hasTable("authors")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("authors", (table) => {
              table.increments("id");
              table
                .integer("user_id")
                .unsigned()
                .references("id")
                .inTable("users")
                .index();
              table.string("name");
              table.text("profile_picture");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created authors table")) // eslint-disable-line no-console
            .catch((e) => console.error("Error creating authors table", e)); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating authors table", e)); // eslint-disable-line no-console
  }
  return authors;
};
