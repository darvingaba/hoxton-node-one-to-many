import Database from 'better-sqlite3'
import express from 'express'
import cors from 'cors'

const app = express()
const db = Database('./db/data.db', {verbose:console.log})
app.use(cors())
app.use(express.json())

const port = 3333

const getMuseums = db.prepare(`
 SELECT * FROM museums;
`)
const getWorks = db.prepare(`
 SELECT * FROM works;
`)
const  getWorksForMuseum= db.prepare(`
 SELECT * FROM works WHERE museumId = @museumId
`)
const getMuseumFromId = db.prepare(`
 SELECT * FROM museums WHERE id = @id
`)
const getWorkFromId= db.prepare(`
 SELECT * FROM works WHERE id=@id
`)
const createMuseum = db.prepare(`
 INSERT INTO museums(name,located)VALUES(@name,@located)
`)
const createWork = db.prepare(`
 INSERT INTO works(name,picture,museumId)VALUES(@name,@picture,@museumId)
`)

app.get('/museums',(req,res)=>{
    let museums = getMuseums.all()
    for(let museum of museums){
        const works = getWorksForMuseum.all({museumId:museum.id})
        museum.works= works
    }
    res.send(museums)
})

app.get('/museums/:id',(req,res)=>{
    const id = req.params.id
    const museum = getMuseumFromId.get({id:id})
    if(museum){
        const museumWorks = getWorksForMuseum.all({museumId : museum.id})
        museum.works = museumWorks

        res.send(museum)
    }else{
        res.status(404).send({error: "No museum found"})
    }
})

app.get('/works',(req,res)=>{
    let works = getWorks.all()
    for(let work of works){
        const museum = getMuseumFromId.get({id : work.museumId})
        work.museum =museum
    }
    res.send(works)
})

app.get('/works/:id',(req,res)=>{
    const id = req.params.id;
    const work = getWorkFromId.get({ id: id });

    if(work){
        const museum = getMuseumFromId.get({ id: work.museumId });
        work.museum=museum
        res.send(work)
    }else{
        res.status(404).send({error: "No work found"})
    }
})

app.post('/museums', (req,res)=>{
    const name = req.body.name
    const located =req.body.located

    let errors: string[] = [];

    // if (typeof name !== "string") {
    //   errors.push("Name not given.");
    // }

    // if (typeof located !== "string") {
    //   errors.push("Located not given.");
    // }
    // let museums = getMuseums.all();
    // for (let museum of museums) {
    //   if(museum.name===name){
    //     errors.push("Museum already in the db")
    //   }
    // }

    if(errors.length>0){
        res.status(404).send({errors})
    }else{
    const obj = createMuseum.run({name:name,located:located}) 
    // console.log(obj)
    const museum = getMuseumFromId.get(obj.lastInsertRowid)
    res.send(museum)
    }
})

app.post("/works", (req, res) => {
  const name = req.body.name;
  const picture = req.body.picture;
  const museumId = req.body.museumId;

  let errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Name not given.");
  }

  if (typeof picture !== "string") {
    errors.push("Picture not given.");
  }
  if (typeof museumId !== "number") {
    errors.push("MuseumId not given.");
  }
  let works = getWorks.all();
  for (let work of works) {
    if (work.name === name) {
      errors.push("Work already in the db");
    }
  }

  if (errors.length > 0) {
    res.status(404).send({ errors });
  } else {
    const obj = createWork.run({ name, picture, museumId });
    // console.log(obj)
    const work = getWorkFromId.get(obj.lastInsertRowid);
    res.send(work);
  }
});



app.listen(port,()=>{
    console.log("server up")
})
