const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        const iPhoneCollection = client.db('mobileGarage').collection('iPhone');
        const onePlusCollection = client.db('mobileGarage').collection('onePlus');
        const xiaomiCollection = client.db('mobileGarage').collection('xiaomi');

        // iphone data create
        app.get('/iphone', async (req, res) => {
            const query = {};
            // const cursor = iPhoneCollection.find(query).limit(2)
            // const options = await cursor.toArray();
            const options1 = await iPhoneCollection.find(query).limit(2).toArray();
            res.send(options1);
        });
        // app.get('/iphone', async (req, res) => {
        //     const query = {};
        //     const options = await iPhoneCollection.find(query).toArray();
        //     res.send(options);
        // })

        // onePlus data created
        app.get('/plus', async (req, res) => {
            const query = {};
            // const cursor = onePlusCollection.find(query).limit(2)
            // const options = await cursor.toArray();
            const options2 = await onePlusCollection.find(query).limit(2).toArray();
            res.send(options2);
        });

        // xiaomi data created
        app.get('/xiaomi', async (req, res) => {
            const query = {};
            // const cursor = iPhoneCollection.find(query).limit(2)
            // const options = await cursor.toArray();
            const options3 = await xiaomiCollection.find(query).limit(2).toArray();
            res.send(options3);
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