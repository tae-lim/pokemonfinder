import React, { useState, useEffect } from 'react';
import { Container, Divider, Box } from '@mui/material';

import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PokemonModal from '../components/PokemonModal';
import PokemonAddModal from '../components/PokemonAddModal';

const uclaCenter = {
	lat: 34.0700,
	lng: -118.4398
};

export default function HomePage() {
	const [center, setCenter] = useState(uclaCenter);
	const [pokemon, setPokemon] = useState([]);
	const [selectedPokemon, setSelectedPokemon] = useState({});
	const [pokemonDetailModalIsOpen, setPokemonDetailModalIsOpen] = useState(false);
	const [pokemonAddModalIsOpen, setPokemonAddModalIsOpen] = useState(false);

	useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/pokefinder/');
      if (res.status === 200) {
        const data = await res.json();
        setPokemon(data);
      } else {
        throw Error('Unable to retrive Pokemon List');
      }
    } catch(e) {
      console.error(e);
    }
  }

	const handleClick=(e, pokemon) => {
		setSelectedPokemon(pokemon);
    setPokemonDetailModalIsOpen(true);
		setCenter({
			lat: Number(pokemon.lat),
			lng: Number(pokemon.long)
		});
	}

  return (
		<Container maxWidth="xl" display="flex" justifyContent="center" height="100%" sx={{marginLeft: { sm: '290px' }}}>
			<Box display="flex" justifyContent="space-around" flexDirection="column" width={"100%"}>
				<Sidebar pokemon={pokemon} handleClick={handleClick} setPokemonAddModalIsOpen={setPokemonAddModalIsOpen}/>
				<Header />
				<Divider variant="middle" color="primary" sx={{ my: 1 }} />
				<Map pokemon={pokemon} center={center} handleClick={handleClick} />
			</Box>
			<PokemonModal pokemonDetailModalIsOpen={pokemonDetailModalIsOpen} setPokemonDetailModalIsOpen={setPokemonDetailModalIsOpen} pokemon={pokemon} selectedPokemon={selectedPokemon} setPokemon={setPokemon}/>
			<PokemonAddModal pokemonAddModalIsOpen={pokemonAddModalIsOpen} setPokemonAddModalIsOpen={setPokemonAddModalIsOpen}/>
		</Container>
	)
}