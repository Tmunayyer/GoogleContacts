import React from 'react';

import Contact from './Contact.jsx';

const Feed = (props) => {
  let {
    contacts,
    edit,
    comment,
    handleInputChange,
    editButtonHandler,
    saveCommentHandler
  } = props;

  return contacts.map((contact) => {
    return (
      <Contact
        key={contact.id}
        data={contact}
        edit={edit}
        editComment={comment}
        handleInputChange={handleInputChange}
        editButtonHandler={editButtonHandler}
        saveCommentHandler={saveCommentHandler}
      />
    );
  });
};

export default Feed;
