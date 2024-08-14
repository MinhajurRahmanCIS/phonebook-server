const express = require('express');
const cors = require('cors');
const app = express();

const { run, contactCollection } = require('./DB');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const verifyJWT = require('./jwt');


run().catch(console.dir);


app.post('/jwt', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    res.send({ token });
});

app.get('/contacts', async (req, res) => {
    // const decoded = req.decoded;
    // if (decoded.email !== req.query.userEmail) {
    //     res.send({ message: "unauthorize access" })
    // };

    let query = {};
    if (req.query.userEmail) {
        query = {
            userEmail: req.query.userEmail
        };
    }
    const result = await contactCollection.find(query).toArray();
    console.log(result)
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


app.get('/', (req, res) => {
    res.send('PhoneBook Server is Running');
});

app.listen(port, () => {
    console.log(`PhoneBook Server is Running on ${port}`)
});