import React from 'react';

import Contact from './Contact.jsx';

const Feed = ({
  contacts,
  edit,
  comment,
  handleInputChange,
  editButtonHandler,
  saveCommentHandler
}) => {
  console.log('from feed', contacts);
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
