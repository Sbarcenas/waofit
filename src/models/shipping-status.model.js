// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shippingStatus extends Model {
  static get tableName() {
    return "shipping_status";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string" },
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
    .hasTable("shipping_status")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("shipping_status", table => {
            table.increments("id");
            table.string("name");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping_status table")) // eslint-disable-line no-console
          .catch(e => console.error("Error creating shipping_status table", e)); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating shipping_status table", e)); // eslint-disable-line no-console

  return shippingStatus;
};
