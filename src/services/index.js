const users = require('./users/users.service.js');
const usersAddresses = require('./users-addresses/users-addresses.service.js');
const recoveryPassword = require('./recovery-password/recovery-password.service.js');
const sendNotifications = require('./send-notifications/send-notifications.service.js');
const userDeviceTokens = require('./user-device-tokens/user-device-tokens.service.js');
const locationsStates = require('./locations-states/locations-states.service.js');
const currentUser = require('./current-user/current-user.service.js');
const locationsCities = require('./locations-cities/locations-cities.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(usersAddresses);
  app.configure(recoveryPassword);
  app.configure(sendNotifications);
  app.configure(userDeviceTokens);
  app.configure(locationsStates);
  app.configure(currentUser);
  app.configure(locationsCities);
};
