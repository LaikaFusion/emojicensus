const knex = require("knex");
const dbEngine = process.env.DB || "development";
const config = require("./knexfile.js")[dbEngine];
const db = knex(config);

module.exports = {
  insertEmoji: (emojiName, emojiLocation) => {
    return db("emojis")
      .insert({
        name: emojiName,
        location: emojiLocation
      })
  },
  insertMessage: (userID, messageText, reactionsArr) => {
    return db("messages").insert({
      user: userID,
      text: messageText,
      reactions: reactionsArr
    });
  },
  readAll: () => {
    return db("emojis").then(results => {
      console.log(results);
      return results;
    });
  }
};
