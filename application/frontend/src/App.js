import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Genres} from './components/Genres'
import { GenreForm } from './components/genreForm';
import {Container} from 'semantic-ui-react'


function App() {
  const [genres,setGenres] = useState([])
  useEffect(() => {
    fetch("/genre/list").then(response =>
       response.json().then(data => {
          setGenres(data.response)
        })
    );
  },[]);

  console.log(genres)
  return (
    <div className="App">
    <Container style={ {marginTop: 80} }>
      <GenreForm />
      <Genres genres = {genres} />
    </Container>
    
    </div>
  );
}

export default App;
