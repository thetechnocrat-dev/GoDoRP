import React, { Component } from 'react';
import axios from 'axios';
import { Panel } from 'react-bootstrap/lib';
import Style from '../util/Style.js';
import Urls from '../util/Urls.js';
import PostBoard from './PostBoard.js';
import CreatePostButton from './CreatePostButton.js';
import TopNavbar from './TopNavbar.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      posts: [],
      errors: [],
    };
  }

  componentWillMount() {
    this.getPosts();
  }

  getPosts() {
    axios.get(`${Urls.api}/posts`)
      .then((res) => {
        this.setState({ posts: res.data });
      },
    )
      .catch(() => {
        this.setState({ errors: ['Backend API connection error'] });
      },
    );
  }

  // only removes from frontend not DB
  removePost(index) {
    const { posts } = this.state;
    posts.splice(index, 1);
    this.setState({ posts });
  }

  // only adds to frontend not DB
  addPost(post) {
    const { posts } = this.state;
    posts.push(post);
    this.setState({ posts });
  }

  render() {
    const { windowWidth, posts } = this.state;
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
      marginTop: '65px',
    };

    return (
      <div>
        <TopNavbar />
        <Panel style={panelStyle} bsStyle="primary">
          <h2>Welcome to Your GoDoRP App</h2>
          <CreatePostButton addPost={this.addPost.bind(this)} />
          <PostBoard posts={posts} removePost={this.removePost.bind(this)} />
        </Panel>
      </div>
    );
  }
}

export default App;
