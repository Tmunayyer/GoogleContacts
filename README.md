# GoogleContacts

Coding Challange

## Contents

- [The Problem](#the-problem)
- [Focus](#focus)
- [Technologies Used](#technologies-used)
- [Other Projects](#other-projects)
- [Resume Link](#resume-link)
- [Live Demo](#live-demo)

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

I built out a single page application that was able to render the list of contacts. Within each contact subsection the user was able to click and edit button and edit a comment for a given contact.

I also built a sync button that would allow a user to sync their contact list with the Google Contacts application. There were a few reasons this was a feature I chose to focus on.

_Efficiency_: Upon an initial sign up to my application, a user’s contacts are uploaded into my database. This allows me to limit the number of API calls to Google. Additionally it helps in the occurrence that a user has created new contacts in Google’s application. Instead of fetching all contacts and filtering out ones I already have, I let Google do the heavy lifting and request a synchronization to get only new data from my last get request.

_Convenience_: Without a way to sync the application while logged in, a user would have to log out and log back in to trigger a get request to Google’s API. There is also the scenario where I reach out to google every so often but there are rate limits that must be heeded.

With these two features implemented, it is easy to get started. Simply sign in and see your contacts. If there are contacts that arent shown, just click the button. Without easy access to your contacts then this application would be useless.

_Whats Next_: The next thing I would implement on this project would most likely be a search bar to make it easier to find a specific contact. After which maybe a more cohesive login/logout functionality.

### Server (Node, Express)

The server is a typical express server with a few extra modules. The first of which would be express-sessions.

_Express-sessions_: This package allows for an easy management of cookies. It is a middleware that will automatically attach a cookie, save it (the session ID)to the store (PostgreSQL), and provide a few additional properties to each request. I am generating unique IDs using a npm module named uuid. And to easily hook up and manage interacting with the store I made use of another package named connect-pg-simple. I had never implemented express-sessions before but the simplicity, especially when paired with PostgreSQL and connect-pg-simple, made it a quick and pleasant process.

Express-session made it easy to identify who is a returning user and who is not. Upon an initial request this would be crucial as it would determine if the user needs to be authorized or not. If they need to be authorized I can redirect them appropriately. If not I can just return their contact data. The session ID continued to be a key identifier upon each request.

### Database (PostgreSQL)

## Other Projects

## Resume Link

## Live Demo
