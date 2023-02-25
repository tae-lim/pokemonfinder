import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PokemonModal from './PokemonModal';

const containerStyle = {
  width: '75%',
  height: '750px'
};

function Map(props) {
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = (e, pokemon) => {
    setSelectedPokemon(pokemon);
    setModalIsOpen(true);
  }

  
  return (
    <>
    <PokemonModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} pokemon={selectedPokemon}/>
    <LoadScript
      googleMapsApiKey=""
      >
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={props.center || {}}
        zoom={14}
        >
        { /* Child components, such as markers, info windows, etc. */ }
        {props.pokemon && props.pokemon.map(pokemon => (
          <Marker 
            icon={pokemon.sprite}
            position={{lat: Number(pokemon.lat), lng: Number(pokemon.long)}}
            onClick={(e) => handleClick(e, pokemon)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
    </>
  )
}

export default React.memo(Map)