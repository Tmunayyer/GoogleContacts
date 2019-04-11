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
          <textarea
            cols="50"
            rows="2"
            type="text"
            value={editComment}
            maxLength="100"
            onChange={handleInputChange}
          />
          <div>
            <button onClick={(e) => saveCommentHandler(e, id)}>
              Save Comment
            </button>
          </div>
        </>
      );
    } else {
      jsx = (
        <>
          <div className="comment">{comment}</div>
          <div>
            <button onClick={(e) => editButtonHandler(e, id, comment)}>
              Edit
            </button>
          </div>
        </>
      );
    }
    return jsx;
  };

  return (
    <div className="contact">
      <div className="left-group">
        <div className="name">{name}</div>
        <div className="info">
          <div>Phone: {phone_number}</div>
          <div>Email: {email}</div>
        </div>
      </div>
      <div className="right-group">
        <div className="comment">
          <div>Notes:</div>

          {conRender()}
        </div>
      </div>
    </div>
  );
};

export default Contact;
