import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Inventory from "./Components/Inventory";
import SelectCharacter from "./Components/SelectCharacter";
import ArenaPage from "./Pages/ArenaPage";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";

const App = () => {
  return (

    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/dashboard" component={ Dashboard } />
      <Route exact path="/characterselect" component={ SelectCharacter } />
      <Route exact path="/inventory" component={ Inventory } />
      <Route exact path="/arena" component={ ArenaPage } />
    </Switch>
  );
};

export default App;
