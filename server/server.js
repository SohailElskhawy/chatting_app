const express = require('express');
const {Pool} = require('pg');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());


// sign up and return the user object
app.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const user = await client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
        await client.query('COMMIT');
        res.json(user.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }
})

// sign in and return the user object
app.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const user = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        await client.query('COMMIT');
        res.json(user.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }
})

// get All messages by chat id
app.post('/messages', async (req, res) => {
    const {chat_id} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const messages = await client.query('SELECT * FROM messages WHERE chat_id = $1', [chat_id]);
        await client.query('COMMIT');
        res.json(messages.rows);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }
})

// add message to chat id
app.post('/add-message', async (req, res) => {
    const {chat_id, message, user_id, created_at} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const newMessage = await client.query('INSERT INTO messages (chat_id, message, user_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [chat_id, message, user_id, created_at]);
        await client.query('COMMIT');
        res.json(newMessage.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }
})


// to add a friend to chat with the user will search by user name
// so we need to get all users by 
// get all users
app.get('/users', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const users = await client.query('SELECT name FROM users');
        await client.query('COMMIT');
        res.json(users.rows);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }
})

// add chat to user
app.post('/add-chat', async (req, res) => {
    const {user_id, friend_id} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const chat = await client.query('INSERT INTO chats (friend_id) VALUES ($1) RETURNING *', [friend_id]);
        await client.query('UPDATE users SET chats = array_append(chats, $1) WHERE id = $2', [chat.rows[0].id, user_id]);
        await client.query('COMMIT');
        res.json(chat.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({error: e});
    } finally {
        client.release();
    }

})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})