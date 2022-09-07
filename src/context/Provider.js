import { ethers } from "ethers";
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../App.css';
import Arena from '../Components/Arena';
import Inventory from "../Components/Inventory";
import LoadingIndicator from '../Components/LoadingIndicator';
import SelectCharacter from '../Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from "../constants";
import bilu from '../imgs/150.png';
import bivaldo from '../imgs/151.png';
import grayscale from '../imgs/grayscale.png';
import iniciais from '../imgs/iniciais.png';
import loginimg from '../imgs/login.png';
import myEpicGame from "../utils/MyEpicGame.json";
import bagContext from './Context';

function Provider({ children }) {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [characters, setCharacters] = useState([]);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);  
    const [attackState, setAttackState] = useState("");
    const [showToast, setShowToast] = useState(false);

  const history = useHistory();

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Parece que você não tem a metamask instalada!");
        /*
         * Nós configuramos o isLoading aqui porque usamos o return na proxima linha
         */
        setIsLoading(false);
        return;
      } else {
        console.log("Objeto ethereum encontrado:", ethereum);
  
        const accounts = await ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada:", account);
          setCurrentAccount(account);
        } else {
          console.log("Não foi encontrada uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * Nós lançamos a propriedade de estado depois de toda lógica da função
     */
    setIsLoading(false);
  };


  const characterPage = () => {
    <SelectCharacter setCharacterNFT={setCharacterNFT} />
    history.push('/characterselect');
  };

  const inventoryPage = () => {
    <Inventory characterNFT={characterNFT} />
    history.push('/inventory');
  };
  
  const arenaPage = () => {
    <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    history.push('/arena');
  };
  // Métodos de renderização
  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />;
    }
    
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <div className="imgwal">
          <img
            src={loginimg} alt="bagwallpaper"
          />
          <button
            id="testebtn"
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
          </div>
        </div>
      );
    } else if (currentAccount) {
      return (
        <div className="connect-wallet-container">
          <div className="imgwal2">
          <img
            src={bivaldo}
            alt="inventory"
            onClick={inventoryPage}
          /><p>Inventory</p>
          </div>
          <div className="imgwal2">
      
          <img
            src={iniciais}
            alt="bagwallpaper"
            onClick={characterPage}
          />
          <p>
            Marketplace
          </p>
          </div>
          {
            characterNFT ? (
          <div className="imgwal2">
          <img
            src={bilu}
            alt="bilu"
            onClick={arenaPage}
          />        
          <p>
            Arena
          </p>
          </div>
          ): <div className="imgwal2">
          <img
            src={grayscale}
            alt="bilucinza"
            onClick={() => alert("Você precisa ter um Bagmon para duelar")}
          />        
          <p>
            Arena
          </p>
          </div>}
          </div>
      );
    }
  };

  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * A função que vamos chamar que interage com nosso contrato inteligente
     */
    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço:", currentAccount);
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("Usuário tem um personagem NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("Nenhum personagem NFT foi encontrado");
      }

      setIsLoading(false);
    };
    
    /*
     * Nós so queremos rodar isso se tivermos uma wallet conectada
     */
    if (currentAccount) {
      console.log("Conta Atual:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const context = {
    currentAccount,
    characterNFT,
    isLoading,
    characters,
    mintingCharacter,
    boss,
    attackState, 
    showToast,
    gameContract,
    renderContent,
    setCharacters,
    setGameContract,
    setMintingCharacter,
    setIsLoading
  };

  return (
    <bagContext.Provider
      value={ context }
    >
      {children}
    </bagContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
