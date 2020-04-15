// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const sha256 = require("sha256");
const { PaymentError } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const epaycoCredentials = context.app.get("epayco");

    const signature = sha256(
      epaycoCredentials.P_CUST_ID_CLIENTE +
        "^" +
        epaycoCredentials.P_KEY +
        "^" +
        records.x_ref_payco +
        "^" +
        records.x_transaction_id +
        "^" +
        records.x_amount +
        "^" +
        "COP"
    );

    if (signature !== records.x_signature) {
      throw new PaymentError("firmas no coinciden");
    }

    //obtenemos el id del product history payment
    const data = {
      order_id: parseInt(records.x_id_factura.split("-")[1]),
      response_code: parseInt(records.x_cod_response),
      payment_info: records,
    };

    const paymentConfirmation = {
      payment_reference: parseInt(records.x_ref_payco),
      invoice: records.x_id_invoice,
      description: records.x_description,
      value: parseFloat(records.x_amount),
      tax: parseFloat(records.x_tax),
      tax_base: parseInt(records.x_amount_base),
      dues: 0,
      currency: records.x_currency_code,
      bank: records.x_bank_name,
      status: records.x_response,
      response: records.x_response_reason_text,
      authorization: records.x_approval_code,
      gateway: "epayco",
      receipt: records.x_transaction_id,
      date: records.x_fecha_transaccio,
      franchise: records.x_franchise,
      cod_response: parseInt(records.x_cod_response),
      ip: records.x_customer_ip,
      type_document: records.x_customer_doctype,
      document: records.x_customer_document,
      name: records.x_customer_name,
      last_name: records.x_customer_lastname,
      email: records.x_customer_email,
      in_tests: records.x_test_request,
      city: records.x_customer_city,
      address: records.x_customer_address,
      ind_country: records.x_customer_ind_pais,
      deletedAt: null,
    };

    const [paymentConfirmationCreate, x] = await Promise.all([
      context.app.service("payment-confirmations").create(paymentConfirmation),
      context.app.service("process-payment-response").create({ ...data }),
    ]);

    await context.app
      .service("orders")
      .getModel()
      .query()
      .patch({
        payment_id: paymentConfirmationCreate.id,
        payment_meta_data: JSON.stringify(paymentConfirmation),
      })
      .where({ id: data.order_id });

    replaceItems(context, records);

    return context;
  };
};
