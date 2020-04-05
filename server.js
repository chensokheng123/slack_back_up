const http = require('http');
const { getMessages } = require('./controller/readConversation');

getMessages();

const PORT = process.env.PORT || 3000;
http.createServer().listen(PORT, () => {
  console.log('server is running on port ', PORT);
});
