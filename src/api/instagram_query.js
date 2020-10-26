const Axios = require("axios");
const defaults = require("../../config/defaults");

const InstagramAPI = Axios.create({
  baseURL: defaults.INSTAGRAM_QUERY_URL,
  method: "get",
});

module.exports = InstagramAPI;
