const knex = require('knex');

const dbEngine = process.env.DB || 'development';
const config = require('./knexfile.js')[dbEngine];

const db = knex(config);

module.exports = {
  insertEmoji: (emojiName, emojiLocation) => db('emojis').insert({
    name: emojiName,
    location: emojiLocation,
  }),
  insertMessage: (userID, messageText, reactionsArr) => db('messages').insert({
    user: userID,
    message: messageText,
    reactions: reactionsArr,
  }),
  readAllEmojis: () => db('emojis').then(results => results),
  getRowCount: () => db('messages').count('id'),
  getMessage: id => db('messages').where('id', id),
};
