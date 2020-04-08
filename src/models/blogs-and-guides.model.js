// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class blogsAndGuides extends Model {
  static get tableName() {
    return "blogs_and_guides";
  }

  static get relationMappings() {
    const authorsModel = require("./authors.model")();

    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: authorsModel,
        join: {
          from: "blogs_and_guides.author_id",
          to: "authors.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "type", "status"],

      properties: {
        title: { type: "string", maxLength: 255 },
        description: { type: "string" },
        image_cover: { type: "string" },
        shared_number: { type: "integer" },
        type: { type: "string", enum: ["blog", "guide"] },
        status: { type: "string", enum: ["active", "inactive"] },
        short_description: { type: "string", maxLength: 255 },
        priority: { type: "integer" },
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
    .hasTable("blogs_and_guides")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("blogs_and_guides", (table) => {
            table.increments("id");
            table.text("image_cover");
            table.string("title");
            table.text("description");
            table.text("image_cover");
            table.integer("shared_number");
            table.enum("type", ["blog", "guide"]);
            table.enum("status", ["active", "inactive"]).defaultTo("inactive");
            table.integer("priority");
            table.string("short_description");
            table.integer("author_id");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created blogs_and_guides table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating blogs_and_guides table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating blogs_and_guides table", e)); // eslint-disable-line no-console

  return blogsAndGuides;
};
