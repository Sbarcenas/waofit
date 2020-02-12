// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const algolia = require("../utils/algolia/");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}, index) => {
  return async context => {
    let records = getItems(context);

    const data = options.map(it => ({ ...it, objectID: it.id }));

    const algoliaCredemtials = context.app.get("algolia");

    const Algolia = new algolia(
      `${index}`,
      algoliaCredemtials.appId,
      algoliaCredemtials.apiKey
    );

    console.log(data, "-----------------");

    Algolia.update_all(data);

    replaceItems(context, records);

    return context;
  };
};
