const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");

module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    replaceItems(context, records);

    const mailjetCredentials = context.app.get("mailjet");

    const mailjet = require("node-mailjet").connect(
      mailjetCredentials.apiKey,
      mailjetCredentials.secretKey
    );

    switch (records.action) {
      case "recovery-password":
        const request = mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: "info@fithub.com.co",
                Name: "FitHub"
              },
              To: [
                {
                  Email: `${records.data.email}`,
                  Name: `${records.data.first_name} ${records.data.last_name}`
                }
              ],
              TemplateID: 1155983,
              TemplateLanguage: true,
              Subject: "recuperación de contraseña",
              Variables: {
                name: `${records.data.first_name} ${records.data.last_name}`,
                code: `${records.data.token_reset_password}`
              }
            }
          ]
        });
        request
          .then(result => {
            console.log(result.body);
          })
          .catch(err => {
            console.log(err);
          });

        break;

      default:
        break;
    }

    return context;
  };
};
