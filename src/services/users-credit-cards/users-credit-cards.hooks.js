const usersCreditCardsBC = require("./hooks/users-credit-cards-b-c");
const defaultCreditCards = require("./hooks/default-credit-cards");
const { discard, iff, isProvider } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [usersCreditCardsBC()],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard(
          "user_id",
          "credit_card_token_id",
          "owner_name",
          "customer_id",
          "cvv",
          "type_document",
          "identification_number",
          "exp_year",
          "exp_month",
          "masked_number",
          "meta_data",
          "payment_method",
          "gateway",
          "active",
          "brand",
          "city",
          "address",
          "phone",
          "cell_phone"
        )
      )
    ],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [iff(isProvider("external"), defaultCreditCards())],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
