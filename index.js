const { WebClient } = require('@slack/client');
require('dotenv').config()


const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);
//this is to tell you're being limited by the api(if this pops up slow down)
web.on('rate_limited', (retryAfter) => {
  console.log(`A request was rate limited and future requests will be paused for ${retryAfter} seconds`);
});

//returns a json with all the custom emoji on the channel
const emojiList = async ()=>{

  web.emoji.list()
  .then((res) => {
    console.log( res);
  })
  .catch(console.error);

};


function getAllChannels() {
  // See: https://api.slack.com/methods/conversations.list#arguments
  const param = {
    exclude_archived: true,
    types: 'public_channel',
    // See: https://api.slack.com/methods/conversations.list#pagination
    // We recommend no more than 200 results at a time.
    limit: 200
  };
  let channels = [];
  function pageLoaded(res) {
    channels = channels.concat(res.channels);
    if (res.response_metadata && res.response_metadata.next_cursor && res.response_metadata.next_cursor !== '') {
      // Add a 'cursor' arguments if a 'next_cursor' exists
      param.cursor = res.response_metadata.next_cursor;
      return web.conversations.list(param).then(pageLoaded);
    }
    return channels;
  }
  return web.conversations.list(param).then(pageLoaded);
}

const channelParse = (chanArr)=>{
  return chanArr.map((e,i)=>{
    return e.id
  })
}
// getAllChannels()
//   .then((val)=>console.log(channelParse(val)))  // prints out the list of channels
//   .catch(console.error);


