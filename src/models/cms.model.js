// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class cms extends Model {
  static get tableName() {
    return "cms";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "status"],

      properties: {
        title: { type: "string" },
        body: { type: "text" },
        status: { type: "string", enum: ["active", "disactive"] },
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
    .hasTable("cms")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("cms", (table) => {
            table.increments("id");
            table.string("title");
            table.text("body");
            table.enum("status", ["active", "disactive"]);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created cms table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating cms table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating cms table", e)); // eslint-disable-line no-console

  return cms;
};
