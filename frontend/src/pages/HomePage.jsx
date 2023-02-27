import React, { useState, useEffect, useContext } from 'react';
import { Container, Divider, Box } from '@mui/material';
import AuthContext from '../context/AuthContext';
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
	const { user } = useContext(AuthContext);
	const [center, setCenter] = useState(uclaCenter);
	const [pokemon, setPokemon] = useState([]);
	const [favoritePokemon, setFavoritePokemon] = useState([]);
	const [selectedPokemon, setSelectedPokemon] = useState({});
	const [pokemonDetailModalIsOpen, setPokemonDetailModalIsOpen] = useState(false);
	const [pokemonAddModalIsOpen, setPokemonAddModalIsOpen] = useState(false);

	useEffect(() => {
    fetchPokemon();
		fetchFavoritePokemon();
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

	const fetchFavoritePokemon = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.user_id}/favorites/pokemon`);
      if (res.status === 200) {
        const data = await res.json();
        setFavoritePokemon(data);
      } else {
        throw Error('Unable to retrive Favorite Pokemon List');
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
			lng: Number(pokemon.lng)
		});
	}

  return (
		<Container maxWidth="xl" display="flex" justifyContent="center" height="100%" sx={{marginLeft: { sm: '290px' }}}>
			<Box display="flex" justifyContent="space-around" flexDirection="column" width={"100%"}>
				<Sidebar pokemon={pokemon} favoritePokemon={favoritePokemon} handleClick={handleClick} setPokemonAddModalIsOpen={setPokemonAddModalIsOpen}/>
				<Header />
				<Divider variant="middle" color="primary" sx={{ my: 1 }} />
				<Map pokemon={pokemon} center={center} handleClick={handleClick} />
			</Box>
			<PokemonModal pokemonDetailModalIsOpen={pokemonDetailModalIsOpen} setPokemonDetailModalIsOpen={setPokemonDetailModalIsOpen} pokemon={pokemon} selectedPokemon={selectedPokemon} setPokemon={setPokemon}/>
			<PokemonAddModal pokemonAddModalIsOpen={pokemonAddModalIsOpen} setPokemonAddModalIsOpen={setPokemonAddModalIsOpen} setNewPokemon={setPokemon}/>
		</Container>
	)
}