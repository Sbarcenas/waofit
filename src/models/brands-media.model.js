// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class brandsMedia extends Model {
  static get tableName() {
    return "brands_media";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "type",
        "source",
        "cover_path",
        "brand_id",
        "brand_media_option_id"
      ],

      properties: {
        type: { type: "string", enum: ["image", "video"] },
        source: { type: "string", maxLength: 255 },
        cover_path: { type: "string" },
        brand_id: { type: "integer" },
        brand_media_option_id: { type: "integer" },
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
    .hasTable("brands_media")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("brands_media", table => {
            table.increments("id");
            table.enum("type", ["image", "video"]).defaultTo("image");
            table.string("source", 255);
            table.string("cover_path");
            table
              .integer("brand_id")
              .unsigned()
              .references("id")
              .inTable("brands")
              .index();
            table
              .integer("brand_media_option_id")
              .unsigned()
              .references("id")
              .inTable("brands_media_options")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created brands_media table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating brands_media table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating brands_media table", e)); // eslint-disable-line no-console

  return brandsMedia;
};
