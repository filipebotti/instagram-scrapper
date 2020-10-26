const Axios = require("axios");
const defaults = require("../../config/defaults");

const InstagramAPI = Axios.create({
  baseURL: defaults.INSTAGRAM_URL,
  method: "get",
  params: {
    __a: 1,
  },
});

module.exports = InstagramAPI;
