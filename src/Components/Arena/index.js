import {useEffect, useState} from 'react';
import {ethers} from "ethers";
import {CONTRACT_ADDRESS, transformCharacterData} from "../../constants";

import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from '../LoadingIndicator';

export default function Arena({characterNFT, setCharacterNFT}) {
    // state
    const [gameContract, setGameContract] = useState(null);

    // Estado para armazenar os metadados do Boss
    const [boss, setBoss] = useState(null);

    const [attackState, setAttackState] = useState("");

    const renderBoss = () => {
        if(boss){
            return (
                <div className="boss-container">
                    <div className="health-bar">
                        <progress value={boss.hp} max={boss.maxHp} />
                        <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                    </div>
                    <span>{boss.name}</span>
                    <div className={`player-content ${attackState}`}>
                        <div className="image-content">
                            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    const renderHero = () => {
        if(characterNFT){
            return (
                <div className="hero-container">
                    <div className="health-bar">
                        <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                        <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                    </div>
                    <span>{characterNFT.name}</span>
                    <div className={`player-content`}>
                        <div className="image-content">
                            <img src={characterNFT.imageURI} alt={`Boss ${characterNFT.name}`} />
                        </div>
                    </div>
                </div>
            );
        }
    }


    const runAttackAction = async () => {
        try {
          if (gameContract) {
            setAttackState("attacking");
            console.log("Atacando o boss...");
            const attackTxn = await gameContract.attackBoss();
            await attackTxn.wait();
            console.log("attackTxn:", attackTxn);
            setAttackState("hit");
          }
        } catch (error) {
          console.error("Erro atacando o boss:", error);
          setAttackState("");
        }
    };

    useEffect(() => {
        // Configurando função async que vai pegar o boss do nosso contrato e setar ele no estado
        const fetchBoss = async () => {
            try {
                const bossTxn = await gameContract.getBigBoss();
                console.log("Boss: ", bossTxn);
                setBoss(transformCharacterData(bossTxn));
            } catch (error) {
                console.log("Erro ao buscar boss: ", error);
            };

        };

        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss HP: ${bossHp} Player HP: ${playerHp}`);

            //Atualiza o Hp do boss e do heroi
            setBoss(prevState => {
                return {...prevState, hp: bossHp};
            });
            setCharacterNFT(prevState => {
                return {...prevState, hp: playerHp};
            });
        };

        if(gameContract) {
            // gameContract está pronto! Vamos buscar nosso boss
            fetchBoss();
            gameContract.on("AttackComplete", onAttackComplete);
        } 

        //Tem certeza de limpar esse evento quando componente for removido
        return () => {
            if(gameContract){
                gameContract.off("AttackComplete", onAttackComplete);
            }
        }
    }, [gameContract]);
    
    useEffect(() => {
        const {ethereum} = window;

        if(ethereum) {
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
        <div className="game">
            <div className="arena-container">
                {renderHero()}
                <span className="versus-text">VS</span>
                {attackState === "attacking" && (
                <LoadingIndicator />                    
                )}
                {renderBoss()}
            </div>
            <div className="attack-container">
                <button className="cta-button hadouken" onClick={runAttackAction}>
                    {attackState === "attacking" ? "Atacando..." : "Atacar"}
                    <img src="https://cdn3.emoji.gg/emojis/6945_hadouken_right.png" />
                </button>
            </div>
        </div>
        
    );
}