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
// const getWorkFromId= db.prepare(`
//  SELECT * FROM works WHERE id=@id
// `)

app.get('/museums',(req,res)=>{
    let museums = getMuseums.all()
    for(let museum of museums){
        const works = getWorksForMuseum.all({museumId:museum.id})
        museum.works= [works]
    }
    res.send(museums)
})

app.get('/museums/:id',(req,res)=>{
    const id = req.params.id
    const museum = getMuseumFromId.get({id:id})
    if(museum){
        const museumWorks = getWorksForMuseum.all({museumId : museum.id})
        museum.works = [museumWorks]
        res.send(museum)
    }else{
        res.status(404).send({error: "No museum found"})
    }
})

app.get('/works',(req,res)=>{
    let works = getWorks.all()
    res.send(works)
})

app.get('/works/:id',(req,res)=>{

})

app.listen(port,()=>{
    console.log("server up")
})
