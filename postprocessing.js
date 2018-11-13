const results = require('./results.json');

const order = () => {
  const holdingarr = [];
  for (const emoji of Object.keys(results)) {
    holdingarr.push({ name: emoji, timesused: results[emoji].length });
  }
  holdingarr.sort((a, b) => b.timesused - a.timesused);
  return holdingarr;
};

const mostemojis = ()=>{
  const holdingObj = {};
  for (const emoji of Object.keys(results)) {
    results[emoji].forEach(e=>{
      if(holdingObj.hasOwnProperty(e) ===false){
        holdingObj[e] = 1;
      }
      else{
        holdingObj[e] += 1;
      }
    })
  }
  const keysSorted = Object.keys(holdingObj).sort(function(a,b){return holdingObj[b]-holdingObj[a]})
  console.log(holdingObj[keysSorted[0]],holdingObj[keysSorted[1]]);
  return keysSorted;
};
mostemojis();
