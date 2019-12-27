// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext, getItems, replaceItems } = require('feathers-hooks-common')
const { NotFound, BadRequest } = require('@feathersjs/errors')

module.exports = function (options = {}) {

    // Return the actual hook.
    return async (context) => {
        // Throw if the hook is being called from an unexpected location.
        checkContext(context, null, ['find', 'get', 'create', 'update', 'patch', 'remove'])

        const records = getItems(context)

        if (!records.password) {
            throw new BadRequest('Contraseña no aceptada');
        }

        const data = (await context.app.service('users').find({
            query: { token_reset_password: context.id }, paginate: false
        }))[0];

        if (!data) {
            throw new NotFound('Codigo no encontrado');
        }

        await context.app.service('users').patch(data.id, { password: records.password, token_reset_password: '' });

        context.result = {};

        delete records.token;
        delete records.password;

        replaceItems(context, records)

        return context
    };
};