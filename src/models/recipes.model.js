// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class recipes extends Model {
  static get tableName() {
    return "recipes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["author_id", "title"],

      properties: {
        author_id: { type: "integer" },
        image_cover: { type: "string" },
        title: { type: "string", maxLength: 255 },
        ingredients: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] },
        preparation_description: { type: "string" },
        path_preparation_video: { type: "string" },
        cover_path_preparation_video: { type: "string" },
        nutrition_description: { type: "string" },
        shared_number: { type: "integer" },
        amount_of_people: {
          type: "string",
          enum: [
            "Para una",
            "Para dos",
            "Para tres",
            "Para cuatro",
            "Para cinco",
            "Para seis",
            "Para siete",
            "para ocho",
            "para nueve",
            "para diez",
          ],
        },
        preparation_time: { type: "string", maxLength: 255 },
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
    .hasTable("recipes")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("recipes", (table) => {
            table.increments("id");
            table
              .integer("author_id")
              .unsigned()
              .references("id")
              .inTable("authors")
              .index();
            table.text("image_cover");
            table.string("title");
            table.text("ingredients");
            table.enum("status", ["active", "inactive"]).defaultTo("inactive");
            table.text("preparation_description");
            table.text("path_preparation_video");
            table.text("cover_path_preparation_video");
            table.text("nutrition_description");
            table.integer("shared_number").defaultTo(0);
            table.enum("amount_of_people", [
              "Para una",
              "Para dos",
              "Para tres",
              "Para cuatro",
              "Para cinco",
              "Para seis",
              "Para siete",
              "para ocho",
              "para nueve",
              "para diez",
            ]);
            table.string("preparation_time");
            table.integer("priority").defaultTo(0);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created recipes table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating recipes table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating recipes table", e)); // eslint-disable-line no-console

  return recipes;
};
