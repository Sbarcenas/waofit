// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const algolia = require("../../../utils/algolia/");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}, index) => {
  return async (context) => {
    let records = getItems(context);

    const algoliaCredemtials = context.app.get("algolia");

    const Algolia = new algolia(
      "recipes",
      algoliaCredemtials.appId,
      algoliaCredemtials.apiKey
    );

    Algolia.remove(context.id);

    replaceItems(context, records);

    return context;
  };
};
