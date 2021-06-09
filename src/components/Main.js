import React, { Component } from "react";
import aCoinIcon from "../a.png";
import bCoinIcon from "../b.png";

class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">AIR Balance</th>
              <th scope="col">BOB Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {window.web3.utils.fromWei(this.props.airTokenBalance, "Ether")}{" "}
                AIR <img src={aCoinIcon} height="17" alt="" />
              </td>
              <td>
                {window.web3.utils.fromWei(this.props.bobTokenBalance, "Ether")}{" "}
                BOB <img src={bCoinIcon} height="17" alt="" />
              </td>
            </tr>
            <tr>
              <td scope="col">{this.props.airTokenAddress}</td>
              <td scope="col">{this.props.bobTokenAddress}</td>
            </tr>

            <tr>
              <td>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.props.claimToken();
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={this.props.hasClaim}
                  >
                    Claim 10,000 AIR
                  </button>
                </form>
              </td>
              <td>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.props.claimToken();
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={this.props.hasClaimBob}
                  >
                    Claim 100 BOB
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.purchaseToken(amount);
              }}
            >
              <div>
                <label className="float-left">
                  <b>Purchase Tokens (1 BOB = 100 AIR)</b>
                </label>
                <span className="float-right text-muted">
                  {`Balance: ${window.web3.utils.fromWei(
                    this.props.airTokenBalance.toString(),
                    "Ether"
                  )} AIR`}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => {
                    this.input = input;
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={aCoinIcon} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; AIR
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                Purchase!
              </button>
            </form>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h2>
              Game{" "}
              <small className="float-right">
                {" "}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.props.startGame("100000000000000000000");
                  }}
                >
                  <button type="submit" className="btn btn-warning btn-block">
                    Start Game (100 BOB)
                  </button>
                </form>
              </small>
            </h2>

            <hr />

            <p>Online</p>
            <table className="table table-borderless text-muted text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Starter</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.currentGames.map(({ gameID, starterAddress }) => (
                  <tr key={gameID}>
                    <td>{gameID}</td>
                    <td style={{ wordWrap: "anywhere" }}>{starterAddress}</td>
                    <td>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          this.props.joinGame(gameID, "100000000000000000000");
                        }}
                        className="btn btn-primary btn-block"
                      >
                        Challenge!
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />

            <p>History</p>
            <table className="table table-borderless text-muted text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Starter</th>
                  <th>Starter Point</th>
                  <th>challenger</th>
                  <th>challenger Point</th>
                </tr>
              </thead>
              <tbody>
                {this.props.historyGames.map(
                  ({
                    gameID,
                    starterAddress,
                    staterPoint,
                    challengerAddress,
                    challengerPoint,
                    isStarterWin,
                  }) => (
                    <tr key={gameID}>
                      <td>{gameID}</td>
                      <td
                        style={{
                          wordWrap: "anywhere",
                        }}
                      >
                        {starterAddress}
                      </td>
                      <td
                        style={{
                          background: isStarterWin && "pink",
                        }}
                      >
                        {staterPoint}
                      </td>
                      <td style={{ wordWrap: "anywhere" }}>
                        {challengerAddress}
                      </td>
                      <td
                        style={{
                          background: !isStarterWin && "pink",
                        }}
                      >
                        {challengerPoint}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
