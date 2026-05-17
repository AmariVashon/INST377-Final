# Developer Manual: NBA Player Comparison

## Installation
### Node Version Manager
Ensure that NVM is installed
[Install NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)\

### Initialize NPM
Open up the current project work folder in the terminal. Initialize npm using
```bash
npm init
```

### Install Dependencies
In your current project work folder, open up the terminal and install dependencies:
```bash
npm install @supabase/supabase-js body-parser express nodemon
```

### Connect Supabase
You will need to create a Supabase account, preferably with the Github account you are using for this project\
Once you have linked your account, you must connect to the project. This will give you a Supabase key and URL that you will store in a .env file

### RapidAPI
You will need an API Key from [RapidAPI](https://rapidapi.com/kdb-sports-kdb-sports-default/api/basketball-head)\
You can create a free account and use the base plan\
Store the API Key in the .env file

### Running Code
To run the app, you can use:
```bash
npm start
```

Then, navigate to http://localhost:3000 in your browser to see changes. Changes are automatically updated when you save
your code. To see the changes, simply refresh the page.

To end a session, type Control + C on MAC and Windows

## Deployment
### Vercel
To deploy the app, use Vercel\

After creating/signing into Vercel, import the Git repository\
Make sure that you import all variables in the .env file

## Project APIs
This project uses three main API Endpoints:

### [GET] /api/db-check
This endpoint checks the database to see if a player exists. This is important for caching, since we don't need to use API requests on players that are already in our database

### [GET] /api/fetch-player
In the event that a player is not cached in our database, this endpoint fetches the player from the RapidAPI database, if they exist. It will get their playerID, which is then used to access a separate RapidAPI endpoint for their career averages

### [POST] /api/db-push
This endpoint inserts the player into the database if they are not already in it

## Bugs and Roadmaps
### Bugs
After pressing the player comparison button, there is sometimes a "stuttering" effect upon rendering the table

### Roadmaps
A big component of future development will be handling players that are not in RapidAPI's database and handling mispelled names. Being able to see the available players as a user types could aid in preventing unnecessary errors. 