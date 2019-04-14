import React from 'react';
import App from '../src/App.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Feed from '../src/components/Feed.jsx';
import Contact from '../src/components/Contact.jsx';

import { mount, shallow, render } from 'enzyme';
import { testing } from 'googleapis/build/src/apis/testing';

/*
    This is my first time writing tests for React. I am following
    Jest's get tutorial to start.

    https://jestjs.io/docs/en/tutorial-react

    This was actually super easy. All it took was adding a babel.config
    file after downloading a few new modules.

    It says these snapshots should be committed along with code.

*/

describe('Testing component presence', () => {
  test('should render elements from Navbar component:', () => {
    const wrapper = shallow(<Navbar syncClickHandler={() => {}} />);

    const nestedElements = <h2 className="navbar-item title">Comtacts</h2>;

    expect(wrapper.contains(nestedElements)).toBe(true);
  });

  test('should render elements from Contacts component:', () => {
    //mock props
    let edit = '';
    let editComment = '';
    let handleInputChange = () => {};
    let editButtonHandler = () => {};
    let saveCommentHandler = () => {};
    let data = {
      id: 1,
      name: 'Thomas',
      phone_number: '(123) 456-7891',
      email: 'tmunayyer@gmail.com',
      comment: ''
    };

    const wrapper = shallow(
      <Contact
        key={1}
        data={data}
        edit={edit}
        editComment={editComment}
        handleInputChange={handleInputChange}
        editButtonHandler={editButtonHandler}
        saveCommentHandler={saveCommentHandler}
      />
    );

    const target = (
      <div className="info">
        <div>Phone: (123) 456-7891</div>
        <div>Email: tmunayyer@gmail.com</div>
      </div>
    );

    expect(wrapper.contains(target)).toBe(true);
  });

  test('should render elements from the App component', () => {
    const wrapper = shallow(<App />);

    const target = (
      <h1 className="tagline">Comment on your Google Contacts!</h1>
    );

    expect(wrapper.contains(target)).toBe(true);
  });
});

describe('Testing conditional rendering', () => {
  test('Contact should render a comment', () => {
    //mock props
    let edit = '';
    let editComment = '';
    let handleInputChange = () => {};
    let editButtonHandler = () => {};
    let saveCommentHandler = () => {};
    let data = {
      id: 1,
      name: 'Thomas',
      phone_number: '(123) 456-7891',
      email: 'tmunayyer@gmail.com',
      comment: 'Hello World'
    };

    const wrapper = shallow(
      <Contact
        key={1}
        data={data}
        edit={edit}
        editComment={editComment}
        handleInputChange={handleInputChange}
        editButtonHandler={editButtonHandler}
        saveCommentHandler={saveCommentHandler}
      />
    );

    const target = <div className="comment">Hello World</div>;

    expect(wrapper.contains(target)).toBe(true);
  });

  test('Contact should render a textArea when editing', () => {
    //mock props
    let edit = 1;
    let editComment = '';
    let handleInputChange = () => {};
    let editButtonHandler = () => {};
    let saveCommentHandler = () => {};
    let data = {
      id: 1,
      name: 'Thomas',
      phone_number: '(123) 456-7891',
      email: 'tmunayyer@gmail.com',
      comment: ''
    };

    const wrapper = shallow(
      <Contact
        key={1}
        data={data}
        edit={edit}
        editComment={editComment}
        handleInputChange={handleInputChange}
        editButtonHandler={editButtonHandler}
        saveCommentHandler={saveCommentHandler}
      />
    );

    const target = (
      <textarea
        cols="50"
        rows="2"
        type="text"
        value={editComment}
        maxLength="100"
        onChange={handleInputChange}
      />
    );

    expect(wrapper.contains(target)).toBe(true);
  });
});

describe('Testing state change', () => {
  test('App state should affect what is rendered', () => {
    const wrapper = mount(<App />);
    const target = <div className="name">Thomas</div>;

    expect(wrapper.contains(target)).toBe(false);

    let contact = {
      id: 1,
      name: 'Thomas',
      phone_number: '(123) 456-7891',
      email: 'tmunayyer@gmail.com',
      comment: ''
    };

    wrapper.setState({ contacts: [contact] });

    expect(wrapper.contains(target)).toBe(true);
  });
});
