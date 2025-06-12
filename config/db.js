const { MongoClient, ServerApiVersion } = require("mongodb");

let client;

async function connectDB() {
  const uri = process.env.LOCAL_DATABASE;

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  await client.connect();
  console.log("MongoDB connected");
}

function getCollection(collectionName) {
  return client.db("carsWarehouse").collection(collectionName);
}

module.exports = { connectDB, getCollection };
