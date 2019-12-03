const express = require('express');
const db = require('./data/db.js');

const server = express();


server.use(express.json()); // parses the json from the body


server.get('/', (request, response) => {
    response.send({ api: 'up and running!' })
})

server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.status(200).json(users);
    })
        .catch(error => {
            console.log('error on GET users', error);
            res
                .status(500)
                .json({ errorMessage: "error getting list ofusers from database" });
        });
});

server.post('/api/users', (req, res) => {
    const data = req.body;
    const { name, bio } = data
    if (!name || !bio) {
        res
            .status(400)
            .json({ errorMessage: ' need name and bio.' })
    } 
    else if (name && bio) {
        db.insert(req.body)
            .then(user => {
                db.findById(user.id)
                    .then(foundUser => {
                        res.status(200).json(` ${foundUser.name} was added`)
                        ;
                    })
                    .catch(() => {
                        json
                            .status(500)
                            .json({ message: 'There was an error retrieving the user' });
                    });
            })
            .catch(error => {
                res.status(500).json({ errorMessage: "error adding to the hub" })
            })
}})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            };
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The user information could not be retrieved."});
        });
});



server.delete('/hubs/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(200).json({ message: "hub removed successfully" });
            }
            else {
                res.status(404).json({ message: "hub not found" });
            }
        })
        .catch(error => {
            console.log("error on delete /hubs/:id", error);
            res.status(500).json({ errorMessage: "error removing the hub" });
        })
})


server.put('/api/users/:id', (req, res) => {    
    const { id } = req.params.id;    
    const user = req.body;
    const { name, bio } = user;
    if (!name || !bio) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user.' });
      }
      db.update(id, user)
      .then(updatedUser => {        
        if (!updatedUser) {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' });
        } else {
          res
            .status(200)
            .json({ message: 'The user information was updated successfully' });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'The user information could not be modified.' });
      });
  });


server.put('/put', (request, response) => {
    response.send(`${request} was recieved!`)
})
const port = 4000;
server.listen(port, () =>
    console.log(`\n **API running on port ${port}  **\n`)
)

