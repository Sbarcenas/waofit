// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const { user } = context.params;

    if (!records.stars || records.stars > 5 || records.stars < 1)
      throw new NotAcceptable("Debes enviar una calificación valida.");

    if (records.comment && !records.stars)
      throw new NotAcceptable(
        `Para poder comentar un ${type} debes enviar la calificación.`
      );

    let type = null;
    switch (records.type) {
      case "express-product":
        const product = await context.app
          .service("express-products")
          .getModel()
          .query()
          .findOne({ id: records.type_id, deletedAt: null });
        if (!product) throw new NotFound("No se encontró el producto.");
        type = "producto";
        context.typeReview = "express-product";
        break;
      case "blog":
        type = "blog";
        context.typeReview = "blog";
        break;
      default:
        break;
    }

    context.id = records.type_id;

    const review = await context.app
      .service("reviews")
      .getModel()
      .query()
      .where({
        user_id: user.id,
        type: records.type,
        type_id: records.type_id,
        deletedAt: null
      })
      .then(it => it[0]);

    if (review) throw new NotAcceptable(`Ya calificaste este ${type}.`);

    records.user_id = user.id;
    replaceItems(context, records);

    return context;
  };
};
