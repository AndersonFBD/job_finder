const express = require('express');
const app = express();
const path = require('path');
const {engine} = require('express-handlebars');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const port = 3000

app.listen(port)

//body parser
app.use(bodyParser.urlencoded({ extended:false }));

//handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({extname: '.handlebars',defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

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
    let search = req.query.job;
    let query = '%'+search+'%';

if(!search){
    Job.findAll({

        order: [['createdAt', 'DESC']]

    }).then(jobs =>{

        res.render('index', {

            jobs
        });

    })
    .catch(err=>console.log(err))
} else {
    Job.findAll({
        where: {title:{[Op.like]:query}},
        order: [['createdAt', 'DESC']]

    }).then(jobs =>{

        res.render('index', {

            jobs, search
        });

    }).catch(err=>console.log(err))
}

});

// jobs routes
app.use('/jobs', require('./routes/jobs'));