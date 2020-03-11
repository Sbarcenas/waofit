// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
/* const paymentConfirmation = require("../../../hooks/payment-confirmation");
 */ const {
  NotFound,
  PaymentError,
  NotAcceptable
} = require("@feathersjs/errors");
const moment = require("moment");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  // Return the actual hook.
  return async context => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove"
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
      lang: "ES",
      test: true
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
      dues: `${dataPayment.dues}`
    };

    await epayco.charge
      .create(payment_info)
      .then(async payment_info => {
        console.log(payment_info, "------------");
        if (payment_info.status === false) {
          throw new PaymentError("payment error");
        }

        console.log(payment_info, "----------");
        //obtenemos el id del product history payment
        const data = {
          order_id: parseInt(payment_info.data.factura.split("-")[1])
        };
        //respuesta de pago con exito *se actualiza pdocut history payment a pagado*
        if (payment_info.data.cod_respuesta == 1) {
          console.log("11111111111111111");
          //actualizamos el historial de pagos
          /*  const membershipPaymentHistory = await context.app
            .service("memberships-payment-history")
            .getModel()
            .findOne({
              where: { id: membershipHistoryPaymentId, deletedAt: -1 }
            });

          await context.app
            .service("memberships-payment-history")
            .getModel()
            .update(
              {
                response_gateway: JSON.stringify(payment_info),
                status: "Paga"
              },
              { where: { id: membershipPaymentHistory.id, deletedAt: -1 } }
            );

          const { membership, data } = JSON.parse(
            membershipPaymentHistory.request
          );

          //calculamos la fecha sumando los dias a la fecha de hoy.
          const membershipExpires = moment(moment(), "YYYY-MM-DD HH:mm").add(
            membership.duration_days,
            "days"
          );

          //actualizamos la membresia de la empresa
          await context.app
            .service("company-membership")
            .getModel()
            .update(
              {
                membership_id: membership.id,
                total_days: membership.duration_days,
                membership_expires: membershipExpires,
                auto_renew: data.auto_renew
              },
              {
                where: {
                  company_id: membershipPaymentHistory.company_id,
                  deletedAt: -1
                }
              }
            ); */
        } else if (payment_info.data.cod_respuesta == 2) {
          await context.app
            .service("process-payment-response")
            .create({ data });
          console.log("22222222222222222222");

          //si la respuesta de epayco es 2 entonces rechazaron el pago

          /* context.app
            .service("memberships-payment-history")
            .getModel()
            .update(
              {
                response_gateway: JSON.stringify(payment_info),
                status: "Cancelada"
              },
              { where: { id: membershipPaymentHistory.id, deletedAt: -1 } }
            );
        } else if (payment_info.data.cod_respuesta == 3) {
          context.app
            .service("memberships-payment-history")
            .getModel()
            .update(
              {
                response_gateway: JSON.stringify(payment_info),
                status: "Pendiente"
              },
              { where: { id: membershipPaymentHistory.id, deletedAt: -1 } }
            ); */
        } else if (payment_info.data.cod_respuesta > 3) {
          console.log("33333333333333");

          /*  context.app
            .service("memberships-payment-history")
            .getModel()
            .update(
              {
                response_gateway: JSON.stringify(payment_info),
                status: "Cancelada"
              },
              { where: { id: membershipPaymentHistory.id, deletedAt: -1 } }
            ); */
        }
        //guardamos en payment confirmations
        /* await paymentConfirmation({
          ...payment_info,
          data: { ...payment_info.data, type: "membership", gateway: "epayco" }
        })(context); */
      })
      .catch(err => {
        console.log("err: " + err);
      });

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
