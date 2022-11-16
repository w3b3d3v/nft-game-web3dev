import React from 'react';
import { useHistory } from 'react-router-dom';
import './Header.css';

function Header() {
  const history = useHistory();
  return (
      <header>
        <button type='button'
        class="btn btn-success"
        onClick={()=> history.push('/dashboard')}
        >
          HOME
        </button>
      </header>
  );
}

export default Header;
