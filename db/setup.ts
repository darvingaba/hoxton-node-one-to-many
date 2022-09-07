import Database from "better-sqlite3";

const db = Database('./db/data.db', {verbose:console.log})

const museums = [
    {
        name:"Louvre",
        located: "Paris, France"
    },
    {
        name:"The British Museum",
        located: "London, UK"
    },
    {
        name:"The Museum of Modern Art",
        located: "New York, USA"
    },
    {
        name:"Vatican Museum",
        located: "Vatican City, Vatican"
    },
]

const works = [
  {
    name: "Mona Lisa",
    picture:
      "https://art-facts.com/wp-content/uploads/2021/10/Most-famous-paintings-at-the-Louvre-Mona-Lisa.jpg.webp",
    museumId: 1,
  },
  {
    name: "Liberty Leading the People",
    picture:
      "https://artincontext.org/wp-content/uploads/2022/04/Liberty-Leading-the-People-by-Euge%CC%80ne-Delacroix.jpg",
    museumId:2
  },
];

const deleteMuseums= db.prepare(`
 DELETE FROM museums;
`)
deleteMuseums.run()


const createMuseumsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS museums(
    id INTEGER,
    name TEXT NOT NULL,
    located TEXT NOT NULL,
    PRIMARY KEY (id)
  );
`)
createMuseumsTable.run();

const createMuseum = db.prepare(`
 INSERT INTO museums(name,located) VALUES(@name,@located);
`);

for (let museum of museums) {
  createMuseum.run(museum);
}

const dropTable = db.prepare(`
DROP TABLE IF EXISTS works
`);
dropTable.run();



const createWorksTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS works(
   id INTEGER ,
   name TEXT,
   picture TEXT,
   museumId INTEGER NOT NULL,
   PRIMARY KEY (id)
  );
`);
createWorksTable.run()

const deleteWorks = db.prepare(`
 DELETE FROM works;
`)
deleteWorks.run()

const createWork = db.prepare(`
  INSERT INTO works
  (name,picture,museumId) 
  VALUES
  (@name,@picture,@museumId)
`)
for(let work of works)(
    createWork.run(work)
)

