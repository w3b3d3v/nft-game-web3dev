import React, { useContext } from "react";
import bagContext from "../../context/Context";
import Footer from "../Footer";
import Header from "../Header";
import "./Inventory.css";

const Inventory = () => {
  const { characterNFT } = useContext(bagContext);
  console.log(characterNFT);
  return(
    <div className="select-character-container">
    <br></br>
    <h1>INVENTORY</h1>
    <Header />
    <br></br>
    {characterNFT && (
      <div className="players-container2">
        <div className="player-container2">
          <div className="player2">
            <div className="image-content2">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Personagem ${characterNFT.name}`}
              />
              <div className="health-bar2">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats2">
              <h4>{`⚔️ Dano de Ataque: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
    <Footer />
    </div>
  )
}

export default Inventory;