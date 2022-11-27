const express = require('express');

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();


require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vczq7iu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const laptopCollection = client.db('oldLaptopbaze').collection('alldata')
        const bookingCollection = client.db('oldLaptopbaze').collection('bookings')
        const userCollection = client.db('oldLaptopbaze').collection('users')

        app.get('/alldata', async (req, res) => {
            const model = req.query.model;
            const query = {};
            const data = await laptopCollection.find(query).toArray();

            res.send(data)
        })



        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)

        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })




    }
    finally {

    }
}
run().catch(console.log);




const homedisplaylap = require('./Homedata.json');
const laptopdetails = require('./Alldata.json');
const { query } = require('express');

app.get('/homeDisplay', (req, res) => {
    res.send(homedisplaylap)
})
app.get('/allLaptop', (req, res) => {
    res.send(laptopdetails)
})

app.get('/laptopdetails/:id', (req, res) => {
    const id = req.params.id;
    const selectedlaptop = laptopdetails.find(n => n.id == id)
    res.send(selectedlaptop)
})

app.get('/', (req, res) => {
    res.send('loptop bazer server is running')
})


app.listen(port, () => console.log(`Loptop bazar server is running ${port}`))