const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("car services runing");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do24a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const collection = client.db("geniusCarServices").collection("services");

		// get all service
		app.get("/service", async (req, res) => {
			const query = {};
			const cursor = collection.find(query);
			const services = await cursor.toArray();
			res.send(services);
		});

		// find one item
		app.get("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await collection.findOne(query);
			res.send(result);
		});

		// post service
		app.post("/service", async (req, res) => {
			const service = req.body;
			const result = await collection.insertOne(service);
			res.send(result);
		});

		// delete service
		app.delete("/service/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await collection.deleteOne(query);
			res.send(result);
		});
	} finally {
	}
}

run().catch(console.dir);

app.listen(port, () => console.log("server running", port));
