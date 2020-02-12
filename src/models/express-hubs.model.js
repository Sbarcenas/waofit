// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressHubs extends Model {
  static get tableName() {
    return "express_hubs";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "path_image"],

      properties: {
        name: { type: "string", maxLength: 255 },
        path_image: { type: "string" },
        position: { type: "integer" },
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
  const db = app.get("knex");

  db.schema
    .hasTable("express_hubs")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("express_hubs", table => {
            table.increments("id");
            table.string("name", 255);
            table.string("path_image");
            table.integer("position").defaultTo(0);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created express_hubs table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating express_hubs table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating express_hubs table", e)); // eslint-disable-line no-console

  return expressHubs;
};
