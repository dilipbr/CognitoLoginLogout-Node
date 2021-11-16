const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');

const app = express();
app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('/', (req, res, next)=>{
    console.log(req.body);
    console.log(req.params);
    console.log(req.url);
    next();
});

app.use('/auth',auth);

app.get('/', (req, res)=>{
    res.render('auth',{
        loggedIn: false,
        pageTitle: 'Login'
    });
});

app.use((req, res, next)=>{
   res.render('404', { pageTitle: 'Page Not found'});
});

app.listen(3000);

