const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors())
app.use(express.json())


//DB_USER=job_portal
//DB_PASS=jobportal3235


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3mzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    //apis
    const jobscollection = client.db('job-portal').collection('jobs')
    const applycollection = client.db('jobPortal').collection('jobapply')

    app.get('/jobs' , async(req,res)=>{
        const cursor = jobscollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/jobs/:id' , async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobscollection.findOne(query)
        res.send(result)
    })

    app.post('/jobapply', async(req,res)=> {
        const application = req.body;
        const result = await applycollection.insertOne(application);
        res.send(result)
    })

    app.get('/myjob', async(req,res)=>{
        const email = req.query.email;
        const query = {applyemail: email}
        const result = await applycollection.find(query).toArray()
        res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('job is running')
})

app.listen(port, ()=> {
    console.log(`job is running on port ${port}`)
})