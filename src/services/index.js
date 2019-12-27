const users = require('./users/users.service.js');
const usersAddresses = require('./users-addresses/users-addresses.service.js');
const recoveryPassword = require('./recovery-password/recovery-password.service.js');
const sendNotifications = require('./send-notifications/send-notifications.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(usersAddresses);
  app.configure(recoveryPassword);
  app.configure(sendNotifications);
};
