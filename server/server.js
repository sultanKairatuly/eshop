const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient } = require("mongodb");
const PORT = 5000;
const uri =
  "mongodb+srv://sultanbek:d17i4hg4@e-shop.0tq0yni.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const products = require("./products.js");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.get("/getPhones", async (req, res) => {
  const phones = await getPhones(client, "Apple");
  res.send(JSON.stringify(phones));
});

app.get("/getphonebymodel/:brand/:model", async (req, res) => {
  const model = req.params.model;
  const brand = req.params.brand;
  const brandProducts = await client
    .db("products")
    .collection("gadgets")
    .find({ brand })
    .toArray();
  const phone = brandProducts[0].mobiles.filter(
    (mobile) => mobile.model === model
  );
  res.send(phone);
});

app.get("/all-products", async (req, res) => {
  const products = await getAllProducts(client);
  res.send(products);
});

app.get("/catalogs/:catalog", async (req, res) => {
  const catalog = req.params.catalog;
  const foundCatalog = await getCatalog(catalog);
  console.log(foundCatalog);
  res.send(foundCatalog);
});

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const user = await findDocumentWithQuery(client, "email", email);
  console.log("USER", user);
  res.send(user);
});

app.post("/save-user", async (req, res) => {
  console.log(req.body);
  await saveUser(client, req.body);
  res.send("ok");
});

app.listen(PORT, async () => {
  console.log(`Сервер запустился на порту  ${PORT}`);
});

async function getCatalog(catalog) {
  const collection = client.db("products").collection(catalog);
  const data = await collection.find().toArray();
  return data;
}

async function saveUser(client, user) {
  await client.db("users_info").collection("users").insertOne(user);
}

async function updateCurrentType(client, type, brand, model) {
  const phones = await getPhones(client, brand);
  const phone = phones.find({ model });
  const typeToUpdate = phone.types.find({ type });

  await client.db("products").collection("gadgets");
}

async function fillProductsDatabase() {
  await client
    .db("products")
    .collection("gadgets")
    .insertMany(products.gadgets);
}

async function createDocument(client, document) {
  await client.db("users_info").collection("users").insertOne(document);
}

async function createMultipleDocuments(client, documents) {
  await client.db("users_info").collection("users").insertMany(documents);
}

async function findDocumentWithQuery(client, queryName, queryValue) {
  const result = await client
    .db("users_info")
    .collection("users")
    .findOne({ [queryName]: queryValue });
  return result;
}

async function findMultipleDocuments(client) {
  const result = await client.db("users_info").collection("users");
  return result;
}

async function updateDocument(client, filterName, updatedDocument) {
  await client
    .db("users_info")
    .collection("users")
    .updateOne(filterName, { $set: updatedDocument });
}

async function deleteDocument(client, filter) {
  await client.db("users_info").collection("users").deleteOne(filter);
}

async function getAllUsers(client) {
  const result = await client
    .db("users_info")
    .collection("users")
    .find()
    .toArray();
  return result;
}

async function getPhones(client, brand) {
  const result = await client
    .db("products")
    .collection("gadgets")
    .find({
      brand,
    })
    .toArray();
  return result[0].mobiles;
}

async function getAllProducts(client) {
  const result = await client
    .db("products")
    .collection("gadgets")
    .find()
    .toArray();

  return result;
}
