import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  /*
    - Difference between React Component State and Redux State
    - Why don't we keep this state inside of our Redux store
      because all of the other state in our application is
      inside of Redux as well?
    --------------------------------------------------------
    Well, If the state isn't in Redux Store, it's because that
    would benefit us at all.
    Component state is still fine, and it's still good, it's
    still useful, and it's especially useful WHEN ONLY THE
    COMPONENT THAT WE'RE RENDERING CARES ABOUT THE STATE.
    "showAnswered" isn't going to be used anywhere else inside
    of our application, so it doesn't really make sense to
    stick it into Redux because again, that just provides more
    of a hustle than anything when Component state works
    perfectly fine for what we're trying to accomplish.
  */
  state = {
    showAnswered: false,
  }
  /*
    "showAnswered" is a SubState because the states
    are being run by Redux
  */

  showUnaswered = () => {
    this.setState(() => ({
      showAnswered: false,
    }));
  }

  showAnswered = () => {
    this.setState(() => ({
      showAnswered: true,
    }));
  }

  render() {
    console.log(this.props);
    const { showAnswered } = this.state;
    const { answered, unanswered } = this.props;

    const list = showAnswered === true
      ? answered
      : unanswered;

    return (
      <div>
        <div className="dashboard-toggle">
          <button
            style={{textDecoration: showAnswered === false ? 'underline' : null}}
            onClick={this.showUnaswered}
          >
            Unanswered
          </button>
          <span> | </span>
          <button
            style={{textDecoration: showAnswered === true ? 'underline' : null}}
            onClick={this.showAnswered}
          >
            Answered
          </button>
        </div>
        <ul className="dashboard-list">
          {
            list.map((poll) => (
              <li key={poll.id}>
                <Link to={`polls/${poll.id}`}>
                  {poll.question}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

function mapStateToProps ({ authedUser, polls, users }) {
  const answers = users[authedUser].answers;

  const answered = answers.map((id) => polls[id])
    .sort((a, b) => b.timestamp - a.timestamp);

  const unanswered = Object.keys(polls)
    .filter((id) => !answers.includes(id))
    .map((id) => polls[id])
    .sort((a, b) => b.timestamp - a.timestamp)

  return {
    answered,
    unanswered,
  };
}

export default connect(mapStateToProps)(Dashboard);