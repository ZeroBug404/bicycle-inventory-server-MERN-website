const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fevj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const productsCollection = client.db('Bicycle-Inventory').collection('products');

        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            // console.log(products);
            res.send(products);
        })

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            // console.log(product);
            res.send(product);
        })

        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Bicycle Inventory!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})