const awsS3Middleware = require("./aws-s3-middleware");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  // Add your custom middleware here. Remember that
  app.use("/s3Client", awsS3Middleware());
  // in Express, the order matters.
};
