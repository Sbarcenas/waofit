// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProductsMedia extends Model {
  static get tableName() {
    return "express_products_media";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type", "product_id"],

      properties: {
        type: { type: "string", enum: ["video", "image"] },
        source_path: { type: "string" },
        video_cover_path: { type: "string" },
        product_id: { type: "integer" },
        media_type: { type: "string", enum: ["cover", "normal"] },
        main: { type: "string", enum: ["true", "false"] },
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
    .hasTable("express_products_media")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("express_products_media", table => {
            table.increments("id");
            table.enum("type", ["video", "image"]);
            table.string("source_path");
            table.string("video_cover_path");
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("express_products")
              .index();
            table.enum("media_type", ["cover", "normal"]);
            table.enum("main", ["true", "false"]);
            table.integer("position");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created express_products_media table")) // eslint-disable-line no-console
          .catch(e =>
            console.error("Error creating express_products_media table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch(e =>
      console.error("Error creating express_products_media table", e)
    ); // eslint-disable-line no-console

  return expressProductsMedia;
};
