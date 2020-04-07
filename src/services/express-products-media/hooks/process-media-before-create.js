// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const product = await context.app
      .service("express-products")
      .getModel()
      .query()
      .where({ id: records.product_id, deletedAt: null })
      .then((it) => it[0]);

    if (!product) throw new NotFound("No se encontró el producto.");

    if (records.main == "true" || records.main == true) {
      if (records.media_type !== "normal")
        throw new NotAcceptable(
          "Las imagenes principales no pueden ser un cover."
        );

      if (records.type != "image")
        throw new NotAcceptable(
          "Las imagenes principales deben ser tipo imagen"
        );

      records.main = "true";
    }

    /* if (records.type == "video") {
      //validar la extencion del video
      if (!records.video_cover_path || !records.source_path)
        throw new NotAcceptable(
          "Debes enviar el cover del video y la ruta de donde esta guardado el video."
        );
      records.main = "false";
    } */

    replaceItems(context, records);

    return context;
  };
};
