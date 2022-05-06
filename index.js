const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());



async function run() {
    try {
        await client.connect()
        const itemCollection = client.db('dbname').collection('collectionName');

        app.get('/collectionName',async(req,res)=>{
            const query ={};
            const curser=itemCollection.find(query);
            const items =await curser.toArray();
            res.send(items)
        })
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