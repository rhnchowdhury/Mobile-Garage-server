const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajoxj5t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
};

async function run() {
    try {
        const phoneCollection = client.db('mobileGarage').collection('phones');
        // const categoryCollection = client.db('mobileGarage').collection('phoneCategory');
        const bookingCollection = client.db('mobileGarage').collection('booking');
        const usersCollection = client.db('mobileGarage').collection('users');

        // phone data create
        app.get('/phone', async (req, res) => {
            const query = {};
            const options = await phoneCollection.find(query).toArray();
            res.send(options);
        });



        // booking add
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        });

        //get booking data using email
        app.get('/booking', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            const query = { userEmail: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        });

        // user data create
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        // jwt token create
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.insertOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN);
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

    }
    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('mobile garage server running')
});

app.listen(port, () => console.log(`Mobile garage running on ${port}`))