const InstagramAPI = require("./api/instagram");
const InstagramQueryAPI = require("./api/instagram_query");
const moment = require("./utils/moment");
const extractKeywords = require("./extractKeywords");
const extractHashtags = require("./utils/extractHashtags");

module.exports = async (insta_profile) => {
  const { data } = await InstagramAPI(insta_profile + "?__a=1");
  const user = data.graphql.user;
  const profile = {
    id: user.id,
    name: user.full_name,
    biography: user.biography,
    external_url: user.external_url,
    is_verified: true,
  };

  let postsData = user.edge_owner_to_timeline_media.edges;
  let hasPages = user.edge_owner_to_timeline_media.page_info.has_next_page;
  let endCursor = user.edge_owner_to_timeline_media.page_info.end_cursor;
  let postCount = postsData.length;
  let posts = [];

  do {
    postsData = postsData.filter(({ node }) => {
      const data = moment.unix(node.taken_at_timestamp);
      return data.month() >= 3 && data.year() >= 2020;
    });
    if (postsData.length == 0) break;

    postsData.forEach(async ({ node }) => {
      const text = node.edge_media_to_caption.edges[0].node.text;
      if (
        text.toLowerCase().includes("live") ||
        text.toLowerCase().includes("ao vivo")
      ) {
        const keywords = await extractKeywords(text);
        posts.push({
          text,
          timestamp: moment
            .unix(node.taken_at_timestamp)
            .locale("pt-br")
            .toString(),
          shortCode: node.shortcode,
          hashtags: extractHashtags(text),
          ...keywords,
        });
      }
    });

    const {
      data: { data },
    } = await InstagramQueryAPI({
      params: {
        query_hash: "9dcf6e1a98bc7f6e92953d5a61027b98",
        variables: {
          id: user.id,
          first: postCount,
          after: endCursor,
        },
      },
    });

    if (!data) break;

    postsData = data.user.edge_owner_to_timeline_media.edges;
    hasPages = data.user.edge_owner_to_timeline_media.page_info.has_next_page;
    endCursor = data.user.edge_owner_to_timeline_media.page_info.end_cursor;
    postCount += postsData.length;
  } while (hasPages);

  profile.posts = posts;
  return profile;
};
