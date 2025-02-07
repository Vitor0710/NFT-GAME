import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import LoadingIndicator from './components/LoadingIndicator';
import myEpicGame from "./artifacts/contracts/MyEpicGame.sol/MyEpicGame.json";
import SelectCharacter from './components/SelectCharacter';
import Arena from './components/Arena';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import twitterLogo from './assets/twitter-logo.svg';

import { toast } from 'react-toastify';

// Constants
const TWITTER_HANDLE = '_abiodunAwoyemi';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  toast.configure({
    autoClose: 7000,
    draggable: true,
  });
  
  const checkIfWalletIsConnected = async() => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        // console.log('Make sure you have MetaMask!');
        setIsLoading(false);
        toast.dismiss();
        toast.info("Make sure you have metaMask!", {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
          // toast.dismiss();
          // toast.error('No authorized account found', {
          //   position: "top-right",
          //   pauseOnHover: true,
          //   draggable: false,
          // });
        }
        setIsLoading(false);
      }
    } catch (error) {
      // console.log(error);
      toast.dismiss();
      toast.error(error.message, {
        position: "top-right",
        pauseOnHover: true,
        draggable: false,
      });
      setIsLoading(false);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        // alert('Get MetaMask!');
        toast.dismiss();
        toast.info('Get MetaMask!', {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      toast.dismiss();
      toast.success('Connected Successfully', {
        position: "top-right",
        pauseOnHover: true,
        draggable: false,
      });
    } catch (error) {
      // console.log(error);
      toast.dismiss();
      toast.error(error.message, {
        position: "top-right",
        pauseOnHover: true,
        draggable: false,
      });
    }
  };

  // Render Methods
  const renderContent = () => {
    /*
    * If the app is currently loading, just render out LoadingIndicator
    */
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter 
        setCharacterNFT={setCharacterNFT}
        myEpicGame={myEpicGame} 
      />;
    } else if (currentAccount && characterNFT) {
      return <Arena 
        characterNFT={characterNFT} 
        setCharacterNFT={setCharacterNFT} 
        myEpicGame={myEpicGame} 
      />;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      console.log(txn);
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        // console.log('No character NFT found');
        toast.dismiss();
        toast.info('No character NFT found', {
          position: "top-right",
          pauseOnHover: true,
          draggable: false,
        });
      }
      setIsLoading(false);
    };

    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
