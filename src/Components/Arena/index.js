import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import bagContext from "../../context/Context";
import sound from '../../media/battle.mp3';
import myEpicGame from "../../utils/MyEpicGame.json";
import Header from "../Header";
import LoadingIndicator from "../LoadingIndicator";
import "./Arena.css";

/*
 * Passamos os metadados do nosso personagem NFT para que podemos ter um card legal na nossa UI
 */
const Arena = () => {
  // estado

  const {characterNFT, setCharacterNFT } = useContext(bagContext);

  const [gameContract, setGameContract] = useState(null);

  const [boss, setBoss] = useState(null);

  const [attackState, setAttackState] = useState("");

  const [showToast, setShowToast] = useState(false);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('attacking');
        console.log('Atacando o Boss...');
        const txn = await gameContract.attackBoss();
        await txn.wait();
        console.log(txn);
        setAttackState('hit');
  
        /*
        * Configura seu estado toast para true e depois Falso 5 segundos depois
        */
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao atacar o boss:', error);
      setAttackState('');
    }
  };

// UseEffects
useEffect(() => {
    const fetchBoss = async () => {
        const bossTxn = await gameContract.getBigBoss();
        console.log('Boss:', bossTxn);
        setBoss(transformCharacterData(bossTxn));
    };

    /*
    * Configura a lógica quando esse evento for disparado
    */
    const onAttackComplete = (newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Atualiza o hp do boss e do player
        */
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

    /*
    * Tem certeza de limpar esse evento quando componente for removido
    */
    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
}, [gameContract]);

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
      console.log("Objeto Ethereum não encontrado");
    }
  }, []);

  return (
  <div className="arena-container">
        <br></br>
        <h1>ARENA</h1>
        <Header />
        <br></br>
              <audio
                data-testid="audio-component"
                src={ sound }
                autoPlay
                loop
                controls
              >
                <track
                  kind="captions"
                />
                O seu navegador não suporta o elemento
                {' '}
                {' '}
                <code>audio</code>
                .
                </audio>
                <br></br>
                <div className="arena-container2">
                <br></br>
    {boss && characterNFT && (
      <div id="toast" className={showToast ? "show" : ""}>
        <div id="desc">{`💥 ${boss.name} tomou ${characterNFT.attackDamage} de dano!`}</div>
      </div>
    )}
    
    {/* Personagem NFT */}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Personagem ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <br></br>
            <div className="stats">
              <h4>{`⚔️ Dano de Ataque: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
      {attackState === "attacking" ? (
        <div className="loading-indicator">
          <LoadingIndicator />
          <p>Atacando ⚔️</p>
        </div>
      ): <div className="attack-container">
      <button className="cta-button" onClick={runAttackAction}>
        {`💥 Atacar `}
      </button>
      </div>}
     {/* Boss */}
     {boss && (
       <div className="boss-container">
       <br></br>
       <br></br>
       <br></br>
        <div className={`boss-content  ${attackState}`}>
          <h2>👽 {boss.name} 👽</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
          <br></br>
            <div className="stats">
              <h4>{`⚔️ Dano de Ataque: ${boss.attackDamage}`}</h4>
            </div>
        </div>
      </div>
    )}
  </div>
  </div>
);
};

export default Arena;