const emojislist = require('../slackdefaultemojis.js');
const dbHelpers = require("../dbhelpers");



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('emojis').del()
    .then(function () {
      // Inserts seed entries
      Object.keys(emojislist).forEach(element => {
        dbHelpers.insertEmoji(element,emojislist[element])
      });
    });
};
