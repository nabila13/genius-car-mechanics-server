const express = require('express');
const { MongoClient } = require('mongodb');
const ObbjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3ibi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {

        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        console.log("database is created!!");

        //GET API
        app.get('/services', async(req, res) => {
            //use empty object inside find to get all product
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GETm single servvice
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObbjectId(id) };
            const singleservice = await servicesCollection.findOne(query);
            res.json(singleservice);


        });


        //POST API
        app.post('/services', async(req, res) => {
            console.log("post got hit", req.body);
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObbjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        });



    } finally {
        //        await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("conneted to genius car mechanics server");
});

app.get('/hello', (req, res) => {
    res.send("hello updated here");
});

app.listen(port, () => {
    console.log("conneted to genius server through port no: ", port);
})