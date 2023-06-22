const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
// middleware
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.get('/', (req, res) => {
    res.send("hello world, i am mostafiz")
})
// mongo db code

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.jm9b2up.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const toysCollections = client.db('toys').collection('toy');
        const addToyCollections = client.db('toys').collection('addToy');

        app.get('/alltoys', async (req, res) => {
            const cursor = toysCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // retrive data 
        app.get('/addAToy', async (req, res) => {
            const cursor = addToyCollections.find()
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/addAToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addToyCollections.findOne(query);
            res.send(result);
        })
        app.put('/addAToy/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;
            console.log(updatedToy);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description
                }
            }
            const result = await addToyCollections.updateOne(filter, updatedDoc, options);
            res.send(result)
        })
        app.post('/addAToy', async (req, res) => {
            const toy = req.body;
            console.log("new toy  ", toy);
            const result = await addToyCollections.insertOne(toy);
            res.send(result)

        })
        app.delete('/addAToy/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete id ', id);
            const query = { _id: new ObjectId(id) }
            const result = await addToyCollections.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //  await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("i am running on port 5000");
})