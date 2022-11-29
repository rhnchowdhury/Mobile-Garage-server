const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajoxj5t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const phoneCollection = client.db('mobileGarage').collection('phones');
        const bookingCollection = client.db('mobileGarage').collection('booking');

        // phone data create
        app.get('/phone', async (req, res) => {
            const query = {};
            const cursor = phoneCollection.find(query)
            const options = await cursor.toArray();
            // const options1 = await iPhoneCollection.find(query).limit(2).toArray();
            res.send(options);
        });

        // booking add
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('mobile garage server running')
});

app.listen(port, () => console.log(`Mobile garage running on ${port}`))