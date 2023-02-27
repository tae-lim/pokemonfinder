import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Modal, Box, Typography, Button } from '@mui/material';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { pokemonTypeColors } from '../utils/pokemonTypeColors';
import Weather from './Weather';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement
);

export default function PokemonModal({ pokemon, selectedPokemon, pokemonDetailModalIsOpen, setPokemonDetailModalIsOpen, setPokemon }) {
  const { user } = useContext(AuthContext);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const handleDelete = async (e, id) => {
    setDeleteClicked(false);
    setPokemonDetailModalIsOpen(false);
    try {
			const res = await fetch(`http://127.0.0.1:8000/api/pokefinder/${id}/delete`, {
				method: 'DELETE'
			});
			if (res.status === 204) {
        const filteredPokemon = pokemon.filter(item => item.id !== id)
        setPokemon(filteredPokemon);
			} else {
				throw Error('Unable to delete pokemon');
			}
		} catch(e) {
      console.error(e);
    }
  }

  const handleClose = () => {
    setDeleteClicked(false);
    setPokemonDetailModalIsOpen(false)
  }

  const handleAddFavorite = async (e, id) => {
    e.preventDefault();
    try {
			const res = await fetch(`http://localhost:8000/api/users/${user.user_id}/favorites/pokemon/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user_id: user.user_id, pokemon_id: id })
			});
			if (res.status === 200 || res.status === 201) {
        const data = await res.json()
			} else {
				throw Error('Unable to favorite pokemon');
			}
		} catch(e) {
      console.error(e);
    }
  }

  const handleRemoveFavorite = async (e, id) => {
    e.preventDefault();
      try {
        const res = await fetch(`http://localhost:8000/api/users/${user.user_id}/favorites/pokemon/${id}/delete`, {
          method: 'DELETE',
        });
        if (res.status === 204) {
          console.log('OMFG DONT TOUCH ANTYING');
        } else {
        	throw Error('Unable to favorite pokemon');
        }
      } catch(e) {
        console.error(e);
      }
  }

  return (
    <Modal
      open={pokemonDetailModalIsOpen}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Box display="flex" flexDirection="row">
          <Box flexDirection="column" justifyContent="space-between">
            <img src={selectedPokemon?.images?.image} alt="mew" />
            {deleteClicked ? 
              <Box width="100%" display="flex" flexDirection="row">
                <Button onClick={(e) => handleDelete(e, selectedPokemon.id)}>Permanently Delete</Button>
                <Button onClick={() => setDeleteClicked(false)}>Cancel</Button>
              </Box> :
              <Button onClick={() => setDeleteClicked(true)}>Delete</Button>
            }
            <Button onClick={(e) =>handleAddFavorite(e, selectedPokemon.id)}>Favorite</Button>
            <Button onClick={(e) =>handleRemoveFavorite(e, selectedPokemon.id)}>Remove Favorite</Button>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="space-between" flex="2">
            <Box mb={2}>
              <Box display="flex" justifContent="space-between">
                <Typography id="modal-pokemon-title" variant="h6" component="h2">
                  {selectedPokemon?.name}
                </Typography>
                <Box display="flex" flexDirection="row">
                  {selectedPokemon?.types?.map(type => (
                    <Box sx={{ backgroundColor: pokemonTypeColors[type], width: '50px', height: '50px' }}>
                      <Typography sx={{ mt: 2 }}>{type}</Typography></Box>
                  ))}
                </Box>
              </Box>
              <Typography id="modal-pokemon-description" sx={{ mt: 2 }}>
                {selectedPokemon?.description}
              </Typography>
              <Box display="flex">
                <Box display="flex" flexDirection="row">
                  <Typography id="modal-pokemon-height" sx={{ mt: 2 }}>
                    {`Height: ${selectedPokemon?.height / 10}m`}
                  </Typography>
                  <Typography id="modal-pokemon-height" sx={{ mt: 2 }}>
                    {`Weight: ${selectedPokemon?.weight} lbs`}
                  </Typography>
                  <Typography id="modal-pokemon-gender" sx={{ mt: 2 }}>
                    {selectedPokemon?.has_gender_differences ? 'Male | Female' : 'Genderless' }
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Weather location={selectedPokemon?.location_area_encounters} lat={selectedPokemon?.lat} lng={selectedPokemon?.lng} />
                </Box>
              </Box>
            </Box>
            <Box flex="1" display="flex" justifyContent="center" alignItems="center">
              <Radar
                data={{
                  labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
                  datasets: [
                    {
                      data: [
                        selectedPokemon?.stats?.hp, 
                        selectedPokemon?.stats?.attack, 
                        selectedPokemon?.stats?.defense, 
                        selectedPokemon?.stats?.sp_attack, 
                        selectedPokemon?.stats?.sp_defense, 
                        selectedPokemon?.stats?.speed
                      ],
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Box>

            
          </Box>
        </Box>
      </Box>
    </Modal>
  )
};

