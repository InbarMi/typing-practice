/* server/index.js */
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// enable CORS
app.use(cors({
    origin: 'http://localhost:5173'
}));

// route api to proxy
app.get('/api/sentence', async(req, res) => {
    try {
        const apiResponse = await axios.get('https://random-words-api.vercel.app/word/english/sentence');
        res.json(apiResponse.data);
    } catch (err) {
        console.error('Error proxying random-words-api: ', err.message);
        if (err.response) {
            res.status(err.response.status).json({message: err.message})
        } else {
            res.status(500).json({message: err.message});
        }
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
    console.log(`Frontend should request http://localhost:${PORT}/api/sentence`);
});