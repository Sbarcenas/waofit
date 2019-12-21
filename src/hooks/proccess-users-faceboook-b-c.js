// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require('moment');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    console.log('---**************------')

    if (context.data.facebookId) {

      context.data.birthday = moment(context.data.birthday).format('YYYY-MM-DD')
      delete context.data.birthday
      context.data.role = 'user'
      context.data.password = 'secret'

    }

    return context;
  };
};
