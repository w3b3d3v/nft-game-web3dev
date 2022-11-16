import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import bagContext from "../../context/Context";
import sound from '../../media/pokecenter.mp3';
import myEpicGame from "../../utils/MyEpicGame.json";
import Footer from "../Footer";
import Header from "../Header";
import LoadingIndicator from "../LoadingIndicator";
import Popup from "./Popup";
import "./SelectCharacter.css";

/*
 * Não se preocupe com setCharacterNFT ainda, vamos falar dele logo.
 */
const SelectCharacter = ({ setCharacterNFT }) => {

  const { characters,
    gameContract,
    mintingCharacter,
    setCharacters,
    setGameContract,
    setMintingCharacter} = 
    useContext(bagContext);

    const [popBtn, setPopBtn] = useState(false);

    const [infoCards, setInfoCards] = useState('');

    const mintCharacterNFTAction = (characterId) => async () => {
      try {
        if (gameContract) {
          /*
           * Mostre nosso indicador de carregamento
           */
          setMintingCharacter(true);
          console.log("Mintando personagem...");
          const mintTxn = await gameContract.mintCharacterNFT(characterId);
          await mintTxn.wait();
          console.log(mintTxn);
          /*
           * Esconde nosso indicador de carregamento quando o mint for terminado
           */
          setMintingCharacter(false);
        }
      } catch (error) {
        console.warn("Ação de mintar com erro: ", error);
        /*
         * Se tiver um problema, esconda o indicador de carregamento também
         */
        setMintingCharacter(false);
      }
    };
  
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
  
        /*
         * Essa é a grande diferença. Configura nosso gameContract no estado.
         */
        setGameContract(gameContract);
      } else {
        console.log("Objeto Ethereum não encontrado");
      }
    }, []);

    const clickimage = (character) => {
      <img src={character.imageURI} alt={character.name} />
    }
  
    useEffect(() => {
      const getCharacters = async () => {
        try {
          console.log("Trazendo personagens do contrato para mintar");
  
          const charactersTxn = await gameContract.getAllDefaultCharacters();
          console.log("charactersTxn:", charactersTxn);
  
          const characters = charactersTxn.map((characterData) =>
            transformCharacterData(characterData)
          );
  
          setCharacters(characters);
        } catch (error) {
          console.error("Algo deu errado ao trazer personagens:", error);
        }
      };
  
      /*
       * Adiciona um método callback que vai disparar quando o evento for recebido
       */
      const onCharacterMint = async (sender, tokenId, characterIndex) => {
        // alert(
        //   `Seu NFT está pronto -- veja aqui: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`
        // );
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
  
        /*
         * Uma vez que nosso personagem for mintado, podemos buscar os metadados a partir do nosso contrato e configurar no estado para se mover para a Arena.
         */
        if (gameContract) {
          const characterNFT = await gameContract.checkIfUserHasNFT();
          console.log("CharacterNFT: ", characterNFT);
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      };
  
      if (gameContract) {
        getCharacters();
  
        /*
         * Configurar NFT Minted Listener
         */
        gameContract.on("CharacterNFTMinted", onCharacterMint);
      }
  
      return () => {
        /*
         * Quando seu componente se desmonta, vamos limpar esse listener
         */
        if (gameContract) {
          gameContract.off("CharacterNFTMinted", onCharacterMint);
        }
      };
    }, [gameContract]);
  
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
  
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };
  
    const handleInfo = (car) => {
      setPopBtn(true);
      setInfoCards(car);
    };
    
    const renderCharacters = () =>
      characters.map((character, index) => (
        <div className="character-item" key={character.name}>
          <div className="name-container">
          <p onClick={() => handleInfo(character)}>INFO</p>
        </div>
          <img src={character.imageURI} alt={character.name} />
          <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFTAction(index)}
            >{`ESCOLHER ${character.name}`}</button>
        </div>
      ));

    return (
      <div className="select-character-container">
        <br></br>
        <h1>MARKETPLACE</h1>
        <Header />
        <br></br>
        <div>
          <audio
                src={ sound }
                className="audio"
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
                </div>
        <h2>Escolha seu Bagmon.</h2>
        <br></br>
        {characters.length > 0 && (
          <div className="character-grid">{renderCharacters()}</div>
        )}
        {mintingCharacter && (
          <div className="loading">
            <div className="indicator">
              <LoadingIndicator />
              <p>Criando bagmon...</p>
            </div>
          </div>
        )}
         <Popup trigger={popBtn} setTrigger={setPopBtn}>
          <div className="character-item2">
          <img src={infoCards.imageURI} alt={infoCards.name} />
          <div className="atributes">
          <p>{`❤️ MaxHp: ${infoCards.maxHp} ❤️`}</p>
          <p>{`⚔️ AtackDamage: ${infoCards.attackDamage} ⚔️`}</p>
          </div>
          </div>
         {console.log(infoCards)}
          </Popup>
          <br></br>
          <Footer />
      </div>
    );
  };
  
  export default SelectCharacter;