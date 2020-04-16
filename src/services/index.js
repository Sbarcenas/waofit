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
const copyTemplateNutritionalTable = require("./copy-template-nutritional-table/copy-template-nutritional-table.service.js");
const authors = require("./authors/authors.service.js");
const shoppingCart = require("./shopping-cart/shopping-cart.service.js");
const shoppingCartDetails = require("./shopping-cart-details/shopping-cart-details.service.js");
const expressProductsOrders = require("./express-products-orders/express-products-orders.service.js");
const ordersStatus = require("./orders-status/orders-status.service.js");
const orders = require("./orders/orders.service.js");
const orderHistory = require("./order-history/order-history.service.js");
const expressProductsOrdersHistory = require("./express-products-orders-history/express-products-orders-history.service.js");
const expressProductsOrdersDetails = require("./express-products-orders-details/express-products-orders-details.service.js");
const shipping = require("./shipping/shipping.service.js");
const shippingStatus = require("./shipping-status/shipping-status.service.js");
const shippingDetails = require("./shipping-details/shipping-details.service.js");
const shippingHistory = require("./shipping-history/shipping-history.service.js");
const processOrderPayments = require("./process-order-payments/process-order-payments.service.js");
const processPaymentResponse = require("./process-payment-response/process-payment-response.service.js");
const paymentConfirmations = require("./payment-confirmations/payment-confirmations.service.js");
const paymentConfirmationsEpayco = require('./payment-confirmations-epayco/payment-confirmations-epayco.service.js');
const blogsAndGuides = require('./blogs-and-guides/blogs-and-guides.service.js');
const recipes = require('./recipes/recipes.service.js');
const expressProductsRecipes = require('./express-products-recipes/express-products-recipes.service.js');
const calculateNextDelivery = require('./calculate-next-delivery/calculate-next-delivery.service.js');
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
  app.configure(shoppingCart);
  app.configure(shoppingCartDetails);
  app.configure(expressProductsOrders);
  app.configure(ordersStatus);
  app.configure(orders);
  app.configure(orderHistory);
  app.configure(expressProductsOrdersHistory);
  app.configure(expressProductsOrdersDetails);
  app.configure(shipping);
  app.configure(shippingStatus);
  app.configure(shippingDetails);
  app.configure(shippingHistory);
  app.configure(processOrderPayments);
  app.configure(processPaymentResponse);
  app.configure(paymentConfirmations);
  app.configure(paymentConfirmationsEpayco);
  app.configure(blogsAndGuides);
  app.configure(recipes);
  app.configure(expressProductsRecipes);
  app.configure(calculateNextDelivery);
};
