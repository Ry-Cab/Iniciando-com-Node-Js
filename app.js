const express = require("express");
const  { randomUUID } = require("crypto");
const fs = require("fs")

const app = express();

app.use(express.json());

let products = [];

createProductFile();

app.post("/products", (request, response) => {

    const {name, price} = request.body;

    const product = {
        name,
        price,
        id: randomUUID()
    }
    
    products.push(product);
    fs.writeFile("products.json", JSON.stringify(products), (err) =>{
        if(err){
            console.log(err)
        }else{
            console.log("Produto inserido")
        }
    })

    return response.json(product)

});

app.get("/products", (request, response) => {
    return response.json(products);
})

app.get("/products/:id", (request, response) =>{
    const {id} = request.params;
    const product = products.find(product => product.id === id);

    return response.json(product);
})

app.put("/products/:id", (request, response) =>{
    const {id} = request.params;
    const {name, price} = request.body;
    
    createProductFile();
    
    const productIndex = products.findIndex(product => product.id == id);
    
    products[productIndex] ={
        ...products[productIndex],
        name,
        price
    }

    return response.json("Produto alterado com sucesso")
})

app.delete("/products/:id", (request, response) =>{
    const {id} = request.params;

    const productIndex = products.findIndex(product => product.id == id);

    products.splice(productIndex, 1);

    return response.json("Produto removido com sucesso")
})

function createProductFile(){
    fs.readFile("products.json", "utf-8", (err, data) => {
        if(err){
            console.log(err);
        }else{
            products = JSON.parse(data);
        }
    })
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"))