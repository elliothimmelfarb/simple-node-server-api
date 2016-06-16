'use strict';

const PORT = 8000;

const http = require('http');
const commands = require('./commands');

let server = http.createServer((req, res) => {

  exports.res = res; // export res for commands file

  let [ , command, ...params] = decodeURI(req.url).toLowerCase().split('/');

  if (command in commands)
    commands[command](params); //run command at key of commands export obj
  else {
    res.write(`${command} is an invalid command.\n`);
    res.end();
  }
});

server.listen(PORT, err => {
  console.log(`Server listening on port ${PORT}`)
});
