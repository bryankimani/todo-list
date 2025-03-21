# Getting started

This is a sample to-do list web-application that will be extended as part of your coding interview. Please read the notes below before you get started, and good luck!

Run `npm install` and `npm start` from the root of this directory to get started! Your tasks are defined in `INSTRUCTIONS.md`

**Make sure to fork this repository and add your final implementation to Github**. This is critical for code evaluation.

# Files

`src` contains all of our react code for this web app. For simplicity, we'll only discuss the files there.

All code in `src`, with the exception of the `pages` directory, configures the common logic that all of our routes/components are built from.

## Pages

This folder defines the pages that are rendered for the `Route` associated with each URL path. Inside we have source code and CSS for the following pages:

- Homepage
- To-do list
- Completed Tasks

# Interacting with the DB

We use json-server to create a mock server/DB based on the schema in `database/db.json`. You can perform CRUD operations on the DB using `axios`. Specifically, the following functions in `axios` represent the corresponding CRUD operations:

- Create: `axios.post`
- Read: `axios.get`
- Update: `axios.put`
- Delete: `axios.delete`

You can request all items in the DB by making a GET request to `http://localhost:3001/items`.

You can request _specific_ items in the DB by using query parameters, i.e. `http://localhost:3001/items?isComplete=false`.


# Bryan Notes on running migration file

To run the database migration file

- Ensure Node.js is Installed 
- cd path/to/your/project
- run node migration.js
- This will run the script, update the db.json file, and print a confirmation message like: Migration complete: db.json updated with new structure.

# Bryan Notes on running the project
- clone the project
- cd to the project folder
- run npm install. Make sure you have nodejs install
- run npm start to run the app

# Bryan Features

- I added the look and feel using Daisy UI
- I added the logic of filtering todo's based on their specific task group
- I added toast notifications when various actions happens like adding or deleting a todo


