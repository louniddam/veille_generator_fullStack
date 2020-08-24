const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const fetch = require('node-fetch');
const app = express();
let arrayOfStud = [];
let arrayOfWatch = [];
let arrayOfRandomStud = [];
let randomStud = [];

//EJS
const ejs = require('ejs');
app.set('views', './views');
app.set(`view engine`, `ejs`);
app.use(express.static(__dirname));


//Body parser
app.use(express.urlencoded({extended: true}));//Décoder le body de REQ.
app.use(express.json());

async function findStud(){
    arrayOfStud = [];
   let studNamesfetch = await fetch('http://localhost:3000/studNames');
   let studNames = await studNamesfetch.json();
   for(i = 0; i < studNames.length; i++){
       arrayOfStud.push(studNames[i].name);
   }
}

async function findWatch(){
    arrayOfWatch =[];
    let watchFetch = await fetch('http://localhost:3000/watch');
    let watch = await watchFetch.json();
    for(i = 0; i < watch.length; i++){
        arrayOfWatch.push(watch[i]);
    }
}

async function random(){
    var rand = arrayOfRandomStud[Math.floor(Math.random() * arrayOfRandomStud.length)];
    return rand;
}

async function random_stud(nb, arr){
    nb = req.body.number;
    var randomStud = [];
    for(i = 0; i < nb; i++){
        random();
        randomStud.push(rand);
        var index = arr.indexOf(rand.name);
        if (index > -1) {
          arr.splice(index, 1);
        }
    }
    return randomStud;
}



const main = async () =>{
    try {

        app.use(express.urlencoded({extended: true})); 

       app.get('/', async (req, res)=>{
        random_stud(2);
           console.log('Vous êtes a la racine');
       });

       //Index
       app.get('/page_index', async (req,res)=>{
        await findStud();
        await findWatch();
       res.render('index', {arrayOfStud, arrayOfWatch});
       });

       //List Stud
       app.get('/page_stud', async (req,res)=>{
        await findStud();
       res.render('students', {arrayOfStud});
       });

       //Assignation
       app.get('/page_assign', async (req,res)=>{
        await findStud();
        await findWatch();
       res.render('assignation', {arrayOfStud, arrayOfWatch});
       });

        //History
        app.get('/page_history', async (req,res)=>{
        await findStud();
        await findWatch();
        res.render('history', {arrayOfStud, arrayOfWatch});
        });

        //STUDENTS

       //POST a student
       app.post('/studentsPost', async (req, res) =>{
        await fetch('http://localhost:3000/studNames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name
            })
        });
        res.redirect('http://localhost:8000/page_stud');
    });

       //Delete a Student
        app.post('/delStudName', async (req,res)=>{
            const studName = await req.body.del_name;
            await fetch(`http://localhost:3000/studNames/${studName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            res.redirect('http://localhost:8000/page_stud');
        });


        //WATCH 

        //POST a Watch
        app.post('/newWatch', async (req,res)=>{
            let group =  random_stud(req.body.number, arrayOfStud);
            // randomStud;
            await fetch('http://localhost:3000/newWatch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: req.body.subject,
                    date: req.body.date,
                    number: group
                })
            });
            res.redirect('http://localhost:8000/page_assign');
            });
    

       app.listen(8000, ()=>{
           console.log("Listening on port:8000");
       });
    } catch (e) {
        console.log(e);
    }
};

main();