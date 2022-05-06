import React from "react";
import { useParams } from "react-router-dom";
import "../css/catalog.css";
import "../css/form.css";
import { StaticValue } from "../staticValue";
import Finger from "../icons/finger.png";
import { canCoinUpdate, updateCoin } from "..";
import { AddCoinCounter } from "../reducer/coinsReducer";

export function ForumThemPageGetParams() {
  let { id } = useParams();

  return <ForumThem id={id} />;
}

export class ForumThem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isLoaded: false,
      isLoaded1: false,
      startMessage: "",
    };
    this.addComment = this.addComment.bind(this);
    this.addLike = this.addLike.bind(this);
  }

  addComment(e) {
    e.preventDefault();
    if (canCoinUpdate) {
      updateCoin(15);
    }
    fetch(`${StaticValue.BaseURL}/api/forumMessage`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
      body: JSON.stringify({
        forumThem: parseInt(this.props.id),
        message: this.state.message,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.componentDidMount();
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  addLike(id, mark) {
    if (canCoinUpdate) {
      updateCoin(5);
    }
    fetch(`${StaticValue.BaseURL}/api/likes`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
      body: JSON.stringify({
        object: parseInt(id),
        positive: mark == StaticValue.positiveUserMark,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.componentDidMount();
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  componentDidMount() {
    fetch(`${StaticValue.BaseURL}/api/forumThem/${this.props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 401) {
          window.location.href = "/notAuthorize";
        }
        if (res.status === 403) {
          window.location.href = "/notAccess";
        }
        if (res.status === 404 || res.status === 400) {
          window.location.href = "/notFound";
        }
        if (res.status === 500) {
          window.location.href = "/internalServerError";
        }
      })
      .then(
        (result) => {
          this.setState({
            startMessage: result,
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            error,
            isLoaded: true,
          });
        }
      );
    fetch(`${StaticValue.BaseURL}/api/forumMessage/${this.props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 401) {
          window.location.href = "/notAuthorize";
        }
        if (res.status === 403) {
          window.location.href = "/notAccess";
        }
        if (res.status === 404 || res.status === 400) {
          window.location.href = "/notFound";
        }
        if (res.status === 500) {
          window.location.href = "/internalServerError";
        }
      })
      .then(
        (result) => {
          this.setState({
            items: result,
            isLoaded1: true,
          });
        },
        (error) => {
          this.setState({
            isLoaded1: true,
            error,
          });
        }
      );
  }

  render() {
    if (this.state.isLoaded && this.state.isLoaded1) {
      return (
        <div className="forum-message-container">
          {canCoinUpdate ? <AddCoinCounter value={8}> </AddCoinCounter> : <></>}
          <form className="form-container" onSubmit={this.addComment}>
            <textarea
              className="field-input input-comment"
              type="text"
              placeholder="Комментарий"
              name="comment"
              onChange={(e) => this.setState({ message: e.target.value })}
            />
            <input className="submit-input" type="submit" />
          </form>
          <div className="startmessage-container">
            <div className="header-forum-them">
              <div className="user-comment">
                {this.state.startMessage.login}
              </div>
              <div className="time-message">
                {this.state.startMessage.dateCreated
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
                <br />
                {this.state.startMessage.dateCreated
                  .split("T")[1]
                  .split("-")
                  .reverse()
                  .join("/")}
              </div>
            </div>
            <div className="text-comment">
              {this.state.startMessage.message}
            </div>
          </div>
          {this.state.items.map((them) => (
            <div className="message-like-container">
              <div className="container-forum-message">
                <div className="header-forum-them">
                  <div className="user-comment"> {them.login} </div>
                  <div className="time-message">
                    {them.dateCreated
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                    <br />
                    {them.dateCreated
                      .split("T")[1]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </div>
                </div>
                <div className="text-comment"> {them.message} </div>
              </div>
              <div className="mark-container">
                {them.userLike != StaticValue.noneUserMark ? (
                  <img src={Finger} className="positive-mark nonactive" />
                ) : (
                  <img
                    src={Finger}
                    className="positive-mark"
                    onClick={() =>
                      this.addLike(them.id, StaticValue.positiveUserMark)
                    }
                  />
                )}
                <h1> {them.positive} </h1>
              </div>
              <div className="mark-container">
                {them.userLike != StaticValue.noneUserMark ? (
                  <img src={Finger} className="negative-mark nonactive" />
                ) : (
                  <img
                    src={Finger}
                    className="negative-mark"
                    onClick={() =>
                      this.addLike(them.id, StaticValue.negativeUserMark)
                    }
                  />
                )}
                <h1> {them.negative} </h1>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return "";
    }
  }
}
