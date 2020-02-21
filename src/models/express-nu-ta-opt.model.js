// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressNuTaOpt extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "express_nu_ta_opt";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string", maxLength: 255 },
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
    expressNuTaOpt.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("express_nu_ta_opt")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("express_nu_ta_opt", table => {
              table.increments("id");
              table.string("name", 255);
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created express_nu_ta_opt table")) // eslint-disable-line no-console
            .catch(e =>
              console.error("Error creating express_nu_ta_opt table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating express_nu_ta_opt table", e)); // eslint-disable-line no-console
  }
  return expressNuTaOpt;
};
