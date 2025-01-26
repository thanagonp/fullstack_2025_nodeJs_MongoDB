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

app.get('/customer/sortByNames', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            orderBy:{
                name: "asc"
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/whereAnd', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            where:{
                AND:[
                    {
                        name: {
                            contains: 'h'
                        }
                    },
                    {
                        email: {  
                            contains: 'g'
                        }
                    }
                ]
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/whereOr', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            where:{
                OR:[
                    {
                        name: {
                            contains: 'h'
                        }
                    },
                    {
                        email: {  
                            contains: 'g'
                        }
                    }
                ]
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/whereNot', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            where:{
                NOT:{
                    name: {
                        contains: 'h'
                    }
                }
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/whereIn', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            where:{
                id:{
                    in: [1,2,3]
                }
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/whereNotIn', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            where:{
                id:{
                    notIn: [1,2,3]
                }
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/sumCredit', async (req,res) => {
    try{
        const customer = await prisma.customer.aggregate({
            _sum:{
                credit: true
            }
        });
        res.json({ sumCredit: customer._sum.credit});
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.post('/order/create', async (req,res) => {
    try{
        const customerId = req.body.customerId;
        const amount = req.body.amount;
        const order = await prisma.order.create({
            data: {
                customerId: customerId,
                amount: amount
            }
        });
        res.send(order);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/order/list', async (req,res) => {
    try{
        const order = await prisma.order.findMany();
        res.json(order);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/listOrder/:customerId', async (req,res) => {   
    try{
        const customerId = req.params.customerId;
        const order = await prisma.order.findMany({
            where:{
                customerId:customerId
            }
        });
        res.json(order);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/listAllOrder', async (req,res) => {
    try{
        const customer = await prisma.customer.findMany({
            include:{
                orders:true
            }
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.get('/customer/listOrderAndProduct/:cutomerId', async (req,res) => {
    try{
        const customerId = req.params.customerId;      
        const customers = await prisma.customer.findMany({
            where:{
                id: customerId  
            },
            include:{
                orders:{
                    include:{
                        product:true
                    }
                }
            }
        });
        res.json(customers);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
});

app.listen(3000, () => {
    console.log("SERVER IS RUNNING ON PORT "+port
    );
});