import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap/lib';
import Urls from '../util/Urls.js';

class CreatePostButton extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, author: '', message: '', isLoading: false, errors: [] };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChange(key, e) {
    const newState = {};
    newState[key] = e.target.value;
    this.setState(newState);
  }

  checkInput() {
    const errors = [];
    if (this.state.author.length === 0) {
      errors.push('Author cannot be blank.');
    }

    if (this.state.message.length === 0) {
      errors.push('Message cannot be blank.');
    }

    return errors;
  }

  createPost() {
    const { author, message } = this.state;
    this.setState({ isLoading: true, errors: [] });
    const errors = this.checkInput();
    if (errors.length === 0) {
      axios.post(`${Urls.api}/posts`, {
        Author: author,
        Message: message,
      })
        .then((res) => {
          this.props.addPost(res.data);
          this.setState({ isLoading: false, author: '', message: '', showModal: false, errors: [] });
        },
      )
        .catch((err) => {
          this.setState({ isLoading: false, errors: [err.message] });
        },
      );
    } else {
      this.setState({ isLoading: false, errors });
    }
  }

  makeModalErrors() {
    const { errors } = this.state;
    if (errors.length > 0) {
      return (
        <Alert bsStyle="warning">
          {this.state.errors.join('\n')}
        </Alert>
      );
    }

    return <div />;
  }

  render() {
    const { showModal, isLoading } = this.state;
    return (
      <div>
        <Button bsStyle="primary" onClick={this.open.bind(this)}>Create Post</Button>
        <Modal show={showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.makeModalErrors()}
            <form>
              <FormGroup>
                <ControlLabel>Author</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.author}
                  placeholder="Enter author name to display"
                  onChange={this.handleChange.bind(this, 'author')}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Message</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.message}
                  placeholder="Enter message to display"
                  onChange={this.handleChange.bind(this, 'message')}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.createPost.bind(this)}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

CreatePostButton.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default CreatePostButton;
