import React from 'react';
import { Component } from 'react';

import Navbar from './components/Navbar.jsx';
import Feed from './components/Feed.jsx';

//exported axios calls for *hopefully* cleaner app component.
import helpers from './utilities.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      activeEdit: '',
      comment: ''
    };
    this.getData = this.getData.bind(this);
    this.editButtonClickHandler = this.editButtonClickHandler.bind(this);
    this.saveCommentHandler = this.saveCommentHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.syncClickHandler = this.syncClickHandler.bind(this);
  }
  editButtonClickHandler(e, dbID, comment) {
    this.setState({
      comment: comment,
      activeEdit: dbID
    });
  }
  handleInputChange({ target }) {
    this.setState({
      comment: target.value
    });
  }
  saveCommentHandler(e, id) {
    let outbound = {
      id: id,
      comment: this.state.comment
    };

    helpers.saveComment(outbound, (err, res) => {
      if (err) {
        console.log('error saving comment');
      } else {
        /*

          The extre api call here might not be necessary. If the API
          ends up being a bit bogged down by calls we could be more 
          thorough here and when we get a good response just edit state
          ourselves. If we have handled errors correctly in API we should
          not have problems of misrepresented data.

          This way is simpler for now.

        */
        this.getData();
      }
    });
  }
  syncClickHandler() {
    helpers.syncContacts((err, data) => {
      if (err) {
        console.log('error syncing contacts');
      } else {
        console.log('updated contacts', data);
      }
    });
  }

  getData() {
    helpers.getData((err, data) => {
      if (err) {
        console.log('error getting data');
      } else {
        this.setState({
          contacts: data,
          activeEdit: '',
          comment: ''
        });
      }
    });
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <>
        <Navbar syncClickHandler={this.syncClickHandler} />
        <h1 className="tagline">Comment on your Google Contacts!</h1>
        <div className="container">
          <Feed
            contacts={this.state.contacts}
            edit={this.state.activeEdit}
            comment={this.state.comment}
            handleInputChange={this.handleInputChange}
            editButtonHandler={this.editButtonClickHandler}
            saveCommentHandler={this.saveCommentHandler}
          />
        </div>
      </>
    );
  }
}

export default App;
