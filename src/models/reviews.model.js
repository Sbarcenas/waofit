// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class reviews extends Model {
  static get tableName() {
    return "reviews";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type", "stars", "user_id", "type_id"],

      properties: {
        type: {
          type: "string",
          enum: ["recipe", "blog", "guide", "express-product"]
        },
        stars: { type: "integer" },
        comment: { type: "string", maxLength: 255 },
        user_id: { type: "integer" },
        type_id: { type: "integer" },
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
    .hasTable("reviews")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("reviews", table => {
            table.increments("id");
            table.enum("type", ["recipe", "blog", "guide", "express-product"]);
            table.integer("type_id");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table.integer("stars");
            table.string("comment");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created reviews table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating reviews table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating reviews table", e)); // eslint-disable-line no-console

  return reviews;
};
