import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap/lib';
import axios from 'axios';
import Urls from '../util/Urls.js';

class PostRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isDeleteDisabled: false,
      isDeleteLoading: false,
      isEditDisabled: false,
    };
  }

  resetButtonsState() {
    this.setState({
      isDeleteLoading: false,
      isDeleteDisabled: false,
      isEditDisabled: false,
    });
  }

  deletePost() {
    const { removePost, index, post, addError, clearErrors } = this.props;
    clearErrors();
    this.setState({
      isEditDisabled: true,
      isDeleteLoading: true,
      isDeleteDisabled: false,
    });
    axios.delete(`${Urls.api}/posts/${post.ID}`)
      .then(() => {
        removePost(index);
        this.resetButtonsState();
      },
    )
      .catch((err) => {
        addError(err.message);
        this.resetButtonsState();
      },
    );
  }

  makeDeleteButton() {
    const { isDeleteLoading, isDeleteDisabled } = this.state;
    if (isDeleteLoading) {
      return <Button bsStyle="danger" disabled>Deleting...</Button>;
    } else if (isDeleteDisabled) {
      return <Button bsStyle="danger" disabled>Delete</Button>;
    }

    return <Button bsStyle="danger" onClick={this.deletePost.bind(this)}>Delete</Button>;
  }

  makeEditButton() {
    const { isEditDisabled } = this.state;
    const buttonStyle = { marginRight: '10px' };
    // edit not fully implemented yet
    return <Button style={buttonStyle} disabled>{isEditDisabled ? 'Editing...' : 'Edit'}</Button>;
  }

  render() {
    const { post } = this.props;
    return (
      <tr>
        <td>{post.Author}</td>
        <td>{post.Message}</td>
        <td>
          {this.makeEditButton()}
          {this.makeDeleteButton()}
        </td>
      </tr>
    );
  }
}

PostRow.propTypes = {
  post: PropTypes.shape({
    Author: PropTypes.string.isRequired,
    Message: PropTypes.string.isRequired,
    ID: PropTypes.number.isRequired,
  }),
  removePost: PropTypes.func.isRequired,
  addError: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default PostRow;
