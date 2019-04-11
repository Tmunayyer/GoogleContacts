import React from 'react';
import { Component } from 'react';

import axios from 'axios';

import Feed from './components/Feed.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      activeEdit: '',
      comment: ''
    };
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
    console.log(id, this.state.comment);
  }

  getGoogleData() {
    axios
      .get('/contacts')
      .catch((err) => {
        console.log(err);
      })
      .then(({ data }) => {
        console.log('state.contacts:', data);
        this.setState({
          contacts: data,
          edit: '',
          comment: ''
        });
      });
  }
  componentWillMount() {
    this.getGoogleData();
  }
  render() {
    return (
      <>
        <h1>Comtacts! Comment on your Google Contacts!</h1>
        <Feed
          contacts={this.state.contacts}
          edit={this.state.activeEdit}
          comment={this.state.comment}
          handleInputChange={this.handleInputChange}
          editButtonHandler={this.editButtonClickHandler}
          saveCommentHandler={this.saveCommentHandler}
        />
      </>
    );
  }
}

export default App;
