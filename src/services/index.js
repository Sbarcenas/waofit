const users = require("./users/users.service.js");
const usersAddresses = require("./users-addresses/users-addresses.service.js");
const recoveryPassword = require("./recovery-password/recovery-password.service.js");
const sendNotifications = require("./send-notifications/send-notifications.service.js");
const userDeviceTokens = require("./user-device-tokens/user-device-tokens.service.js");
const locationsStates = require("./locations-states/locations-states.service.js");
const currentUser = require("./current-user/current-user.service.js");
const locationsCities = require("./locations-cities/locations-cities.service.js");
const usersCreditCards = require("./users-credit-cards/users-credit-cards.service.js");
const usersProductBrandFavorites = require("./users-product-brand-favorites/users-product-brand-favorites.service.js");
const credentials = require("./credentials/credentials.service.js");
const expressCategories = require("./express-categories/express-categories.service.js");
const brandsMediaOptions = require("./brands-media-options/brands-media-options.service.js");
const brandsMedia = require("./brands-media/brands-media.service.js");
const brands = require("./brands/brands.service.js");
const expressHubs = require("./express-hubs/express-hubs.service.js");
const taxRule = require("./tax-rule/tax-rule.service.js");
const expressProducts = require("./express-products/express-products.service.js");
const expressProductsHubs = require("./express-products-hubs/express-products-hubs.service.js");
const expressProductsNutritionalTable = require("./express-products-nutritional-table/express-products-nutritional-table.service.js");
const expressNuTaOpt = require("./express-nu-ta-opt/express-nu-ta-opt.service.js");
const expressProductsMedia = require("./express-products-media/express-products-media.service.js");
const reviews = require("./reviews/reviews.service.js");
const copyTemplateNutritionalTable = require('./copy-template-nutritional-table/copy-template-nutritional-table.service.js');
const authors = require('./authors/authors.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(usersAddresses);
  app.configure(recoveryPassword);
  app.configure(sendNotifications);
  app.configure(userDeviceTokens);
  app.configure(locationsStates);
  app.configure(currentUser);
  app.configure(locationsCities);
  app.configure(usersCreditCards);
  app.configure(usersProductBrandFavorites);
  app.configure(credentials);
  app.configure(expressCategories);
  app.configure(brandsMediaOptions);
  app.configure(brandsMedia);
  app.configure(brands);
  app.configure(expressHubs);
  app.configure(taxRule);
  app.configure(expressProducts);
  app.configure(expressProductsHubs);
  app.configure(expressProductsNutritionalTable);
  app.configure(expressNuTaOpt);
  app.configure(expressProductsMedia);
  app.configure(reviews);
  app.configure(copyTemplateNutritionalTable);
  app.configure(authors);
};
