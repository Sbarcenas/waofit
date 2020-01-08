// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common')
const { NotFound, NotAcceptable } = require('@feathersjs/errors')
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        const { user } = context.params;

        let records = getItems(context)

        const branFavorite = await context.app.service('product-brand')
            .getModel().query().where({
                id: records.product_brand_id,
                deletedAt: null
            }).then(it => it[0]);

        if (!branFavorite) throw new NotFound('No se encotro el producto.')

        const userProductBranFavorite = await context.app.service('users-product-brand-favorites')
            .getModel().query().where({
                user_id: user.id,
                product_brand_id: records.product_brand_id,
                deletedAt: null
            }).then(it => it[0]);

        if (userProductBranFavorite) throw new NotAcceptable('Ya tienes esta marca como favorita.')

        records.user_id = user.id

        replaceItems(context, records)

        return context;
    };
};
