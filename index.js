const { WebClient } = require('@slack/client');
require('dotenv').config();
const dbHelpers = require('./dbhelpers');

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);
// this is to tell you're being limited by the api(if this pops up slow down)
web.on('rate_limited', (retryAfter) => {
  console.log(
    `A request was rate limited and future requests will be paused for ${retryAfter} seconds`,
  );
});

// returns a json with all the custom emoji on the channel


function getAllChannels() {
  // See: https://api.slack.com/methods/conversations.list#arguments
  const param = {
    exclude_archived: true,
    types: 'public_channel',
    // See: https://api.slack.com/methods/conversations.list#pagination
    // We recommend no more than 200 results at a time.
    limit: 200,
  };
  let channels = [];
  function pageLoaded(res) {
    channels = channels.concat(res.channels);
    if (
      res.response_metadata
      && res.response_metadata.next_cursor
      && res.response_metadata.next_cursor !== ''
    ) {
      // Add a 'cursor' arguments if a 'next_cursor' exists
      param.cursor = res.response_metadata.next_cursor;
      return web.conversations.list(param).then(pageLoaded);
    }
    return channels;
  }
  return web.conversations.list(param).then(pageLoaded);
}

const channelParse = chanArr => chanArr.map((e, i) => e.id);

function getAllMessagesForSingleChannel(channelID) {
  const param = {
    channel: channelID,
  };
  let messages = [];
  function pageLoaded(res) {
    messages = messages.concat(res.messages);
    if (res.has_more && res.has_more !== false) {
      param.latest = res.messages[res.messages.length - 1].ts;
      return web.channels.history(param).then(pageLoaded);
    }
    return messages;
  }
  return web.channels.history(param).then(pageLoaded);
}

const messagesToDB = async (messagesArr) => {
  for (let index = 0; index < messagesArr.length; index += 1) {
    const e = messagesArr[index];
    if (typeof e.subtype === 'undefined') {
      try {
        if (typeof e.reactions === 'undefined') {
          e.reactions = [];
        }
        await dbHelpers.insertMessage(e.user, e.text, JSON.stringify(e.reactions));
      } catch (err) {
        console.log(err);
      }
    }
  }
};

const dbFill = async () => {
  let channelList;

  try {
    channelList = await getAllChannels();
  } catch (err) {
    console.log(err);
  }
  channelList = channelParse(channelList);

  for (let index = 0; index < channelList.length; index += 1) {
    try {
      const chanMessages = await getAllMessagesForSingleChannel(channelList[index]);
      await messagesToDB(chanMessages);
      console.log(`${channelList[index]} done`);
    } catch (err) {
      console.log(err);
    }
  }
  console.log('done all');
};

dbFill();