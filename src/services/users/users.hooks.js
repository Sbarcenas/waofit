const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const proccessUsersFaceboookBC = require('./hooks/proccess-users-faceboook-b-c');
const proccessUsersFacebookBP = require('./hooks/proccess-users-facebook-b-p');
const proccessUsersBC = require('./hooks/proccess-users-b-c');
const proccessFindFacebookBC = require('./hooks/proccess-find-facebook-b-c');
const { softDelete } = require('feathers-hooks-common')


const deleted = softDelete({
  // context is the normal hook context
  deletedQuery: async context => {
    return { deletedAt: null };
  },
  removeData: async context => {
    return { deletedAt: new Date().toISOString() };
  }
});

module.exports = {
  before: {
    all: [],
    find: [
      deleted,
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    get: [
      deleted,
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    create: [
      hashPassword('password'),
      proccessUsersFaceboookBC(),
      proccessUsersBC()
    ],
    update: [
      deleted,
      hashPassword('password'),
      authenticate('jwt')
    ],
    patch: [
      deleted,
      hashPassword('password'),
      authenticate('jwt') /* proccessUsersBC(), proccessUsersFacebookBP() */
    ],
    remove: [
      deleted,
      authenticate('jwt')
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [proccessUsersFacebookBP()],
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
