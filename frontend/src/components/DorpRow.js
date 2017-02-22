import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap/lib';
import axios from 'axios';
import Urls from '../util/Urls.js';

class DorpRow extends Component {
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

  deleteDorp() {
    const { removeDorp, index, dorp, addError, clearErrors } = this.props;
    clearErrors();
    this.setState({
      isEditDisabled: true,
      isDeleteLoading: true,
      isDeleteDisabled: false,
    });
    axios.delete(`${Urls.api}/dorps/${dorp.ID}`)
      .then(() => {
        removeDorp(index);
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

    return <Button bsStyle="danger" onClick={this.deleteDorp.bind(this)}>Delete</Button>;
  }

  makeEditButton() {
    const { isEditDisabled } = this.state;
    return <Button disabled={isEditDisabled}>{isEditDisabled ? 'Editing...' : 'Edit'}</Button>;
  }

  render() {
    const { dorp } = this.props;
    return (
      <tr>
        <td>{dorp.Author}</td>
        <td>{dorp.Message}</td>
        <td>
          {this.makeEditButton()}
          {this.makeDeleteButton()}
        </td>
      </tr>
    );
  }
}

DorpRow.propTypes = {
  dorp: PropTypes.shape({
    Author: PropTypes.string.isRequired,
    Message: PropTypes.string.isRequired,
    ID: PropTypes.number.isRequired,
  }),
  removeDorp: PropTypes.func.isRequired,
  addError: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default DorpRow;
