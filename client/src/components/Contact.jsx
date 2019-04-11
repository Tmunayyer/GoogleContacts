import React from 'react';

const Contact = (props) => {
  let {
    data,
    edit,
    editComment,
    handleInputChange,
    editButtonHandler,
    saveCommentHandler
  } = props;
  let { id, name, phone_number, email, comment } = data;

  const conRender = () => {
    let jsx;
    if (id === edit) {
      jsx = (
        <>
          <input type="text" value={editComment} onChange={handleInputChange} />
          <button onClick={(e) => saveCommentHandler(e, id)}>
            Save Comment
          </button>
        </>
      );
    } else {
      jsx = (
        <button onClick={(e) => editButtonHandler(e, id, comment)}>Edit</button>
      );
    }
    return jsx;
  };

  return (
    <div>
      <div>{name}</div>
      <div>{phone_number}</div>
      <div>{email}</div>
      <div>{comment}</div>
      {conRender()}
    </div>
  );
};

export default Contact;
