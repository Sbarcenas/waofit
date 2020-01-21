// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { checkContext, getItems, replaceItems } = require('feathers-hooks-common');
const { NotAcceptable } = require('@feathersjs/errors');
// eslint-disable-next-line no-unused-vars

function make_masker_number(masked_number) {

    let number_asteric = masked_number.length - 4;
    let cadena = '*';

    masked_number = masked_number.substring(masked_number.length - 4, masked_number.length);

    for (let index = 0; index < number_asteric - 1; index++) {
        cadena = cadena + '*';
    }

    return masked_number = `${cadena}${masked_number}`;

}

async function verifyDefault(user, predetermined, context) {
    let response = null;

    if (predetermined == 'false') {

        const user_credit_card = (await context.app.service('users-credit-cards').find({
            query: { user_id: user.id }, paginate: false
        }))[0];

        if (!user_credit_card) {
            response = 'true';
        } else {
            response = 'false';
        }

    } else {

        await context.app.service('users-credit-cards').patch(null, { default: 'false' }, {
            query: { user_id: user.id }
        });

        response = 'true';
    }

    return response;
}

module.exports = (options = {}) => {
    return async context => {

        let records = getItems(context)

        const { user } = context.params

        const epaycoCredentials = context.app.get('epayco');

        const epayco = require('epayco-node')({
            apiKey: epaycoCredentials.PUBLIC_KEY,
            privateKey: epaycoCredentials.PRIVATE_KEY,
            lang: 'ES',
            test: true
        });

        const credit_info = {
            "card[number]": records.masked_number.replace(/ /g, ""),
            "card[exp_year]": `${records.exp_year}`,
            "card[exp_month]": `${records.exp_month}`,
            "card[cvc]": records.cvv
        };

        const credit_card_response = await epayco.token.create(credit_info);

        if (!credit_card_response.status) throw new NotAcceptable('Error al crear la tarjeta de credito, asegurate de que los datos sean correctos');

        const current_user = await context.app.service('users').get(user.id);

        const predetermined = await verifyDefault(user, records.default, context);

        const city = records.city_id ? await context.app.service('locations-cities').get(records.city_id).then((city) => city.name) : null;

        const customer_info = {
            token_card: credit_card_response.data.id,
            name: records.owner_name,
            email: current_user.email,
            default: predetermined,
            city: `${city}`,
            address: records.address,
            phone: records.phone,
            cell_phone: `${records.cell_phone}`
        };

        const customer_response = await epayco.customers.create(customer_info);

        if (!customer_response.status) throw new NotAcceptable('Error al crear la tarjeta de credito, asegurate de que los datos sean correctos');

        const meta_data = {
            info_credit_card: credit_card_response,
            info_customer: customer_response,
            info_current: current_user.email
        };



        records.user_id = user.id;
        records.credit_card_token_id = credit_card_response.data.id;
        records.customer_id = customer_response.data.customerId;
        records.type_document;
        records.identification_number;
        records.exp_year = parseInt(credit_card_response.card.exp_year);
        records.exp_month = parseInt(credit_card_response.card.exp_month);
        records.masked_number = make_masker_number(records.masked_number);
        records.meta_data = JSON.stringify(meta_data);
        records.payment_method = 'credit-card';
        records.gateway = 'Epayco';
        records.brand = credit_card_response.card.name;
        records.active = 1;
        records.default = predetermined;
        records.city = city;
        records.address = records.address;
        records.phone = records.phone;
        records.cell_phone = records.cell_phone;

        delete records.city_id

        replaceItems(context, records)

        return context;
    };
};
