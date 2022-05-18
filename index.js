const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

const app = express();

//middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@todo-app-cluster.0joox.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });







const run = async () => {
    try {

        await client.connect()
        const todoCollection = client.db("todo-collection").collection("todo")

        console.log('Connected');


        app.get('/todos', async (req, res) => {

            const response = await todoCollection.find({}).toArray()
            res.send(response)

        })
        app.post('/todos', async (req, res) => {
            const reqTodo = req.body.todo
            const todoDes = req.body.todo_des

            const todo = {
                task: reqTodo,
                description: todoDes,
                status: false
            }

            const response = await todoCollection.insertOne(todo)
            res.send({ success: true, response });

        })

        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: ObjectId(id) }

            const response = await todoCollection.deleteOne(query)
            res.send({ success: true, response });

        })

        app.put('/todos/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: true,
                },
            };

            const response = await todoCollection.updateOne(filter, updateDoc, options)
            res.send({ success: true, response });

        })


    } catch (error) {

    } finally {
        // await client.close()
    }
}

run().catch(console.dir)






app.listen(port, () => {
    console.log("Express is listening in port", port);

})



