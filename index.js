const server = require('./server/app.js');
const port = process.env.PORT || 3300;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});