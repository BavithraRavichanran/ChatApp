import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import Search from 'antd/lib/input/Search';
import Text from 'antd/lib/typography/Text';
import Meta from 'antd/lib/card/Meta'
import './App.css'

// const { Search } = Input;
// const {Text}= Typography;
const client = new W3CWebsocket('ws://127.0.0.1:8000');


export default class App extends Component {

  state = {
    userName: '',
    isLogged: false,
    messages: []
  }
  onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: this.state.userName
    }));
    this.setState({searchVal: ''})
  }
  componentDidMount() {
    client.onopen = () => {
      console.log("websocket connected");
    };
    client.onmessage = (message) => {
      const datafromserver = JSON.parse(message.data);
      console.log("got reply", datafromserver);
      if (datafromserver.type === "message") {
        this.setState((state) => ({
          messages: [...state.messages,
          {
            msg: datafromserver.msg,
            user: datafromserver.user
          }]
        }))
      }
    }
  }
  render() {
    return (
      <div className="main">
        {this.state.isLogged ?
          <div>
            <div className="title">
              <Text type="secondary" style={{ fontSize: '36px' }}>WebSocket Chat</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }}>
              {this.state.messages.map(message =>
                <Card key={message.msg} style={{
                  width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ?
                    'flex-end' : 'flex-start'
                }} >

                  <Meta
                    avatar={
                      <Avatar style={{ color: "#f56a00", backgroundColor: "rgb(247, 215, 203)" }}>{message.user[0].toUpperCase()}</Avatar>
                    }
                    title={message.user}
                    description={message.msg}
                  />
                </Card>
              )}
            </div>

            <div className="bottom">
              <Search
                placeholder="input essage and send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={value => this.onButtonClicked(value)}
              />            </div>
            {/* <button onClick={() => this.onButtonClicked('Hello')}>Send Msg</button>
        {this.state.messages.map(msg => <p>message: {msg.msg}, user: {msg.user}</p>)} */}
          </div>
          :
          <div style={{ padding: '200px 40px' }}>
            <Search
              placeholder="Enter UserName"
              enterButton="Login"
              size="large"
              onSearch={value => this.setState({ isLogged: true, userName: value })}
            />
          </div>
        }
      </div>
    );
  }
}
