const http = require('http');
const app = require('./app');

const port = 80;
app.set('port',80);
const server = http.createServer(app);
server.listen(port);

server.on('error',err=>console.log(err))
server.on('listening',()=>{
    console.log(`listening on ${server.address().address}`);
})