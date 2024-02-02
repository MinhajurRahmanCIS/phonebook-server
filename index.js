const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.ermhfxw.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017";

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
        await client.connect();
        const database = client.db("phoneBookDB");
        const contactCollection = database.collection("contact");

        app.get('/contacts', async (req, res) => {
            const cursor = contactCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/contacts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await contactCollection.findOne(query);
            res.send(result);
        });


        app.post('/contacts', async (req, res) => {
            const contact = req.body;
            const result = await contactCollection.insertOne(contact);
            res.send(result);
        });

        app.put('/contacts/:id', async (req, res) => {
            const id = req.params.id;
            const contact = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedContact = {
                $set: {
                    name: contact.name,
                    email: contact.email,
                    mobile: contact.mobile
                }
            };
            const result = await contactCollection.updateOne(filter, updatedContact, options);
            res.send(result);
        });

        app.delete('/contacts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await contactCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("You are rocking");
    }
    finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('PhoneBook Server is Running');
});

app.listen(port, () => {
    console.log(`PhoneBook Server is Running on ${port}`)
});