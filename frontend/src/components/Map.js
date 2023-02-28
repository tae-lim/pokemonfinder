import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import PokemonModal from './PokemonModal';
import { pokemonTypeColors } from '../utils/pokemonTypeColors';

const containerStyle = {
  width: '75%',
  height: '750px'
};

function Map(props) {
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getRandomTypeColor = (types) => {
    const idx = Math.floor(Math.random() * types.length);
    return pokemonTypeColors[types[idx]];
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap mapContainerStyle={containerStyle} center={props.center || {}} zoom={15}>
        {/* Child components, such as markers, info windows, etc. */}
        <Marker position={{ lat: 34.07, lng: -118.4398 }} />
        {props.pokemon &&
          props.pokemon.map((pokemon) => {
            const path = pokemon.polyline;
            const color = getRandomTypeColor(pokemon.types);

            const options = {
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.35,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              radius: 30000,
              paths: pokemon.polyline,
              zIndex: 1
            };
            return (
              <>
                {pokemon?.polyline && <Polyline path={path} options={options} />}
                <Marker
                  icon={pokemon?.images?.sprite}
                  position={{ lat: Number(pokemon.lat), lng: Number(pokemon.lng) }}
                  onClick={(e) => props.handleClick(e, pokemon)}
                />
              </>
            );
          })}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
