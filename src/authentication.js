const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');
const axios = require('axios');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  class FacebookStrategy extends OAuthStrategy {
    async findEntity(req, params) {

      return await app.service('users').find({
        query: {
          $or: [
            { email: req.email }, { facebookId: req.id }
          ]
        }
      }).then(it => it.data[0]);
    }

    async updateEntity(entity, profile, params) {
      // console.log(entity, profile);
      delete profile.birthday
      delete profile.name
      profile.facebookId = profile.id
      if (entity)
        return app.service('users').patch(entity.id, profile);
    }

    async getProfile(authResult) {
      // This is the oAuth access token that can be used
      // for Facebook API requests as the Bearer token
      const accessToken = authResult.access_token;

      // console.log(accessToken);

      const { data } = await axios.get('https://graph.facebook.com/me', {
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        params: {
          // There are 
          fields: 'id,name,email,first_name,last_name,gender,birthday'
        }
      });

      return data;
    }

    async getEntityData(profile) {
      // `profile` is the data returned by getProfile
      const baseData = await super.getEntityData(profile);
      delete profile.name
      delete profile.id

      return {
        ...baseData,
        ...profile,
        email: profile.email
      };
    }
  }

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('facebook', new FacebookStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
