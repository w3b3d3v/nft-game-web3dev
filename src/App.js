import React from "react"
import twitterLogo from "./assets/twitter-logo.svg"
import "./App.css"

// Constants
const TWITTER_HANDLE = "web3dev_"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte-se a mim para vencer os inimigos do Metaverso!</p>
          <div className="connect-wallet-container">
            <img
              src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
              alt="Nascimento Gif"
            />
          </div>
        </div>
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

export default App
