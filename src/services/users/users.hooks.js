const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const proccessUsersFaceboookBC = require('./hooks/proccess-users-faceboook-b-c');
const proccessUsersFacebookBP = require('./hooks/proccess-users-facebook-b-p');
const proccessUsersBC = require('./hooks/proccess-users-b-c');
const proccessFindFacebookBC = require('./hooks/proccess-find-facebook-b-c');
const { discard, iff, isProvider, disallow } = require('feathers-hooks-common')
const { softDelete } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    get: [
      authenticate('jwt'),
      proccessFindFacebookBC()
    ],
    create: [
      iff(isProvider('external'),
        discard('credits','status','role','facebookId','token_reset_password')
      ),
      hashPassword('password'),
      proccessUsersFaceboookBC(),
      proccessUsersBC()
    ],
    update: [
      disallow("external")
    ],
    patch: [
      iff(isProvider('external'),
        discard('credits','status','role','facebookId','token_reset_password','password','email')
      ),
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
