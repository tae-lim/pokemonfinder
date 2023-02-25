import React, { useState } from 'react';
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement
);

export default function PokemonModal({ pokemon, selectedPokemon, pokemonDetailModalIsOpen, setPokemonDetailModalIsOpen, setPokemon }) {
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
          <Box flex="1">
            <img src={selectedPokemon.image} alt="mew" />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="space-between" flex="2">
            <Box mb={2}>
              <Typography id="modal-pokemon-title" variant="h6" component="h2">
                {selectedPokemon.name}
              </Typography>
              <Typography id="modal-pokemon-description" sx={{ mt: 2 }}>
                {selectedPokemon.description || 'Pending'}
              </Typography>
              <Box display="flex">
                <Box display="flex" flexDirection="column">
                  <Typography id="modal-pokemon-height" sx={{ mt: 2 }}>
                    {`Height: ${selectedPokemon.height / 10}m`}
                  </Typography>
                  <Typography id="modal-pokemon-height" sx={{ mt: 2 }}>
                    {`Weight: ${selectedPokemon.weight} lbs`}
                  </Typography>
                  <Typography id="modal-pokemon-gender" sx={{ mt: 2 }}>
                    Male | Female
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">

                </Box>
              </Box>
            </Box>
            <Box flex="1" display="flex" justifyContent="center" alignItems="center">
              <Radar
                data={{
                  labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
                  datasets: [
                    {
                      data: [selectedPokemon.hp, selectedPokemon.attack, selectedPokemon.defense, selectedPokemon.sp_attack, selectedPokemon.sp_defense, selectedPokemon.speed],
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Box>
            {deleteClicked ? 
              <Box width="100%" display="flex" flexDirection="row">
                <Button onClick={(e) => handleDelete(e, selectedPokemon.id)}>Permanently Delete</Button>
                <Button onClick={() => setDeleteClicked(false)}>Cancel</Button>
              </Box> :
              <Button onClick={() => setDeleteClicked(true)}>Delete</Button>
            }
            
          </Box>
        </Box>
      </Box>
    </Modal>
  )
};

