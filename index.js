const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Genius Server is running')
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u1w9v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection =client.db('geniusCar').collection('order')
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
 
        app.get('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const service=await serviceCollection.findOne(query);
            res.send(service);
        })
        //POST
        app.post('/service',async(req,res)=>{
            const newService=req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);

        })
        //DELETE
        // app.delete('/service/:id',async(res,req)=>{
        //     const id =req.params.id;
        //     const query={_id:ObjectId(id)};
        //     const result = await serviceCollection.deleteOne(query);
        //     res.sen(result);
        // })
        app.delete('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        //Order collection api
        app.post('/order',async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(console.dir);
app.listen(port, () => {
    console.log("Listening to the port", port)
})