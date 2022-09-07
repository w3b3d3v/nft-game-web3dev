import React from 'react';
import "../App.css";
import Footer from '../Components/Footer';
import SelectCharacter from '../Components/SelectCharacter';

class SelectCharacterPage extends React.Component {
  render() {
    return (
      
        <>
        <SelectCharacter />
        <Footer />
        </>
    );
  }
}

export default SelectCharacterPage;