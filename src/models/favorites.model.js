// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class favorites extends Model {
  static get tableName() {
    return "favorites";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type", "type_id", "user_id"],

      properties: {
        type: {
          type: "string",
          enum: ["product", "brand", "blog", "guide", "recipe"],
          type_id: { type: "integer" },
          user_id: { type: "integer" },
          deletedAt: { type: "string", format: "date-time" },
        },
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
    .hasTable("favorites")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("favorites", (table) => {
            table.increments("id");
            table.enum("type", ["product", "brand", "blog", "guide", "recipe"]);
            table.integer("type_id");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created favorites table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating favorites table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating favorites table", e)); // eslint-disable-line no-console

  return favorites;
};
