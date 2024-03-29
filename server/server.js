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

app.get("/getproductbymodel/:collection/:category/:model", async (req, res) => {
  const model = req.params.model;
  const category = req.params.category;
  const collection = req.params.collection;
  let product = [];
  for (let singleCategory of category.split("-")) {
    const foundCategory = await client
      .db("products")
      .collection(collection)
      .find({ category: singleCategory })
      .toArray();
    const foundProduct = foundCategory[0].products.find(
      (item) => item.model === model
    );
    if (foundProduct) {
      product.push(foundProduct);
    }
  }
  res.send(product);
});

app.get("/all-products", async (req, res) => {
  const products = await getAllProducts(client);
  res.send(products);
});

app.get("/c/:category", async (req, res) => {
  const category = req.params.category;
  const foundCategory = await getCategory(category);
  res.send(foundCategory);
});

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  const user = await findDocumentWithQuery(client, "email", email);
  res.send(user);
});

app.post("/save-user", async (req, res) => {
  await saveUser(client, req.body);
  res.send("ok");
});

app.delete("/remove-from-cart/:userId", async (req, res) => {
  const model = req.query.model;
  const image = req.query.image;
  const price = req.query.price;
  const userId = req.params.userId;
  const collection = client.db("users_info").collection("users");
  const result = await collection.findOne({ uid: userId });
  const filteredCart = result.cart.filter((item) => {
    return item.price !== price || item.images[0] !== image;
  });

  await client
    .db("users_info")
    .collection("users")
    .updateOne({ uid: userId }, { $set: { cart: filteredCart } });
  res.send("product removed from cart");
});

app.post("/increment-product-amount", async (req, res) => {
  const { price, image, model, userId } = req.body.body;
  const collection = client.db("users_info").collection("users");
  const result = await collection.findOne({ uid: userId });
  console.log(price);
  console.log(userId);
  const updatedCart = result.cart.map((product) => {
    if (
      product.model === model &&
      product.price === price &&
      product.images[0] === image
    ) {
      return {
        ...product,
        amount: product.amount + 1,
      };
    } else {
      return product;
    }
  });

  await client
    .db("users_info")
    .collection("users")
    .updateOne({ uid: userId }, { $set: { cart: updatedCart } });
  res.send("product amount incremented");
});

app.post("/change-product-amount", async (req, res) => {
  const { price, image, model, userId, increment } = req.body.body;
  const collection = client.db("users_info").collection("users");
  const result = await collection.findOne({ uid: userId });
  const updatedCart = result.cart.map((product) => {
    if (
      product.model === model &&
      product.price === price &&
      product.images[0] === image
    ) {
      return {
        ...product,
        amount: increment ? product.amount + 1 : product.amount - 1,
      };
    } else {
      return product;
    }
  });

  await client
    .db("users_info")
    .collection("users")
    .updateOne({ uid: userId }, { $set: { cart: updatedCart } });
  res.send("product amount incremented");
});

app.post("/postreview/:category/:catalog/:model", async (req, res) => {
  const catalog = req.params.catalog;
  const category = req.params.category;
  const model = req.params.model;
  const collection = client.db("products").collection(category);
  const document = await collection.findOne({ category: catalog });
  const products = document.products;
  const idx = products.findIndex((product) => product.model === model);
  const query = { [`products.${idx}.reviews`]: { $type: "array" } };
  const update = {
    $push: { [`products.${idx}.reviews`]: JSON.parse(req.body.body) },
  };
  await collection.updateOne(query, update);
  res.send("ok");
});

app.post("/save-to-cart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const collection = client.db("users_info").collection("users");
  const result = await collection.findOne({ uid: userId });
  const product = JSON.parse(req.body.body);
  let filteredCart = result.cart;

  const { images, model, price } = product;
  const exist = filteredCart.findIndex((item) => {
    if (
      item.model === model &&
      item.images[0] === images[0] &&
      item.price === price
    ) {
      return true;
    }
  });
  if (exist !== -1) {
    if (filteredCart[exist].amount === 5) {
      return;
    }
    filteredCart = filteredCart.map((item, idx) => {
      if (idx === exist) {
        return {
          ...item,
          amount: item.amount + 1,
        };
      } else {
        return item;
      }
    });
  } else {
    filteredCart.push(product);
  }

  await client
    .db("users_info")
    .collection("users")
    .updateOne({ uid: userId }, { $set: { cart: filteredCart } });
  res.send("product saved to cart");
});

app.get("/find-user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const collection = client.db("users_info").collection("users");
  const result = await collection.findOne({ uid: userId });
  res.send(result);
});

app.get("/getproductbyname/:name", async (req, res) => {
  const name = req.params.name;
  const db = client.db("products");
  const query = { "products.model": { $regex: name, $options: "i" } };
  const result = [];

  await new Promise((r, j) => {
    db.listCollections().forEach(async function (collname) {
      const collection = db.collection(collname.name);
      const documents = await collection.find({}).toArray();
      documents.forEach((doc) => {
        doc.products.forEach((product) => {
          const formattedModel = product.model.replace(/\s/g, "").toLowerCase();
          const formattedName = name.replace(/\s/g, "").toLowerCase();
          if (formattedModel.includes(formattedName)) {
            result.push(product);
          }
        });
      });
      r();
    });
  });
  res.send(result);
});

app.listen(PORT, async () => {
  console.log(`Сервер запустился на порту  ${PORT}`);
});

async function getCategory(category) {
  const collection = client.db("products").collection(category);
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

  await client.db("products").collection("smartphones_and_gadgets");
}

async function fillProductsDatabase() {
  await client
    .db("products")
    .collection("smartphones_and_gadgets")
    .insertMany(products.smartphones_and_gadgets);
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
    .collection("smartphones_and_gadgets")
    .find({
      brand,
    })
    .toArray();
  return result[0].mobiles;
}

async function getAllProducts(client) {
  const result = await client
    .db("products")
    .collection("smartphones_and_gadgets")
    .find()
    .toArray();

  return result;
}
