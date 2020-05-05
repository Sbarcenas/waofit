const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  hashPassword,
  protect,
} = require("@feathersjs/authentication-local").hooks;
const proccessUsersFaceboookBC = require("./hooks/proccess-users-faceboook-b-c");
const proccessUsersFacebookBP = require("./hooks/proccess-users-facebook-b-p");
const proccessUsersBC = require("./hooks/proccess-users-b-c");
const proccessFindFacebookBC = require("./hooks/proccess-find-facebook-b-c");
const searchAdmin = require("./hooks/search-admin");

const {
  discard,
  iff,
  isProvider,
  disallow,
  fastJoin,
} = require("feathers-hooks-common");
const createAuthor = require("./hooks/create-author");
const updateAuthor = require("./hooks/update-author");
const removeSoftDelete = require("../../hooks/remove-softdelete");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.credit_cards, records.user_addresses] = await Promise.all([
        context.app
          .service("users-credit-cards")
          .getModel()
          .query()
          .where({ user_id: records.id, deletedAt: null }),
        context.app
          .service("users-addresses")
          .getModel()
          .query()
          .where({ user_id: records.id, deletedAt: null }),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [
      searchAdmin(),
      iff(isProvider("external"), proccessFindFacebookBC()),
    ],
    get: [searchAdmin(), iff(isProvider("external"), proccessFindFacebookBC())],
    create: [
      iff(
        isProvider("external"),
        discard("credits", "status", "role", "token_reset_password")
      ),
      hashPassword("password"),
      proccessUsersFaceboookBC(),
      proccessUsersBC(),
    ],
    update: [disallow("external")],
    patch: [
      iff(
        isProvider("external"),
        discard(
          "credits",
          "status",
          "role",
          "facebookId",
          "token_reset_password",
          "password",
          "email"
        )
      ),
      hashPassword("password"),
      /* proccessUsersBC(), proccessUsersFacebookBP() */
    ],
    remove: [authenticate("jwt"), removeSoftDelete()],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [
      /* createAuthor() */
    ],
    update: [],
    patch: [proccessUsersFacebookBP() /* updateAuthor() */],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
