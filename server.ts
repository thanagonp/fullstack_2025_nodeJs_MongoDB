const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/check-db-connection", async(req,res) => {
    try{
        await prisma.$connect();
        res.send({ message: "connect to the database:"+port});
    }catch(error){
        res.status(500).send({ error: "cannot connect to the database"})
    }
});

app.post('/customer/create', async (req,res) => {
    try{
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload,
        });
        res.send(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/list', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany();
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/detail/:id', async (req,res) => {
    try{
        const customer = await prisma.customer.findUnique({
            where:{
                id:req.params.id
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.put('/customer/update/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const payload = req.body;
        const customer = await prisma.customer.update({
            where:{
                id:id
            },
            data: payload
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.delete('/customer/delete/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const customer = await prisma.customer.delete({
            where:{
                id:id
            }
        });
        res.json( {message: "customer deleted successfully"});
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/contains', async (req,res) => {
    try{
        const keyword = req.body.keyword;
        const customer = await prisma.customer.findMany({
            where:{
                name:{
                    contains: keyword
                }
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.listen(3000, () => {
    console.log("SERVER IS RUNNING ON PORT "+port
    );
});