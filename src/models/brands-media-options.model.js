// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class brandsMediaOptions extends Model {
  static get tableName() {
    return "brands_media_options";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string", maxLength: 255 },
        description: { type: "string" },
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
    .hasTable("brands_media_options")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("brands_media_options", table => {
            table.increments("id");
            table.string("name");
            table.string("description");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created brands_media_options table")) // eslint-disable-line no-console
          .catch(e =>
            console.error("Error creating brands_media_options table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating brands_media_options table", e)); // eslint-disable-line no-console

  return brandsMediaOptions;
};
