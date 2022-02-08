const express = require('express');  //function
const mongoose = require('mongoose');
const students = require('./students');

const app = express();   //application object

app.use(express.json()) //turns the body into object and set t request.body properties

mongoose.connect("mongodb://localhost:27017/studentLogin", {newUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("connection successful!"))
.catch((err)=>console.log(err));

//user schema - new field roll number = 0 for students, 1 for teachers


app.listen(3000, ()=>{
    console.log('listening on port 3000');
})      //listen to port


app.get('/', (req, res)=>{
    res.json({message: "api working"})
})            //get request handled //req object - info, res - respnse sent to client

app.get('/api/students', (req, res)=>{
    res.json(students)
})                                  //get - client requests data, post - client's data saved into server

app.post('/api/students', (req, res)=>{
    // console.log(req.body)

    if(!req.body.email){
        res.status(400)
        return res.json({error: "email is required."})
    }

    const user = {
        id: students.length+1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        pass: req.body.pass
    }
    students.push(user)
    res.json(user)
})



app.put('/api/students/:id', (req, res)=>{  //update with respect to id
      
    let id = req.params.id
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let pass = req.body.pass

    let index = students.findIndex((student)=>{
        return(student.id==Number.parseInt(id))
    })

    if(index>=0){
        let std = students[index]
        std.first_name = first_name
        std.last_name = last_name
        std.email = email
        std.pass = pass
        res.json(std)
    }
    else{
        res.status(404)
        res.end()
    }

    console.log(id);
    res.json(id)
})

app.delete('/api/students/:id', (req,res)=>{
    let id = req.params.id;
    
    let index = students.findIndex((student)=>{
        return(student.id==Number.parseInt(id))
    })
 
    if(index>=0){
        let std = students[index]
        students.splice(index, 1)
        res.json(std)
    }
    else{
        res.status(404)
    }
    
})

app.post('/api/studentLogin', (req, res)=>{
    res.json(students)
})