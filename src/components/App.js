import React, { Component } from "react";
import Web3 from "web3";
import AirToken from "../abis/AirToken.json";
import BobToken from "../abis/BobToken.json";
import PublicSale from "../abis/PublicSale.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    //const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    // load air token
    const airTokenData = AirToken.networks[networkId];
    if (airTokenData) {
      const airToken = new web3.eth.Contract(
        AirToken.abi,
        airTokenData.address
      );
      this.setState({ airToken });
      let airTokenBalance = await airToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({
        airTokenBalance: airTokenBalance.toString(),
        airTokenAddress: airTokenData.address,
      });
    } else {
      window.alert("AirToken contract not deployed to detect network.");
    }

    // load bob token
    const bobTokenData = BobToken.networks[networkId];
    if (bobTokenData) {
      const bobToken = new web3.eth.Contract(
        BobToken.abi,
        bobTokenData.address
      );
      this.setState({ bobToken });
      let bobTokenBalance = await bobToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({
        bobTokenBalance: bobTokenBalance.toString(),
        bobTokenAddress: bobTokenData.address,
      });
    } else {
      window.alert("bobToken contract not deployed to detect network.");
    }

    // load public sale
    const publicSaleData = PublicSale.networks[networkId];
    if (publicSaleData) {
      const publicSale = new web3.eth.Contract(
        PublicSale.abi,
        publicSaleData.address
      );
      const hasClaimBob = await publicSale.methods
        .hasClaimBob(this.state.account)
        .call();

      const gameID = await publicSale.methods.gameID().call();
      console.log("gameID", typeof gameID);
      for (let id = 1; id < parseInt(gameID) + 1; id++) {
        let gameObject = await publicSale.methods.games(id).call();
        gameObject["gameID"] = id;

        if (gameObject["isFinished"]) {
          this.setState({
            historyGames: [...this.state.historyGames, gameObject],
          });
        } else {
          this.setState({
            currentGames: [...this.state.currentGames, gameObject],
          });
        }
      }

      // const historyGameIDs = await publicSale.methods
      //   .getHistoryGameIDs()
      //   .call();

      // for (let gameID of currentGameIDs) {
      //   let gameObject = await publicSale.methods.games(gameID).call();
      //   gameObject["gameID"] = gameID;

      //   this.setState({
      //     currentGames: [...this.state.currentGames, gameObject],
      //   });
      // }

      // for (let gameID of historyGameIDs) {
      //   let gameObject = await publicSale.methods.games(gameID).call();
      //   gameObject["gameID"] = gameID;

      //   this.setState({
      //     historyGames: [...this.state.historyGames, gameObject],
      //   });
      // }

      // const games1 = await publicSale.methods.games(1).call();
      // const games2 = await publicSale.methods.games(2).call();

      console.log("currentGames", this.state.currentGames);
      console.log("historyGames", this.state.historyGames);
      //console.log("historyGameIDs", historyGameIDs);

      this.setState({ publicSale, hasClaimBob });
    } else {
      window.alert("public sale contract not deployed to detect network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    console.log("loadWeb3");
    if (window.ethereum) {
      console.log("first");
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      console.log("second");
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("last");
      window.alert("change browser, please");
    }
  }

  claimBobToken = () => {
    this.setState({ loading: true });
    this.state.publicSale.methods
      .claimBobToken()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  claimAdaToken = () => {
    this.setState({ loading: true });
    this.state.publicSale.methods
      .claimAdaToken()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  purchaseToken = (amount) => {
    this.setState({ loading: true });
    this.state.airToken.methods
      .approve(this.state.publicSale._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.publicSale.methods
          .purchaseToken(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  startGame = (amount) => {
    this.setState({ loading: true });
    this.state.bobToken.methods
      .approve(this.state.publicSale._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.publicSale.methods
          .startGame(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          })
          .catch((error) => {
            console.log("error2", error);
          });
      });
  };

  joinGame = (gameID, amount) => {
    this.setState({ loading: true });
    this.state.bobToken.methods
      .approve(this.state.publicSale._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.publicSale.methods
          .joinGame(gameID, amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          })
          .catch((error) => {
            console.log("error2", error);
          });
      })
      .catch((error) => {
        console.log("error1", error);
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      airToken: {},
      airTokenAddress: "",
      bobToken: {},
      bobTokenAddress: "",
      publicSale: {},
      hasClaimBob: false,
      airTokenBalance: "0",
      bobTokenBalance: "0",
      loading: true,
      games: {},
      currentGames: [],
      historyGames: [],
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          {" "}
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          airTokenAddress={this.state.airTokenAddress}
          bobTokenAddress={this.state.bobTokenAddress}
          airTokenBalance={this.state.airTokenBalance}
          bobTokenBalance={this.state.bobTokenBalance}
          stakingBalance={this.state.stakingBalance}
          hasClaimBob={this.state.hasClaimBob}
          claimToken={this.claimToken}
          purchaseToken={this.purchaseToken}
          startGame={this.startGame}
          joinGame={this.joinGame}
          currentGames={this.state.currentGames}
          historyGames={this.state.historyGames}
        />
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "1100px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
