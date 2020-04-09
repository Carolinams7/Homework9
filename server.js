const express = require('express');
const path = require('path');
const fs = require('fs');
const noteJSON = require('./db/db.json');
const PORT = process.env.PORT || 3693;

const expressapp = express();

// Serves up static files from the public folder. Anything in public/ will just be served up as the file it is
expressapp.use(express.static(path.join(__dirname, 'public')));
// Needed to display html in local browser
expressapp.use(express.static('./'));
expressapp.use(express.urlencoded({ extended: true }));
expressapp.use(express.json());


expressapp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

expressapp.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});


// API route => GET all notes (json)
expressapp.get('/api/notes', (req, res) => {
  // use fs to read the db.json file
  // return it back to the client
  res.json(noteJSON);
});

expressapp.post('/api/notes', (req, res) => {
  // get Id of last note if it exists or 0
  const lastId = noteJSON.length ? Math.max(...(noteJSON.map(note => note.id))) : 0;
    // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const id = lastId + 1;
  noteJSON.push({ id, ...req.body });
  res.json(noteJSON.slice(-1));
});




expressapp.delete('/api/notes/:id', (req, res) => {
  let note = noteJSON.find(({ id }) => id === JSON.parse(req.params.id));
  // removes object at index of note id
  noteJSON.splice(noteJSON.indexOf(note), 1);
  res.end("Your Note Has Been Removed Forever");
});

expressapp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// ###### Server ######
expressapp.listen(PORT, () => console.log(`App listening on port ${PORT}`));