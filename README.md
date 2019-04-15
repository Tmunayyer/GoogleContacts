# Comtacts

## Contents

- [The Application](#the-application)
- [The Problem](#the-problem)
- [Focus](#focus)
- [Technologies Used](#technologies-used)
- [Other Projects](#other-projects)
- [Resume Link](https://drive.google.com/file/d/1oKEIO_sYNlVbdhj42BXKSp0OlJ2tHf0a/view?usp=sharing)

## The Application

Try the application out [here](http://ec2-18-216-92-85.us-east-2.compute.amazonaws.com) or you can set it up locally with the following instructions.

The application is Dockerized and deployed on an EC2 instance.

### Local Setup

1. Install [PostgreSQL](https://www.postgresql.org/).
2. Install [Node.js](https://nodejs.org/en/).
3. Retrieve credentials for [Google's API](https://console.developers.google.com) by following [this guide](https://gist.github.com/Tmunayyer/379b2e9bee5ba7b8b299457cb524b608).

4. Clone this repository.

```
$ git clone https://github.com/Tmunayyer/GoogleContacts.git
```

5. Place the credentials downloaded from google into the server file of the repository. Rename the file to: credentials.json and ensure credentials.json is gitignored.

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
2. Run the tests.

```
npm test
```

Note: Missing here is end to end tests that everything works together. This would be a next step.

## The Problem

Use the Google Contacts API to build an application that enables a user to write comments for a given contact. Please include authentication and a persistent data storage.

Please design, test, document, and deploy the code.

## Focus

This is a full stack application. I intended at the start to give equal time to both the front and back end of the application. In the end it was 70/30 back/front.

This was primarily due to being unfamiliar with Open Authentication and the Google API. Learning this was not too hard but weaving the flow of authentication into the server required extra attention compared to my experiences in the past.

## Technologies Used

### Contents

- [Client (React)](<#client-(react)>)
- [Server (Node, Express)](<#server-(node,-express)>)
- [Database (PostgreSQL)](<#database-(postgresql)>)

### Client (React)

The front end of the application was built using _React_. State management is a simple process with just a few components and it provides the use of JSX when paired with Webpack.

Two other factors that heavily influenced my decision were my own familiarity with the technology. Additionally it has better than average documentation and support, in my opinion. If I did run into problems, debugging or learning would be as painless as possible.

#### What I Built

I built out a single page application that was able to render the list of contacts from Google Contacts API. Within each contact subsection the user was able to click an edit button and type a comment for a given contact.

I also built a sync button that would allow a user to sync their contact list manually with the Google Contacts application. This was mostly for convenience for the user's sake. If they are adding contacts and commenting on them actively, they can manually request a sync without having to leave the page or waiting for any type of lazy check implementation. In an ideal world the application would sync on a page visit as well as having the manual feature.

_Whats Next_: The next thing I would implement on this project would most likely be a search bar to make it easier to find a specific contact. After that, maybe a more cohesive login/logout functionality. There is also the matter of handling errors more effectively. Right now I just console.log them, in a more polished I would want something displayed on the page letting the client know there was an error so they arent left waiting.

### Server (Node, Express)

The server is a typical express server with a few extra modules. This was my first time using express-sessions in an application.

_Express-sessions_: This package allows for an easy management of cookies. It is a middleware that will automatically attaches a cookie, saves it (the session ID) to the store (PostgreSQL), and provides a few additional properties to each request.

_UUID_: This package is handy to generate unique IDs for the sessions. It is guaranteed not to have any collisions which makes this a non-factor when scaling horizontally.

_Connect-pg-simple_: This package provides an easily managed store for the sessions using PostgreSQL.

_Googleapi_: Google has their own module to generate api calls. This package also handle authentication calls and generation of urls among many other things.

#### What I Built

I built a RESTful API that would use postgres and googleapi to validate users, retrieve information, and store information. Most of this API is handling data retrieval from either Google or my database at the correct time.

_Whats Next_: Currently I am storing the session ID in the users table. This should be refactored to have a unique user ID independent of the session ID stored on the session itself. Another issue is paginating the Google API response to handle the event in which a user has more than the maximum retrieval limit. Finally I would also look to implement a more comprehensive logging library instead of just using console.log.

### Database (PostgreSQL)

The schemas can be seen [here](https://github.com/Tmunayyer/GoogleContacts/blob/master/schemas.sql).

Since sessions and access keys are replaced, I used Google's API IDs as my foreign key constraint in the comments table. This ensure that if a user visits the website from multiple devices or revokes and approves access, I won't have duplicate users.

No ORM is being used. The queries for this application are somewhat simple. Continued development might see additional tables needed as well as more complex queries. At that point an ORM might be useful.

#### Security

Because this application is able to get some sensitive information, DB security is an issue. For my deployed service I configure PostgreSQL to only allow connections from local Docker images. Additionally I used environment variables set at the build of the image for the DB password.

_Whats next_: The next thing I would work on is an off site backup. User's comments and persistence are the selling feature of the application, without them there is no point.

## Other Projects

My [Back End Thesis](https://github.com/Tmunayyer/Listing-Details-Sidebar) while at Hack Reactor displays my ability to architect and scale the backend of a service.

[PropogandaBonanza](https://github.com/Tmunayyer/propogandaBonanza) was a 36-hour MVP challenge using two APIs and a focus on functionality over style.

## Resume Link

[Resume](https://drive.google.com/file/d/1oKEIO_sYNlVbdhj42BXKSp0OlJ2tHf0a/view?usp=sharing)
