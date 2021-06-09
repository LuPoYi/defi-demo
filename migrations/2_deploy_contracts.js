const BobToken = artifacts.require("BobToken");
const AirToken = artifacts.require("AirToken");
const PublicSale = artifacts.require("PublicSale");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(BobToken);
  const bobToken = await BobToken.deployed();

  await deployer.deploy(AirToken);
  const airToken = await AirToken.deployed();

  await deployer.deploy(PublicSale, bobToken.address, airToken.address);
  const publicSale = await PublicSale.deployed();

  await bobToken.transfer(publicSale.address, "10000000000000000000000");
  await bobToken.transfer(accounts[1], "15000000000000000000000");
  await bobToken.transfer(accounts[2], "20000000000000000000000");

  await airToken.transfer(accounts[1], "7000000000000000000000");
  await airToken.transfer(accounts[2], "8000000000000000000000");
};
