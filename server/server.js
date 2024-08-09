const express = require('express');
const {Pool} = require('pg');
const bodyParder = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));


const pool = new Pool({
    user:process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'chatting_app',
    password: process.env.POSTGRES_PASSWORD || '301077',
    port: process.env.POSTGRES_PORT || 5432
})

app.use(bodyParder.json());

// sign up
app.post('/signup', async (req, res) => {

})

// sign in
app.post('/signin', async (req, res) => {

})

// get All messages by chat id
app.post('/messages', async (req, res) => {

})

// add message to chat id
app.post('/add-message', async (req, res) => {

})

// to add a friend to chat with the user will search by user name
// so we need to get all users by 
// get all users

app.get('/users', async (req, res) => {
    
})