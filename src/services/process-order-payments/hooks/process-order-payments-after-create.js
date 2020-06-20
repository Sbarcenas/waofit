// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
/* const paymentConfirmation = require("../../../hooks/payment-confirmation");
 */ const { PaymentError } = require("@feathersjs/errors");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    //enviar datos del pago a epayco
    const epaycoCredentials = context.app.get("epayco");

    const { dataPayment } = context;

    //cargamos las credenciales de epayco
    const epayco = require("epayco-node")({
      apiKey: epaycoCredentials.PUBLIC_KEY,
      privateKey: epaycoCredentials.PRIVATE_KEY,
      lang: "EN",
      test: true,
    });

    //consultamos al usuario - No el de la sesion
    const user_data = await context.app
      .service("users")
      .get(dataPayment.creditCard.user_id);

    //armamos el json que se le envia a epayco
    const payment_info = {
      token_card: dataPayment.creditCard.credit_card_token_id,
      customer_id: dataPayment.creditCard.customer_id,
      doc_type: dataPayment.creditCard.type_document,
      doc_number: dataPayment.creditCard.identification_number.toString(),
      name: user_data.first_name,
      last_name: user_data.last_name,
      email: user_data.email,
      bill: `FitHub-${dataPayment.order.id}`,
      description: `Pago productos`,
      value: dataPayment.order.total_price,
      tax: dataPayment.order.total_tax,
      tax_base: dataPayment.order.total_price_tax_excl,
      currency: "COP",
      dues: `${dataPayment.dues}`,
    };
    let response_epayco = null;
    await epayco.charge
      .create(payment_info)
      .then(async (payment_info) => {
        if (payment_info.status === false) {
          throw new PaymentError("payment error");
        }
        response_epayco = payment_info.data;
        //obtenemos el id del product history payment
        const data = {
          order_id: parseInt(payment_info.data.factura.split("-")[1]),
          response_code: payment_info.data.cod_respuesta,
          payment_info: payment_info.data,
        };
        //respuesta de pago con exito *se actualiza pdocut history payment a pagado*

        await context.app
          .service("process-payment-response")
          .create({ ...data });

        const paymentConfirmation = {
          payment_reference: parseInt(payment_info.data.ref_payco),
          invoice: payment_info.data.factura,
          description: payment_info.data.descripcion,
          value: parseFloat(payment_info.data.valor),
          tax: parseFloat(payment_info.data.iva),
          tax_base: parseInt(payment_info.data.baseiva),
          dues: 0,
          currency: payment_info.data.moneda,
          bank: payment_info.data.banco,
          status: payment_info.data.estado,
          response: payment_info.data.respuesta,
          authorization: payment_info.data.autorizacion,
          gateway: "epayco",
          receipt: `${payment_info.data.recibo}`,
          date: moment(payment_info.data.fecha).format("YYYY-MM-DD HH:mm:ss"),
          franchise: payment_info.data.franquicia,
          cod_response: parseInt(payment_info.data.cod_respuesta),
          ip: payment_info.data.ip,
          type_document: payment_info.data.tipo_doc,
          document: payment_info.data.documento,
          name: payment_info.data.nombres,
          last_name: payment_info.data.apellidos,
          email: payment_info.data.email,
          in_tests: (payment_info.data.enpruebas = 1 ? "TRUE" : "FALSE"),
          city: payment_info.data.ciudad,
          address: payment_info.data.direccion,
          ind_country: payment_info.data.ind_pais,
          deletedAt: null,
        };

        //guardamos en payment confirmations
        const paymentConfirmationCreated = await context.app
          .service("payment-confirmations")
          .create(paymentConfirmation);

        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({
            payment_id: paymentConfirmationCreated.id,
            payment_meta_data: JSON.stringify(response_epayco),
          })
          .where({ id: data.order_id });
      })
      .catch((err) => {
        console.log("err: " + err);
      });

    records.payment_status = response_epayco.cod_respuesta;
    records.payment_type = "credit_card";
    records.response = {
      invoice: response_epayco.factura,
      description: response_epayco.descripcion,
      response: response_epayco.respuesta,
    };

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
