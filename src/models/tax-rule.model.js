// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class taxRule extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "tax_rule";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "value"],

      properties: {
        name: { type: "string", maxLength: 255 },
        value: { type: "number" },
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
    taxRule.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("tax_rule")
      .then(exists => {
        if (!exists) {
          db.schema
            .createTable("tax_rule", table => {
              table.increments("id");
              table.string("name");
              table.integer("value");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created tax_rule table")) // eslint-disable-line no-console
            .catch(e => console.error("Error creating tax_rule table", e)); // eslint-disable-line no-console
        }
      })
      .catch(e => console.error("Error creating tax_rule table", e)); // eslint-disable-line no-console
  }
  return taxRule;
};
