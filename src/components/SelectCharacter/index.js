import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './SelectCharacter.css';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';

import { toast } from 'react-toastify';

const SelectCharacter = ({ setCharacterNFT, myEpicGame }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);
    const [eventAlert, setEventAlert] = useState("");
    const [show, setShow] = useState(true);

    toast.configure({
        autoClose: 7000,
        draggable: true,
    });

    // UseEffect
    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );
            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');

                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn:', charactersTxn);

                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );

                setCharacters(characters);
            } catch (error) {
                // console.error('Something went wrong fetching characters:', error);
                toast.dismiss();
                toast.info('Something went wrong fetching characters:', error.message, {
                    position: "top-right",
                    pauseOnHover: true,
                    draggable: false,
                });
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT: ', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
            }

            let alert = `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`

            setEventAlert(alert)
        };

        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNFTMinted', onCharacterMint);
        }

        return () => {
            if (gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
        };
    }, [gameContract]);

    // Actions
    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if (gameContract) {
                setMintingCharacter(true);
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('mintTxn:', mintTxn);
                setMintingCharacter(false);
            }
        } catch (error) {
            // console.warn('MintCharacterAction Error:', error);
            toast.dismiss();
            toast.error('MintCharacterAction Error:', error.message, {
            position: "top-right",
            pauseOnHover: true,
            draggable: false,
            });
            setMintingCharacter(false);
        }
    };

    // Render Methods
    const renderCharacters = () =>
        characters.map((character, index) => (
        <div className="character-item" key={character.name}>
            <div className="name-container">
            <p>{character.name}</p>
            </div>
            <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
            <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFTAction(index)}
            >{`Mint ${character.name}`}</button>
        </div>
    ));

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose wisely.</h2>
            {/* Only show this when there are characters in state */}
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
            {/* Only show our loading state if mintingCharacter is true */}
            {mintingCharacter && (
                <div className="loading">
                    <div className="indicator">
                        <LoadingIndicator />
                        <p>Minting In Progress...</p>
                    </div>
                    <img
                        src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                        alt="Minting loading indicator"
                    />
                </div>
            )}

            {eventAlert
                ? show && <div className="alert-modal">
                    <div style={{overflowWrap: "break-word"}}>{ eventAlert }</div>
                
                    <button onClick={() => setShow(false)}>Close</button>
                </div>
                : null 
                }
        </div>
    );
};

export default SelectCharacter;