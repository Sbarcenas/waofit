// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const moment = require("moment");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);
    const { user, query } = context.params;

    const friday = 5;
    let result = {};
    if (query.quantity && query.frequency) {
      result = {
        next_delivery: moment()
          .add(query.quantity, query.frequency)
          .isoWeekday(friday)
          .format("MM-DD-YYYY"),
        next_delivery_description: `Los siguientes productos se entregaran el ${moment()
          .add(query.quantity, query.frequency)
          .isoWeekday(friday)
          .format("MM-DD-YYYY")} de 8:00 am a 12:00 pm`,
      };
    } else {
      result = {
        next_delivery: moment()
          .add(1, "weeks")
          .isoWeekday(friday)
          .format("MM-DD-YYYY"),
        next_delivery_description: `Los siguientes productos se entregaran el ${moment()
          .add(1, "weeks")
          .isoWeekday(friday)
          .format("MM-DD-YYYY")} de 8:00 am a 12:00 pm`,
      };
    }

    context.result = result;

    replaceItems(context, records);

    return context;
  };
};
