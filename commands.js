'use strict';

const server = require('./server'); //link to the server file
const request = require('request');
const md5 = require('md5');
const moment = require('moment');

function writeEnd(data) {
  server.res.write(data);
  server.res.end();
}

exports.square = params => {
  let num = params[0];
  if (typeof num !== 'number') writeEnd(`You can't square '${num}' because it's not a number.`);
  writeEnd(`${num} squared is ${num*num}.\n`);
};

exports.double = params => {
  let num = params[0]
  if (typeof num !== 'number') writeEnd(`You can't double '${num}' because it's not a number.`);
  writeEnd(`${num} doubled is ${num*2}.\n`);
};

exports.sum = params => {
  let str = '';
  let sum = params.reduce((acc, num) => {
    let n = parseInt(num);
    return acc + parseInt(num);
  }, 0);
  writeEnd(`The sum of those numbers is ${sum}.\n`);
};

exports.multiply = params => {
  let result = params.reduce((acc, num) => {
    return acc * num;
  });
  writeEnd(`The product of those numbers is ${result}.\n`);
};

exports.cube = params => {
  let num = params[0];
  writeEnd(`The cube of that number is ${num*num*num}.\n`)
};

exports.subtract = params => {
  let result = params.slice(1).reduce((acc, num) => {
    return acc - num;
  }, params[0]);
  writeEnd(`Subtracting those numbers results in ${result}.\n`);
};

exports.quote = params => {
  let symbol = params[0];
  let url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${symbol}`
  request(url, (err, response, body) => {
    if (err) return console.log(err);
    let obj = JSON.parse(body);
    writeEnd(`${obj.Timestamp} ${obj.Name} ${obj.LastPrice}.\n`);
  });
};

exports.gravatar = params => {
  let hash = md5(params[0]);
  writeEnd(`http://www.gravatar.com/avatar/${hash}\n`);
};

exports.analyze_sentence = params => {
  let charCount = params[0].length;
  let words = params[0].match(/[a-z]+/ig);
  let wordCount = words.length;
  let avgLength = (words.reduce((acc, word) => {
    return acc + word.length;
  }, 0) / wordCount);
  writeEnd(`Your sentence contains ${charCount} characters and ${wordCount} words with an average word length of ${avgLength}`)
};

exports.input_a_date = params => {
  let birthday = moment(params[0])
  let days = moment().diff(birthday, 'days');
  if (days) writeEnd(`That date was ${days} days ago.`);
  else writeEnd(`Sorry, but ${params[0]} is not in the proper format`)
}

exports.wordsthatsoundlike = params => {
  let url = `https://api.datamuse.com/words?sl=${params[0]}`;
  request(url, (err, response, body) => {
    if (err) return writeEnd(err);
    let json = JSON.parse(body);
    let result = '';
    json.forEach(wordObj => {
      console.log(wordObj.word, wordObj.score);
      if (wordObj.score > 94)
        result += `${wordObj.word}\n`
    });
    writeEnd(`${result}`);
  });
};

exports.rhyme = (params, cb) => {
  let url = `https://api.datamuse.com/words?rel_rhy=${params[0]}`;
  request(url, (err, response, body) => {
    if (err) return writeEnd(err);
    let json = JSON.parse(body);
    let result = '';
    json.forEach(wordObj => {
      console.log(wordObj);
      result += `${wordObj.word}\n`;
    });
    writeEnd(`${result}`);
  });
};

exports.view_commands = () => {
  let cStr = 'Here are all the commands:\n';
  for (let command in this) {
    cStr += `${command}\n`;
  }
  writeEnd(cStr);
};
