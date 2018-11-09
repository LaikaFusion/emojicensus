const emojislist = require("../slackdefaultemojis.js");
const dbHelpers = require("../dbhelpers");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("emojis")
    .del()
    .then(async function() {
      // Inserts seed entries
      for (const element of Object.keys(emojislist)) {
        await dbHelpers.insertEmoji(element, emojislist[element]);
      }
      console.log(`Seed done`);
    });
};
