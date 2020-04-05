const http = require('http');
const { getMessages } = require('./controller/readConversation');
// can set the cronjob here to call this function
getMessages();

const PORT = process.env.PORT || 3000;
http.createServer().listen(PORT, () => {
  console.log('server is running on port ', PORT);
});
