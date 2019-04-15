import React from 'react';
import { Component } from 'react';

import Navbar from './components/Navbar.jsx';
import Feed from './components/Feed.jsx';

//exported axios calls for cleaner app component.
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
        this.getData();
      }
    });
  }
  syncClickHandler() {
    helpers.syncContacts((err, { data }) => {
      if (err) {
        console.log('error syncing contacts');
      } else {
        if (data.didSync) {
          this.getData();
        } else {
          alert('No new contacts!');
        }
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
