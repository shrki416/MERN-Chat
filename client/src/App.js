import React from "react";
import config from "./config";
import io from "socket.io-client";

import { Paper, Typography } from "@material-ui/core";

import BottomBar from "./BottomBar";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: "",
      name: "",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.socket = io(config[process.env.NODE_ENV].endpoint);

    this.socket.on("init", (msg) => {
      let msgReversed = msg.reverse();
      this.setState(
        (state) => ({
          chat: [...state.chat, ...msgReversed],
        }),
        this.scrollToBottom
      );
    });

    this.socket.on("push", (msg) => {
      this.setState(
        (state) => ({
          chat: [...state.chat, msg],
        }),
        this.scrollToBottom
      );
    });
  }

  handleClick(e) {
    this.setState({ content: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.socket.emit("message", {
      name: this.state.name,
      content: this.state.content,
    });

    this.setState((state) => {
      return {
        chat: [
          ...state.chat,
          {
            name: state.name,
            content: state.content,
          },
        ],
        content: "",
      };
    }, this.scrollToBottom);
  }

  scrollToBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  }

  render() {
    return (
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleClick={this.handleClick}
          handleName={this.handleName}
          handleSubmit={this.handleSubmit}
          name={this.state.name}
        />
      </div>
    );
  }
}

export default App;
