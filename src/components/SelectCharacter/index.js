import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './SelectCharacter.css';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

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
                console.error('Something went wrong fetching characters:', error);
            }
        };

        
    }, [gameContract]);

    

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
            Hello
        </div>
    );
};

export default SelectCharacter;