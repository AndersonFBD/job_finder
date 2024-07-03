const express = require('express');
const app = express();
const db = require('./db/connection');
const bodyParser = require('body-parser');

const port = 3000

app.listen(port)

//body parser
app.use(bodyParser.urlencoded({ extended:false }));

//db
db
.authenticate()
.then(()=> {
    console.log('conectado ao banco');
})
.catch(err => {
    console.log('houve um erro', err)
});

//routes
app.get('/', (req, res) => {
    res.send('Welcome to your new app');
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));