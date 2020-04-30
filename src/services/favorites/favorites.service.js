// Initializes the `favorites` service on path `/favorites`
const { Favorites } = require("./favorites.class");
const createModel = require("../../models/favorites.model");
const hooks = require("./favorites.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      max: 500,
      default: 100,
    },
  };

  // Initialize our service with any options it requires
  app.use("/favorites", new Favorites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("favorites");

  service.hooks(hooks);
};
