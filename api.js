//Listening on Port 3000
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const URL_MONGODB = 'mongodb://localhost:27017';
const api = express();
//Body parser
api.use(express.urlencoded({extended: true}));//Décoder le body de REQ.

api.use(express.json());


const main = async () =>{
    try {
        //Me connecter à la DB
        const client = await MongoClient.connect(URL_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db('veille_generator');

        //Racine
        api.get('/', (req, res)=>{
            console.log('Vous êtes a la racine');
            res.send('yo');
        });

        //Middleware students
        api.get('/studNames', async (req,res) =>{
            res.json(await db.collection('students').find().toArray());
        });
 
        //POST a student
        api.post('/studNames', (req,res)=>{
            res.status(200);
            let student = {
              name: req.body.name,
              statut: 'unuse'
            };
            db.collection("students").insertOne(student, function (err, res) {
              if (err) throw err;
            });
            res.send("Un de plus");
        });
        
        //Delete a student
        api.delete('/studNames/:name', (req,res)=>{
            let student = {
            name : req.params.name
            };
            db.collection('students').deleteOne(student);
            res.send('Student Deleted');
        });


        //GET watch
        api.get('/watch', async (req,res) =>{
            res.json(await db.collection('watch').find().toArray());
        });

        //Post a Watch
        api.post('/newWatch',(req,res)=>{
            res.status(200);
            let watch = {
                subject: req.body.subject,
                date: req.body.date,
                group: req.body.number,
                statut: 'undone'
            };
            db.collection('watch').insertOne(watch, (err,result)=>{
                if(err) throw err;
            });
            res.send('Watch added');
        });

        api.listen(3000, ()=>{
            console.log("Listening on port:3000");
        });
    } catch (e) {
        console.log(e);
    }

    
};

main();