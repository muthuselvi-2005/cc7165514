const express=require('express');
const cors= require('cors');
const fs=require('fs');
const path=require('path');

const app=express();
const PORT=5000;
const DATA_PATH=path.join(__dirname,"data","transactions.json");

app.use(cors());
app.use(express.json());

const readTransactions =()=> JSON.parse(fs.readFileSync(DATA_PATH));

const writeTransactions =(data)=>{
    fs.writeFileSync(DATA_PATH, JSON.stringify(data,null,2));
}

app.get('/',(req,res)=>{
    res.send('API is running!');
});

app.get('/api/transactions',(req,res)=>{
    try{
        const transactions= readTransactions();
        res.json(transactions);
    }
    catch(error){
        res.status(500).json({message:'Error reading transactions data'});
    }
});

app.get('/api/transactions/:id',(req,res)=>{
    const transactions=readTransactions();
    const transaction=transactions.find(t=>t.id === parseInt(req.params.id));
    if(transaction){
        res.json(transaction);
    }
    else{
        res.status(404).json({message:'Transaction not found'});
    }
});

app.post("/api/transactions",(req,res)=>{
    const transactions=readTransactions();
    const newTransaction={...req.body,id: Date.now()};
    transactions.push(newTransaction);
    writeTransactions(transactions);
    res.status(201).json(newTransaction);
});

app.put("/api/transactions/:id",(req,res)=>{
    let transactions=readTransactions();
    let id=parseInt(req.params.id);
    transactions=transactions.map((t)=>(t.id === id? {...t,...req.body}:t));
    writeTransactions(transactions);
    res.json({message:"Transaction updated successfully"});
})

app.delete("/api/transactions/:id",(req,res)=>{
    let transactions=readTransactions();
    transactions=transactions.filter(t=>t.id !== parseInt(req.params.id));
    writeTransactions(transactions);
    res.json({message:"Transaction deleted successfully"});
});

app.use((req,res)=>{
    res.status(404).json({message:"Route not found"});
});


app.listen(PORT,()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
})