import MyEpicGame from './utils/MyEpicGame.json';
import React, { useEffect, setCurrentAccount, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import { ethers } from 'ethers';
import twitterLogo from './assets/twitter-logo.svg';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  /*
* New state property added here
*/
const [isLoading, setIsLoading] = useState(false);
  
  /*
   * Start by creating a new action that we will run on component load
   */
  // Actions
  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

// Render Methods
const renderContent = () => {
    if (isLoading) {
    return <LoadingIndicator />;
  }
  /*
   * Scenario #1
   */
  if (!currentAccount) {
    return (



      <div className="connect-wallet-container">
        <img
            src="data:image/jpeg;base64,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"
            alt="kitten vs racoon"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;	
	/*
	* If there is a connected wallet and characterNFT, it's time to battle!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT}
    setCharacterNFT={setCharacterNFT} />;
  }
}; 


  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };



// UseEffects
useEffect(() => {
  /*
   * Anytime our component mounts, make sure to immiediately set our loading state
   */
  setIsLoading(true);
  checkIfWalletIsConnected();
}, []);

  /*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MyEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    }

        /*
     * Once we are done with all the fetching, set loading state to false
     */
    setIsLoading(false);
  };

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Cats ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse from Racoons!</p>
        </div>
        <div className="connect-wallet-container">
                      {/*
             * Button that we will use to trigger wallet connect
             * Don't forget to add the onClick event to call your method!
             */}
            {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;