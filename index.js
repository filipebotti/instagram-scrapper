const defaults = require("./config/defaults");
const getPosts = require("./src/getPosts");

const profiles = defaults.PROFILES;
profiles.forEach(async (profile) => {
  const data = await getPosts(profile);
  console.log(data.posts);
});
