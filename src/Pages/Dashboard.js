import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import "../App.css";
import Footer from "../Components/Footer";
import bagContext from "../context/Context";
import sound from '../media/pokecenter.mp3';

const ConnectMask = () => {
  const history = useHistory();

  const { renderContent, isLoading, setIsLoading } = useContext(bagContext);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">BÁGDEX JORNADA BRASIL</p>
          <p className="sub-text">Junte os amigos e proteja o mundo dos bagmons!!</p>
          <button
          type="button" class="btn btn-danger"
          onClick={()=> history.push('/')}>
          LOGOUT
        </button>
        <br></br>
        <br></br>
          <div>
          <audio
                src={ sound }
                id="myaudio"
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
                
                <br></br>
                <div>
          {renderContent()}
          </div>
        </div>
        <br></br>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br> 
      <br></br>
          <Footer />
    </div>
  );
};

export default ConnectMask;
