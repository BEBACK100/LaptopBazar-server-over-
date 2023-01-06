const express = require('express');

const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken')

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send('You can not access here')
    }

    const token = authHeader.split('')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbiden access' })

        }
        req.decoded = decoded;
        next();
    })
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vczq7iu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const laptopCollection = client.db('oldLaptopbaze').collection('alldata');
        const sellerCollection = client.db('oldLaptopbaze').collection('sellers');
        const bookingCollection = client.db('oldLaptopbaze').collection('bookings');
        const usersCollection = client.db('oldLaptopbaze').collection('users');
        const productsCollection = client.db('oldLaptopbaze').collection('products');
        const paymentCollection = client.db('oldLaptopbaze').collection('payments');


        const verifyAdmin = async (req, res, next) => {
            console.log('inside verifyAdmin', req.decoded.email);
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query)
            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();

        }

        app.get('/alldata', async (req, res) => {
            const model = req.query.model;
            const query = {};
            const data = await laptopCollection.find(query).toArray();

            res.send(data)
        })
        //  temporary to update price field on laptop details options

        // app.get('/addPrice', async (req, res) => {
        //     const filter = {}
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             price: 14000
        //         }
        //     }
        //     const result = await laptopCollection.updateMany(filter, updatedDoc, options);
        //     res.send(result);
        // })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);

            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);

            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.put('/users/admin/:id', async (req, res) => {


            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })


        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })


        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            console.log('Token', req.headers.authorization);
            // const decodedEmail = req.decoded.email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'your access is forbiden' });
            // }
            const query = { email: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
                return res.send({ accessToken: token })

            }
            res.status(403).send({ accessToken: '' })

        });

        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product);
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const query = {}
            const products = await productsCollection.find(query).toArray()
            res.send(products)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(filter)
            res.send(result)
        })

        // app.get('/bookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const booking = await bookingCollection.findOne(query);
        //     res.send(booking)
        // })
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const booking = await bookingCollection.findOne(query)
            res.send(booking)
        })
    }
    finally {

    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('loptop bazer server is running')
})


app.listen(port, () => console.log(`Loptop bazar server is running ${port}`))