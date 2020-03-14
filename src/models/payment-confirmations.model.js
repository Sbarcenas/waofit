// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class paymentConfirmations extends Model {
  static get tableName() {
    return "payment_confirmations";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
        payment_reference: { type: "integer" },
        invoice: { type: "string", maxLength: 255 },
        description: {},
        value: { type: "number" },
        tax: { type: "number" },
        tax_base: { type: "integer" },
        dues: { type: "integer" },
        currency: { type: "string", maxLength: 5 },
        bank: { type: "string", maxLength: 255 },
        status: { type: "string", maxLength: 255 },
        response: { type: "string", maxLength: 255 },
        authorization: { type: "string", maxLength: 255 },
        gateway: { type: "string", enum: ["epayco"] },
        receipt: { type: "string", maxLength: 255 },
        date: { type: "string" },
        franchise: { type: "string", maxLength: 255 },
        cod_response: { type: "integer" },
        ip: { type: "string" },
        type_document: { type: "string", maxLength: 255 },
        document: { type: "string", maxLength: 255 },
        name: { type: "string", maxLength: 255 },
        last_name: { type: "string", maxLength: 255 },
        email: { type: "string", maxLength: 255 },
        in_tests: { type: "string" },
        city: { type: "string", maxLength: 255 },
        address: { type: "string", maxLength: 255 },
        ind_country: { type: "string", maxLength: 255 },
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
    .hasTable("payment_confirmations")
    .then(exists => {
      if (!exists) {
        db.schema
          .createTable("payment_confirmations", table => {
            table.increments("id");
            table.integer("payment_reference");
            table.string("invoice");
            table.text("description");
            table.float("value");
            table.float("tax");
            table.integer("tax_base");
            table.integer("dues");
            table.string("currency");
            table.string("bank");
            table.string("status");
            table.string("response");
            table.string("authorization");
            table.enum("gateway", ["epayco"]).defaultTo("epayco");
            table.string("receipt");
            table.string("date");
            table.string("franchise");
            table.integer("cod_response");
            table.string("ip");
            table.string("type_document");
            table.string("document");
            table.string("name");
            table.string("last_name");
            table.string("in_tests");
            table.string("email");
            table.string("city");
            table.string("address");
            table.string("ind_country");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created payment_confirmations table")) // eslint-disable-line no-console
          .catch(e =>
            console.error("Error creating payment_confirmations table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch(e => console.error("Error creating payment_confirmations table", e)); // eslint-disable-line no-console

  return paymentConfirmations;
};
