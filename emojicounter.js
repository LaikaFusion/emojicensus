const fs = require('fs');
const dbHelpers = require('./dbhelpers');

const count = async () => {
  const results = {};
  const notfound = [];
  const emojilist = await dbHelpers.readAllEmojis();
  emojilist.forEach((e) => {
    results[e.name] = [];
  });
  const rowTotal = await dbHelpers.getRowCount();
  for (let index = 1; index < rowTotal[0]['count(`id`)']; index += 1) {
    let lineresult;
    try {
      lineresult = await dbHelpers.getMessage(index);
    } catch (err) {
      console.error(err);
    }

    const foundEmojis = lineresult[0].message.match(/(:\w+:)/g);
    if (foundEmojis !== null) {
      foundEmojis.forEach((element) => {
        element = element.slice(1, -1);
        element = element.split('::')[0];

        if (typeof results[element] === 'undefined') {
          results[element] = [];
          notfound.push(element);
        }

        results[element].push(lineresult[0].user);
      });
    }

    if (typeof lineresult[0].reactions !== 'undefined') {
      JSON.parse(lineresult[0].reactions).forEach((e) => {
        e.name = e.name.split('::')[0];

        if (typeof results[e.name] === 'undefined') {
          results[e.name] = [];
          notfound.push(e.name);
        }
        results[e.name].push(...e.users);
      });
    }

    if (index === Math.round(rowTotal[0]['count(`id`)'] / 4)) {
      console.log('25%');
    }
    if (index === Math.round(rowTotal[0]['count(`id`)'] / 2)) {
      console.log('50%');
    }
    if (index === Math.round((rowTotal[0]['count(`id`)'] / 4) * 3)) {
      console.log('75%');
    }
  }
  console.log(notfound);
  return results;
};
count().then((val) => {
  fs.writeFileSync('results.json', `module.exports = ${JSON.stringify(val)}`, 'utf8', (err) => {
    // throws an error, you could also catch it here
    if (err) console.log(err);

    // success case, the file was saved
    console.log('Results saved!');
    process.exit();
  });
});
