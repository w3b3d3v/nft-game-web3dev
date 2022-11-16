import React from 'react';
import "../App.css";
import Arena from '../Components/Arena';
import Footer from '../Components/Footer';


class ArenaPage extends React.Component {
  render() {
    return (
      <>
        <Arena />
        <Footer />
        </>
    );
  }
}

export default ArenaPage;