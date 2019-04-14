# GoogleContacts

Coding Challange

## Contents

- [The Application](#the-application)
- [The Problem](#the-problem)
- [Focus](#focus)
- [Technologies Used](#technologies-used)
- [Other Projects](#other-projects)
- [Resume Link](#resume-link)
- [Live Demo](#live-demo)

## The Application

Try the application out [here](ec2-18-216-92-85.us-east-2.compute.amazonaws.com) or you can set it up locally with the following instructions.

### Local Setup

1. Install [PostgreSQL](https://www.postgresql.org/).
2. Install [Node.js](https://nodejs.org/en/).
3. Retrieve credentials for [Google's API](https://console.developers.google.com).
4. Clone this repository.

```
$ git clone https://github.com/Tmunayyer/GoogleContacts.git
```

5. Place credentials.json into the server file. Ensure credentials.json is gitignored.

6. Create PostgreSQL database "comtacts".

```
$ sudo -u postgres createdb comtacts
```

7. Set up PostgreSQL tables, run command in the terminal from root of the repository.

```
$ psql comtacts < schemas.sql
```

8. Install dependencies.

```
$ npm install
```

9. Start the service.

```
npm start
```

10. Visit localhost:4000

## Testing

1. Ensure PostgreSQL is properly set up with the database and tables.
2. Run npm test

```
npm run test
```

## The Problem

Use the Google Contacts API to build an application that enables a user to write comments for a given contact. Please include authentication and a persistent data storage.

Please design, test, document, and deploy the code.

## Focus

This is a full stack application. I intended at the start to give equal time to both the front and back end of the application. In the end I would say that my time was 70/30 back/front.

This was primarily due to being unfamiliar with Open Authentication and the Google API. Learning this was not too hard but weaving the flow of authentication into the server required extra attention compared to my experiences in the past.

## Technologies Used

Contents

- [Client](<#client-(react)>) (React)
- [Server](<#server-(node,-express)>) (Node, Express)
- [Database](<#database-(postgresql)>) (PostgreSQL)

### Client (React)

The front end of the application was built using **React**. Fulfills almost all the needs of this application. State management is a simple process with just a few components and it provides the use of JSX when paired with Webpack.

Two other factors that heavily influenced my decision were my own familiarity with the technology. I had taken longer than expected building the API and was able to make up considerable time using a library I am very familiar with. Additionally it has better than average documentation and support. If I did run into problems, debugging or learning would be as painless as possible.

#### What I Built

I built out a single page application that was able to render the list of contacts. Within each contact subsection the user was able to click an edit button and type a comment for a given contact.

I also built a sync button that would allow a user to sync their contact list manually with the Google Contacts application. This was mostly for convenience for the user's sake. If they are adding contacts and commenting on them, they can manually request a sync without having to leave the page or waiting for any type of lazy check implementation of the application. In an ideal world the application would sync on a page visit as well as have the manual sync.

_Whats Next_: The next thing I would implement on this project would most likely be a search bar to make it easier to find a specific contact. After that, maybe a more cohesive login/logout functionality.

### Server (Node, Express)

The server is a typical express server with a few extra modules. The first of which would be express-sessions.

_Express-sessions_: This package allows for an easy management of cookies. It is a middleware that will automatically attach a cookie, save it (the session ID)to the store (PostgreSQL), and provide a few additional properties to each request. I am generating unique IDs using a npm module named uuid. And to easily hook up and manage interacting with the store I made use of another package named connect-pg-simple. I had never implemented express-sessions before but the simplicity, especially when paired with PostgreSQL and connect-pg-simple, made it a quick and pleasant process.

Express-session made it easy to identify who is a returning user and who is not. Upon an initial request this would be crucial as it would determine if the user needs to be authorized or not. If they need to be authorized I can redirect them appropriately. If not I can just return their contact data. The session ID continued to be a key identifier upon each request.

### Database (PostgreSQL)

## Other Projects

## Resume Link

## Live Demo
