const { WebClient } = require("@slack/client");
require("dotenv").config();
const dbHelpers = require("./dbhelpers");

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);
//this is to tell you're being limited by the api(if this pops up slow down)
web.on("rate_limited", retryAfter => {
  console.log(
    `A request was rate limited and future requests will be paused for ${retryAfter} seconds`
  );
});

//returns a json with all the custom emoji on the channel
const emojiList = async () => {
  web.emoji.list()
    .then(async res => {
      for (const element of Object.keys(res.emoji)) {
        try {
          await  dbHelpers.insertEmoji(element, res.emoji[element]);
        } catch (err) {
          console.log(err);
        }
        
      }
      Object.keys(res.emoji).forEach(element => {
        
      });
    })
    .catch(console.error);
};

function getAllChannels() {
  // See: https://api.slack.com/methods/conversations.list#arguments
  const param = {
    exclude_archived: true,
    types: "public_channel",
    // See: https://api.slack.com/methods/conversations.list#pagination
    // We recommend no more than 200 results at a time.
    limit: 200
  };
  let channels = [];
  function pageLoaded(res) {
    channels = channels.concat(res.channels);
    if (
      res.response_metadata &&
      res.response_metadata.next_cursor &&
      res.response_metadata.next_cursor !== ""
    ) {
      // Add a 'cursor' arguments if a 'next_cursor' exists
      param.cursor = res.response_metadata.next_cursor;
      return web.conversations.list(param).then(pageLoaded);
    }
    return channels;
  }
  return web.conversations.list(param).then(pageLoaded);
}

const channelParse = chanArr => {
  return chanArr.map((e, i) => {
    return e.id;
  });
};

function getAllMessagesForSingleChannel(channelID) {
  const param = {
    channel: channelID,
    count: 200
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

const messagesToDB = async messagesArr => {
  for (let index = 0; index < messagesArr.length; index++) {
    let e = messagesArr[index];
    if (e.subtype !== "bot_message") {
      try {
        if (typeof e.reactions === "undefined") {
          e.reactions = [];
        }
        await dbHelpers.insertMessage(
          e.user,
          e.text,
          JSON.stringify(e.reactions)
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
};
// getAllChannels()
//   .then((val)=>console.log(channelParse(val)))  // prints out the list of channels
//   .catch(console.error);

// getAllMessages('C8771SARM')
//   .then((val)=>console.log(val))  // prints out the list of channels
//   .catch(console.error);

const dbFill = async () => {
  let channelList;
  try {
    await emojiList();
  } catch (err) {
    console.log(err);
  }
  try {
    channelList = await getAllChannels();
  } catch (err) {
    console.log(err);
  }
  channelList = channelParse(channelList);

  for (let index = 0; index < channelList.length; index++) {
    try {
      let chanMessages = await getAllMessagesForSingleChannel(channelList[index]);
      await messagesToDB(chanMessages);
      console.log(`${channelList[index]} done`);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(d);
  return;
};
// let test = async()=>{
//   try{
//     let results =  await dbHelpers.readAll()
//     return results;

//   }
//   catch(err){
//     console.log(err);
//   }
//   }
//   test().then(
//     (results)=>{
//       console.log(results);
//     }
//   );
dbFill();
