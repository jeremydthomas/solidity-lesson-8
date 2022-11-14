import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const CONTACT_ADDRESS = "0x7803c3F6d8560e669f3cf0aB241AAcB1fe9EA1DC";

async function main() {
  const providerOptions = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  };

  const provider = ethers.getDefaultProvider("goerli", providerOptions);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();

  console.log(
    `connected to the account of address ${
      signer.address
    } with balance ${balanceBN.toString()} \n This account has a balance of  ${balanceBN.toString()} Wei`
  );

  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = ballotContractFactory.attach(CONTACT_ADDRESS);

  console.log("casting vote");
  const castVoteTx = await ballotContract.vote(0);
  const castVoteReceipt = await castVoteTx.wait();
  console.log(`Transaction receipt: ${castVoteReceipt}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
