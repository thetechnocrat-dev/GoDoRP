import React, { Component, PropTypes } from 'react';
import { Table, Alert } from 'react-bootstrap/lib';
import DorpRow from './DorpRow';

class DorpMessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  addError(error) {
    this.setState({ error });
  }

  clearErrors() {
    this.setState({ error: '' });
  }

  makeDorpRows() {
    const { removeDorp } = this.props;
    return this.props.dorps.map((dorp, i) =>
      <DorpRow
        key={i}
        index={i}
        dorp={dorp}
        removeDorp={removeDorp}
        addError={this.addError.bind(this)}
        clearErrors={this.clearErrors.bind(this)}
      />,
    );
  }

  makeError() {
    const { error } = this.state;
    if (error) {
      return <Alert bsStyle="danger">{error}</Alert>;
    }

    return <div />;
  }

  render() {
    return (
      <div>
        {this.makeError()}
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Author</th>
              <th>Message</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.makeDorpRows()}
          </tbody>
        </Table>
      </div>
    );
  }
}

DorpMessageBoard.propTypes = {
  dorps: PropTypes.arrayOf(PropTypes.object),
  removeDorp: PropTypes.func.isRequired,
};

export default DorpMessageBoard;
