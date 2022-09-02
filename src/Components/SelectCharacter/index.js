import {useEffect, useState} from 'react';
import {ethers} from 'ethers';

import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import LoadingIndicator from '../LoadingIndicator';

import "./SelectCharacter.css";

export default function SelectCharacter({setCharacterNFT}) {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if(gameContract) {
                setMintingCharacter(true);

                console.log("Mintando personagem...");

                const minTxn = await gameContract.mintCharacterNFT(characterId);
                await minTxn.wait();

                console.log("mintTxn: ", minTxn);

                setMintingCharacter(false);
            }
        } catch (error) {
            console.log("Erro ao mintar personagem: ", error);
        }   
        
        setMintingCharacter(false);
    };

    const renderCharacters = () => 
        characters.map((character, index) => (
            <div className="hero-card" key={character.name}>
              <img src={character.imageURI} alt={character.name} />
              <ul>
                <li>#{index + 1}</li>
                <li>Classe: <span>Herói</span></li>
                <li>Nome: <span>{character.name}</span></li>
                <li>HP: <span>{character.hp}</span></li>
                <li>ATK: <span>{character.attackDamage}</span></li>
              </ul>
              <button onClick={mintCharacterNFTAction(index)}>Select</button>
            </div>
        ));

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
            
            // Configura nosso gameContract no state
            setGameContract(gameContract);
        } else {
            console.log("Objeto Ethereum não encontrado");
        }
    }, [])    
    
    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log("Buscando contrato de personagens para mintar...");
    
                // Chama o contrato para buscar todos os personagens mintaveis
                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log("charactersTxn", charactersTxn);
    
                // Passa por todos os personagens e transforma os dados
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );
                    
                // Configura os personagens no state
                setCharacters(characters);
            } catch (error) {
                console.log("Erro ao buscar personagens: ", error);
            }
        };       
        
        // Adiciona um método callback que vai disparar quando o evento for recebido
        const onCharacterMint = async(sender, tokenId, characterIndex) => {
            console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`);

            if(gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log("characterNFT: ", characterNFT);

                setCharacterNFT(transformCharacterData(characterNFT));
            }
        };                   

        if(gameContract) {
            getCharacters();

            // Configurar NFT Minted Event Listener
            gameContract.on("CharacterNFTMinted", onCharacterMint);
        }

        return () => {
            // Quando seu componente for desmontado, remove o listener
            if(gameContract) {
                gameContract.off("CharacterNFTMinted", onCharacterMint);
            }
        };

    }, [gameContract, setCharacterNFT]);

    return(
        <div className="select-character-container">
            <h2>Minte seu herói. Escolha com sabedoria</h2>
            <div className="heroes">
                {renderCharacters()}
            </div>
            {mintingCharacter && (
            <div className="loading">
                <div className="indicator">
                    <LoadingIndicator />
                    <p>Afinando os instrumentos...</p>
                </div>
                <img
                src="http://pa1.narvii.com/6623/1d810c548fc9695d096d54372b625d207373130a_00.gif"
                alt="Indicador de Mintagem"
                />
            </div>
            )}            
        </div>
    );
}