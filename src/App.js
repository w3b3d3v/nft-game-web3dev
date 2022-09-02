import {useState, useEffect} from 'react';
import {CONTRACT_ADDRESS, transformCharacterData} from "./constants";
import {ethers} from "ethers";

import myEpicGame from "./utils/MyEpicGame.json";
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

import TheBoss from "./assets/the-boss.gif";
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"

export default function App() {
  // Constants
  const TWITTER_HANDLE = "__nsaraiva__"
  const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

  //variável de estado que vamos usar para armazenar a carteira pública do usuário
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");

        // Nós configuramos o isLoading aqui
        // porque usamos o return na proxima linha
        setIsLoading(false);
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }

    // Nós lançamos a propriedade de estado depois de toda lógica da função
    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    // Primeiro precisamos ter certeza que temos acesso ao window.ethereum
    try {
        const {ethereum} = window;

        if (!ethereum) {
          console.log("Instale a MetaMask.");
          return;      
        }

        // Pedir acesso para a conta do usuário
        const accounts = await ethereum.request({ method: "eth_requestAccounts", });

        // Isso deve escrever o endereço público uma vez que autorizarmos Metamask
        console.log("Conectado ", accounts[0]);
        setCurrentAccount(accounts[0]);
    } catch (error) {
        console.error(error);
    }        
  };

  const renderContent = () => {
    // Se esse app estiver carregando, renderize o indicador de carregamento
    if (isLoading) {
      return <LoadingIndicator />
    }

    // Se o usuário não tiver se conectado ao app - Mostre o botão de conectar a carteira
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <p className="sub-text">"Você não tem a menor chance!" 😂😂😂 </p>
          <div className="boss-card">
          <img src={TheBoss} alt="The Boss" />
          <ul>
              <li>Classe: <span>Boss</span></li>
              <li>Nome: <span>Mr. Catra</span></li>
              <li>HP: <span>10000</span></li>
              <li>ATK: <span>50</span></li>
            </ul>
          </div>
          <button className="cta-button connect-wallet-button" onClick={connectWalletAction}>
            Conecte sua carteira e escolha seu herói
          </button>
          <div className="heroes">
            <div className="hero-card">
              <img src="https://www.acessogeek.com/wp-content/uploads/2016/10/metallica.jpg" alt="James Hetfield" />
              <ul>
                <li>#1</li>
                <li>Classe: <span>Herói</span></li>
                <li>Nome: <span>James Hetfield</span></li>
                <li>HP: <span>100</span></li>
                <li>ATK: <span>100</span></li>
              </ul>
            </div>
            <div className="hero-card">
              <img src="https://i.imgur.com/evXxMps.jpeg" alt="Lemmy" />
              <ul>
                <li>#2</li>
                <li>Classe: <span>Herói</span></li>
                <li>Nome: <span>Lemmy</span></li>
                <li>HP: <span>200</span></li>
                <li>ATK: <span>50</span></li>
              </ul>
            </div>
            <div className="hero-card">
              <img src="https://i.imgur.com/MtuyGFk.jpeg" alt="Ozzy Osbourne" />
              <ul>
                <li>#3</li>
                <li>Classe: <span>Herói</span></li>
                <li>Nome: <span>Ozzy Osbourne</span></li>
                <li>HP: <span>300</span></li>
                <li>ATK: <span>25</span></li>
              </ul>
            </div>
          </div>
        </div>
      );
      // Se o usuário tiver se conectado ao app, mas não tem um NFT 
      // mostre o componente de seleção de personagem
    } else if(currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      // Se o usuário tiver se conectado ao app e tem um NFT, é hora de batalhar!
    } else if(currentAccount && characterNFT) {
        return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  }; 

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);
  
  useEffect(() => {    
    const checkNetwork = async () => {
      try {
        if(window.ethereum.networkVersion !== "4") {
          alert(`${window.ethereum.networkVersion} - Please connect to Rinkeby Network`);
        }
      } catch(error) {
        console.log(error);
      }
    }; 

    const fetchNFTMetadata = async () => {
      console.log("Verificando pelo personagem NFT no endereço: ", currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);
  
      const txn = await gameContract.checkIfUserHasNFT();
      if(txn.name) {
        console.log("Usuário tem um personagem NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else{
        console.log("Nenhum personagem NFT foi encontrado");
      }

      setIsLoading(false);
    };    
    
    if(currentAccount) {
      console.log("Conta Atual: ", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🤘 O Heavy Metal vai salvar o mundo! 🤘</p>          
        </div>
        {renderContent()}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`construído por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}
