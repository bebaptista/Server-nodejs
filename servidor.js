const http = require("http");
const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"Labad"
});

con.connect(function(err){
    if(err) throw err;
    console.log("Conectado!");
});

app.get("/customers", function(req,res){
    let sql = "SELECT * from customers";
    con.query(sql, function(err,result,fields){
        if(err) throw err;
        res.send(result);
    });
});

app.get("/customers/:id",function(req,res){
    let identificador = req.params.id;
    let sql = "SELECT * FROM customers WHERE customer_id="+identificador+"";
    con.query(sql, function(err,result,fields){
        if(err) throw err;
        res.send(result);
    });
});

app.get("/search",function(req,res){
    let entidade = req.query.ent;
    let first_name = req.query.first_name;
    let last_name = req.query.last_name;
    let sql = "SELECT * FROM "+entidade+" WHERE first_name='"+first_name+"' AND last_name='"+last_name+"'";
    if(first_name==undefined) sql="SELECT * FROM "+entidade+" WHERE last_name='"+last_name+"'";
    else if(last_name==undefined) sql="SELECT * FROM "+entidade+" WHERE first_name='"+first_name+"'";
    con.query(sql, function(err,result,fields){
        if(err) throw err;
        res.send(result);
    });
});

app.get("/orders",function(req,res){
    let customer_id = req.query.customer_id;
    let sql = "SELECT * FROM orders WHERE customer_id="+customer_id+"";
    con.query(sql, function(err,result,fields){
        if(err) throw err;
        res.send(result);
    });
});

app.post("/customers",jsonParser,function(req,res){
    if(!req.body) return res.sendStatus(400);
    else {
        let id = req.body.id;
        let first_name = req.body.first_name.toString();
        let last_name = req.body.last_name.toString();
        let favorite_website = req.body.favorite_website.toString();
        let sql = "INSERT INTO customers(customer_id,last_name,first_name,favorite_website) VALUES ("+id+","+"'"+last_name+"',"+"'"+first_name+"',"+"'"+favorite_website+"')";
        con.query(sql,function(err,result){
            res.send("Registro adicionado");
        })
    }
});

app.put("/customers/:id",jsonParser,function(req,res){
    if(!req.body) return res.sendStatus(400);
    else {
        let id = req.params.id;
        let first_name = req.body.first_name.toString();
        let last_name = req.body.last_name.toString();
        let favorite_website = req.body.favorite_website.toString();
        let sql = "UPDATE customers SET "+"last_name='"+last_name+"', "+"first_name='"+first_name+"', "+"favorite_website='"+favorite_website+"' WHERE customer_id="+id+"";
        con.query(sql,function(err,result){
            res.send("Registro editado");
        })
    }
});

app.delete("/customers/:id",function(req,res){
    let identificador = req.params.id;
    let sql = "DELETE FROM customers WHERE customer_id="+identificador+"";
    con.query(sql, function(err,result,fields){
        if(err) throw err;
        res.send("Registro apagado");
    });
});

http.createServer(app).listen(3000,() => console.log("Servidor rodando local na porta 3000"));