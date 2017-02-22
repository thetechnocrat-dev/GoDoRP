import React, { Component } from 'react';
import axios from 'axios';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import Urls from '../util/Urls.js';
import DorpMessageBoard from './DorpMessageBoard.js';
import CreateMessageButton from './CreateMessageButton.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      dorps: [],
      errors: [],
    };
  }

  componentWillMount() {
    this.getDorps();
  }

  getDorps() {
    axios.get(`${Urls.api}/dorps`)
      .then((res) => {
        this.setState({ dorps: res.data });
      },
    )
      .catch(() => {
        this.setState({ errors: ['Backend API connection error'] });
      },
    );
  }

  // only removes from frontend not DB
  removeDorp(index) {
    const { dorps } = this.state;
    dorps.splice(index, 1);
    this.setState({ dorps });
  }

  // only adds to frontend not DB
  addDorp(dorp) {
    const { dorps } = this.state;
    dorps.push(dorp);
    this.setState({ dorps });
  }

  render() {
    const { windowWidth, dorps } = this.state;
    let width;
    if (windowWidth < Style.xsCutoff) {
      width = '100%';
    } else if (windowWidth < Style.smCutoff) {
      width = '723px';
    } else if (windowWidth < Style.mdCutoff) {
      width = '933px';
    } else {
      width = '1127px';
    }

    const panelStyle = {
      width,
      margin: 'auto',
    };

    return (
      <div>
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Welcome to Your GoDoRP App</h2>
          <CreateMessageButton addDorp={this.addDorp.bind(this)} />
          <DorpMessageBoard dorps={dorps} removeDorp={this.removeDorp.bind(this)} />
        </Panel>
      </div>
    );
  }
}

export default App;
