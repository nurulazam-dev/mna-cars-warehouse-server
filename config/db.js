import { MongoClient, ServerApiVersion } from "mongodb";

let client;

export const connectDB = async () => {
  const uri = process.env.DATABASE_URL;

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  await client.connect();
  console.log("MongoDB connected");
};

export const getCollection = (collectionName) => {
  return client.db("carsWarehouse").collection(collectionName);
};
