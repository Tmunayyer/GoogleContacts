import React from 'react';
import { Component } from 'react';

import axios from 'axios';

import Navbar from './components/Navbar.jsx';
import Feed from './components/Feed.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      activeEdit: '',
      comment: ''
    };
    this.getGoogleData = this.getGoogleData.bind(this);
    this.editButtonClickHandler = this.editButtonClickHandler.bind(this);
    this.saveCommentHandler = this.saveCommentHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

    axios
      .post('/contacts', {
        data: outbound
      })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        //good save, lets update state locally
        this.getGoogleData();
      });
  }

  getGoogleData() {
    axios
      .get('/contacts')
      .catch((err) => {
        console.log(err);
      })
      .then(({ data }) => {
        this.setState({
          contacts: data,
          activeEdit: '',
          comment: ''
        });
      });
  }
  componentDidMount() {
    this.getGoogleData();
  }
  render() {
    return (
      <>
        <Navbar />
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
