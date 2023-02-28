import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Papa from 'papaparse';
import { AToJPolylines, KtoZPolylines } from '../utils/polylines';
import { PokeballIcon } from '../icons/icons';

export default function PokemonAddModal({
  pokemonAddModalIsOpen,
  setPokemonAddModalIsOpen,
  setNewPokemon
}) {
  const [pokemon, setPokemon] = useState([]);
	const [uploadClicked, setUploadClicked] = useState(false);

  const handleCSVUpload = (e) => {
		setUploadClicked(true);
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setPokemon(formatData(results.data));
      }
    });
  };

  const fixDecialPlaces = (num, places) => {
    return Number(num).toFixed(places);
  };

  const formatData = (pokemon) => {
    return pokemon.map((item) => {
      if (item.Long && item.Lat) {
        return {
          ...item,
          Lat: Number(fixDecialPlaces(item.Lat, 6)),
          Long: Number(fixDecialPlaces(item.Long, 6)),
          polyline: null
        };
      } else {
        return { ...item, Lat: null, Long: null, polyline: selectPolylineSource(item) };
      }
    });
  };

  const selectPolylineSource = (pokemon) => {
    return pokemon.Pokemon[0].toLowerCase() < 'k'
      ? getRandomPolyline(AToJPolylines)
      : getRandomPolyline(KtoZPolylines);
  };

  const getRandomPolyline = (polylines) => {
    const selectedPolylines = polylines.coordinates;
    const polylinesIdx = Math.floor(Math.random() * selectedPolylines.length);
    return selectedPolylines[polylinesIdx].map((polyline) => ({
      lat: polyline[1],
      lng: polyline[0]
    }));
  };

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
				handleCancel();
      } else {
        throw Error('Unable to save pokemon');
      }
    } catch (e) {
      console.error(e);
    }
  };

	const handleCancel = () => {
		setPokemon([]);
		setUploadClicked(false);
	}
 
  return (
    <Modal open={pokemonAddModalIsOpen || false} onClose={() => setPokemonAddModalIsOpen(false)}>
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
        }}>
				<Box display="flex" flexDirection="center" alignItems="center">
					<PokeballIcon color="red" />
					<Typography sx={{marginLeft:"20px", marginRight:"20px"}} id="modal-add-pokemon-title" variant="h5">
						Add Pokemon
					</Typography>
					<PokeballIcon color="red" />
				</Box>
				<img src="https://i.pinimg.com/564x/fc/72/64/fc7264aee3d47b8b8065a1903b71d9be.jpg" alt="Gotta Catch'em All" />
				<TableContainer sx={{ border: '1px solid black'}}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Pokemon</TableCell>
								<TableCell>Lat</TableCell>
								<TableCell>Long</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Location</TableCell>
								<TableCell>Latest Moves</TableCell>
								<TableCell>Sprite</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Mew</TableCell>
								<TableCell>34.10214701</TableCell>
								<TableCell>-118.9104645</TableCell>
								<TableCell>Psychic</TableCell>
								<TableCell>Floaroma Town</TableCell>
								<TableCell>[shadow-ball, ancient-power, future-sight, whirlpool]</TableCell>
								<TableCell>http://www.pokemon.com/mew/img</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Typography sx={{marginBottom:"20px", marginTop:"20px", color:"grey"}} id="modal-add-pokemon-description">
          You can add Pokemon here. Currently only supports .csv
        </Typography>

				{
				uploadClicked ? 
					<Box display="flex" justifyContent="space-around">
						<Button sx={{marginRigh: '10px'}}  variant="contained" color="primary" fullWidth onClick={handleSubmit}>
							Submit
						</Button>
						<Button sx={{marginLeft: '10px'}} variant="contained" color="primary" fullWidth onClick={handleCancel}>
						Cancel
					</Button>
					</Box> : 
					<Button
						variant="contained"
						component="label"
						>
						Upload File
						<input
							type="file"
							accept=".csv"
							onChange={handleCSVUpload}
							hidden
						/>
						</Button>
					
				}
				

      </Box>
    </Modal>
  );
}
