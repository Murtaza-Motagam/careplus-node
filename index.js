const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')
const path = require('path')

connectToMongo();

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/authRoutes'))

app.get('/', (req, res) => {
    res.send(`Server Started on port ${port}.`);
})

app.listen(port, () => {
    console.log(`Travigo-node listening at http://localhost:${port}`)
})