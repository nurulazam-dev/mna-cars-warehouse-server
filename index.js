const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqaue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const itemCollection = client.db('carsWarehouse').collection('item');

        app.get('/item',async(req,res)=>{
            const query ={};
            const curser=itemCollection.find(query);
            const items =await curser.toArray();
            res.send(items)
        });

        //add item
        app.post('/item', async (req, res) => {
            const addItem = req.body;
            const result = await itemCollection.insertOne(addItem);
            res.send(result)
        });

        //delete item
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result)
        });


    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('MNA CARS WAREHOUSE')
})

app.listen(port, () => {
    console.log("Running", port);
})