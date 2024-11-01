const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

// Routers Section starts here
// Patient Routes
app.use('/api/patient/auth', require('./routes/patient-routes/authRoutes'))

app.get('/', (req, res) => {
    res.send(`Server Started on port ${port}.`);
})

app.listen(port, () => {
    console.log(`Careplus-node listening at http://localhost:${port}`)
})