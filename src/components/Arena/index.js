import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import './Arena.css';
import LoadingIndicator from '../LoadingIndicator';

const Arena = ({ characterNFT, setCharacterNFT, myEpicGame }) => {
    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);
    const [attackState, setAttackState] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Actions
    const runAttackAction = async () => {
        try {
        if (gameContract) {
            setAttackState('attacking');
            console.log('Attacking boss...');
            const attackTxn = await gameContract.attackBoss();
            await attackTxn.wait();
            console.log('attackTxn:', attackTxn);
            setAttackState('hit');

            setShowToast(true);
            setTimeout(() => {
            setShowToast(false);
            }, 5000);
        }
        } catch (error) {
        console.error('Error attacking boss:', error);
        setAttackState('');
        }
    };

    // UseEffects
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
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            setBoss((prevState) => {
                return { ...prevState, hp: bossHp };
            });

            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

        if (gameContract) {
            fetchBoss();
            gameContract.on('AttackComplete', onAttackComplete);
        }

        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete);
            }
        }
    }, [gameContract]);


  return (
    <div className="arena-container">
      Hello
    </div>
  );
};

export default Arena;