const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const proccessUsersFaceboookBC = require('./hooks/proccess-users-faceboook-b-c');
const proccessUsersFacebookBP = require('./hooks/proccess-users-facebook-b-p');
const proccessUsersBC = require('./hooks/proccess-users-b-c');
const proccessFindFacebookBC = require('./hooks/proccess-find-facebook-b-c');
const { discard, iff, isProvider } = require('feathers-hooks-common')
const { softDelete } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [
      iff(isProvider('external'),
        discard('credits','email','password','status','role','facebookId','token_reset_password')
      )
    ],
    find: [
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    get: [
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    create: [
      hashPassword('password'),
      proccessUsersFaceboookBC(),
      proccessUsersBC()
    ],
    update: [
      hashPassword('password'),
      authenticate('jwt')
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt') /* proccessUsersBC(), proccessUsersFacebookBP() */
    ],
    remove: [
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
