const cookieparser = require('cookie-parser');
const express = require('express');
const path = require('path');
const querystring = require('querystring');
const session = require('express-session');

const customerRouter = require('./handle/customer/index');
const sellerRouter = require('./handle/seller/index');

const customer = express();
const seller = express();
const app = express();

customer.set('views',path.join(__dirname,'/views/customer'));
customer.set('view engine','ejs');
customer.use('/',customerRouter);

seller.set('views',path.join(__dirname,'/views/seller'));
seller.set('view engine','ejs');
seller.use('/',sellerRouter);

app.use(express.json());
app.use(cookieparser());

app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/src')));
app.use('/customer',customer);
app.use('/seller',seller);

module.exports = app;