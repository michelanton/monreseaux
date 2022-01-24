const express = require('express');
const userRoutes = require ('./routes/user.routes');
const postsRoutes = require ('./routes/posts.routes');
const app = express();
const path = require('path');
const helmet = require("helmet");
app.use(helmet());  

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', userRoutes);
app.use('/', postsRoutes);

module.exports = app;