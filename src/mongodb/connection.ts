import { MongoClient } from "mongodb";


if (!process.env.MONGODB_URI) {
    throw new Error('Undefined MONGODB_URI environment variable');
  }

const uri: string =  process.env.MONGODB_URI;
const client: MongoClient = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise