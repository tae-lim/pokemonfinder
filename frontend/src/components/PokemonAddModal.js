import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import Papa from 'papaparse';
import { AToJPolylines, KtoZPolylines } from '../utils/polylines';

export default function PokemonAddModal({ pokemonAddModalIsOpen, setPokemonAddModalIsOpen, setNewPokemon}) {
  const [pokemon, setPokemon] = useState([]);

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // console.log(formatData(results.data));
        setPokemon(formatData(results.data));
      },
    });
  }

  const fixDecialPlaces = (num, places) => {
    return Number(num).toFixed(places);
  };

  const formatData = pokemon => {
    return pokemon.map(item => {
      if (item.long && item.lat) {
        return { ...item, Lat: fixDecialPlaces(item.lat, 6), Long: fixDecialPlaces(item.long, 6), polyline: null };
      } else {
        return { ...item, Lat: null, Long: null, polyline: selectPolylineSource(item) }
      }
      // const [long, lat] = item.Long && item.Lat ? [item.Long, item.Lat] :  selectPolylineSource(item);
      // return { ...item, lat: fixDecialPlaces(lat, 6), long: fixDecialPlaces(long, 6) };
    })
  }

  const selectPolylineSource = pokemon => {
    return pokemon.Pokemon[0].toLowerCase() < 'k' ? 
      getRandomPolyline(AToJPolylines) :
      getRandomPolyline(KtoZPolylines);
  }

  const getRandomPolyline = polylines => {
    const selectedPolylines = polylines.coordinates;
    const polylinesIdx = Math.floor(Math.random() * selectedPolylines.length);
    return selectedPolylines[polylinesIdx].map(polyline => ( { lat: polyline[1], lng: polyline[0] } ));

    // const polyline = selectedPolylines[polylinesIdx];
    // const polylineIdx = Math.floor(Math.random() * polyline.length);

    // return polyline[polylineIdx];
  }

  const handleSubmit = async (e) => {
		e.preventDefault();
    setPokemonAddModalIsOpen(false);
		try {
      if (!pokemon.length) return;
			const res = await fetch('http://127.0.0.1:8000/api/pokefinder/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(pokemon)
			});
			if (res.status === 200 || res.status === 201) {
				const data = await res.json();
        setNewPokemon(data);
			} else {
				throw Error('Unable to save pokemon');
			}
		} catch(e) {
			console.error(e);
		}
	}

  return (
    <Modal
      open={pokemonAddModalIsOpen}
      onClose={() => setPokemonAddModalIsOpen(false)}
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
          flexDirection: 'column',
          padding: '50px'
        }}
      >
        <Typography id="modal-add-pokemon-title" variant="h6">Add Pokemon</Typography>
        <Typography id="modal-add-pokemon-description">You can add Pokemon here. Currently supports .csv</Typography>
        <Box sx={{height: '50px', width: '100%'}}>
          <input 
            type="file"
            name="file"
            accept=".csv"
            onChange={handleCSVUpload}
          />
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  )
}