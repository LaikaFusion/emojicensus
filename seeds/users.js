const { WebClient } = require('@slack/client');
require('dotenv').config();
const dbHelpers = require('../dbhelpers');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// this is to tell you're being limited by the api(if this pops up slow down)
web.on('rate_limited', (retryAfter) => {
  console.log(
    `A request was rate limited and future requests will be paused for ${retryAfter} seconds`,
  );
});
function getAllUsers() {
  // See: https://api.slack.com/methods/conversations.list#arguments
  const param = {
    // See: https://api.slack.com/methods/conversations.list#pagination
    // We recommend no more than 200 results at a time.
    limit: 200,
  };
  let users = [];
  function pageLoaded(res) {
    users = users.concat(res.members);
    if (
      res.response_metadata
      && res.response_metadata.next_cursor
      && res.response_metadata.next_cursor !== ''
    ) {
      // Add a 'cursor' arguments if a 'next_cursor' exists
      param.cursor = res.response_metadata.next_cursor;
      return web.users.list(param).then(pageLoaded);
    }
    return users;
  }
  return web.users.list(param).then(pageLoaded);
}
exports.seed = knex => knex('users')
  .del()
  .then(async () => {
    await getAllUsers()
      .then(async (re) => {
        for (let index = 0; index < re.length; index += 1) {
          try {
            await dbHelpers.insertUser(re[index].id, re[index].name.toString(), re[index].real_name);
          } catch (err) {
            console.log(err);
          }
        }
        console.log('Seed done');
      })
      .catch(console.error);
  });
