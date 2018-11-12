const { WebClient } = require('@slack/client');
require('dotenv').config();
const emojislist = require('../slackdefaultemojis.js');
const dbHelpers = require('../dbhelpers');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// this is to tell you're being limited by the api(if this pops up slow down)
web.on('rate_limited', (retryAfter) => {
  console.log(
    `A request was rate limited and future requests will be paused for ${retryAfter} seconds`,
  );
});

exports.seed = knex => knex('emojis')
  .del()
  .then(async () => {
    // Inserts seed entries
    for (const element of Object.keys(emojislist)) {
      await dbHelpers.insertEmoji(element, emojislist[element]);
    }
    // gets all custom emojis
  })
  .then(async () => {
    await web.emoji
      .list()
      .then(async (res) => {
        for (const element of Object.keys(res.emoji)) {
          try {
            await dbHelpers.insertEmoji(element, res.emoji[element]);
          } catch (err) {
            console.log(err);
          }
        }
        console.log('Seed done');
      })
      .catch(console.error);
  });
