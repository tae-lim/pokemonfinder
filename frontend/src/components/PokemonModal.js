import React, { useContext, useState, useEffect, Fragment } from 'react';
import AuthContext from '../context/AuthContext';
import { Modal, Box, Divider, Typography, Button } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { pokemonTypeColors } from '../utils/pokemonTypeColors';
import Weather from './Weather';

ChartJS.register(RadialLinearScale, PointElement, LineElement);

const uclaCoordinates = {
  lat: 34.07,
  lng: -118.4398
};

export default function PokemonModal({
  pokemon,
  setCenter,
  favoritePokemon,
  setFavoritePokemon,
  selectedPokemon,
  pokemonDetailModalIsOpen,
  setPokemonDetailModalIsOpen,
  setPokemon
}) {
  const { user } = useContext(AuthContext);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [selectedPokemonDetail, setSelectedPokemonDetail] = useState(selectedPokemon);

  useEffect(() => {
    getDetails(pokemon, favoritePokemon, selectedPokemon);
  }, [pokemon, favoritePokemon, selectedPokemon]);

  const handleDelete = async (e, id) => {
    setDeleteClicked(false);
    setPokemonDetailModalIsOpen(false);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/pokefinder/${id}/delete`, {
        method: 'DELETE'
      });
      if (res.status === 204) {
        const filteredPokemon = pokemon.filter((item) => item.id !== id);
        setPokemon(filteredPokemon);
        setFavoritePokemon(favoritePokemon.filter((item) => item.id !== id));
      } else {
        throw Error('Unable to delete pokemon');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDetails = (pokemon, favoritePokemon, selectedPokemon) => {
    if (!pokemon || !favoritePokemon || !selectedPokemon) return;

    let pokemonDetail = selectedPokemon;
    if (!selectedPokemon?.lat && !selectedPokemon?.lng) {
      const item = pokemon.find((item) => item.id === selectedPokemon.id);
      pokemonDetail = { ...pokemonDetail, lat: item?.lat, lng: item?.lng };
    }
    if (favoritePokemon?.find((item) => item.id === selectedPokemon.id)) {
      pokemonDetail = { ...pokemonDetail, favorite: true };
    } else {
      pokemonDetail = { ...pokemonDetail, favorite: false };
    }

    setCenter({
      lat: pokemonDetail?.lat || uclaCoordinates.lat,
      lng: pokemonDetail?.lng || uclaCoordinates.lng
    });
    setSelectedPokemonDetail(pokemonDetail);
  };

  const handleClose = () => {
    setDeleteClicked(false);
    setPokemonDetailModalIsOpen(false);
  };

  const handleAddFavorite = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${user.user_id}/favorites/pokemon/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id, pokemon_id: id })
        }
      );
      if (res.status === 200 || res.status === 201) {
        const pokemon = { ...selectedPokemonDetail, favorite: true };
        setFavoritePokemon([...favoritePokemon, pokemon]);
        setSelectedPokemonDetail(pokemon);
      } else {
        throw Error('Unable to favorite pokemon');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFavorite = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${user.user_id}/favorites/pokemon/${id}/delete`,
        {
          method: 'DELETE'
        }
      );
      if (res.status === 204) {
        setFavoritePokemon(favoritePokemon.filter((pokemon) => id !== pokemon.id));
        setSelectedPokemonDetail({ ...selectedPokemonDetail, favorite: false });
      } else {
        throw Error('Unable to favorite pokemon');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calcDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat1 || !lat2) return 0;
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const earthRadiusKm = 6371; // radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // distance in km
    return distance.toFixed(2);
  };

  return (
    <Modal
      open={pokemonDetailModalIsOpen || false}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
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
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <Box display="flex" flexDirection="row">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems="center">
						<Typography alignSelf="flex-start" width="50%">
              Distance:{' '}
              {calcDistance(
                selectedPokemonDetail?.lat,
                selectedPokemonDetail?.lng,
                uclaCoordinates.lat,
                uclaCoordinates.lng
              )}{' '}
              KM
            </Typography>
            <img src={selectedPokemonDetail?.images?.image} alt="mew" />
            <Box display="flex" flexDirection="row">
              {selectedPokemonDetail?.moves?.map((move, idx) => {
                return (
                  <Fragment key={`${idx}-${move}`}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      border="1px solid black"
                      width="120px">
                      <Typography>{move.move_name?.split('-').map((move => move[0].toUpperCase() + move.slice(1))).join(' ')}</Typography>
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
          </Box>
          <Divider variant="middle" color="black" sx={{ my: 1 }} />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center">
            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography id="modal-pokemon-title" variant="h6" component="h2" marginLeft="10px">
                  {selectedPokemonDetail?.name}
                </Typography>
                <Box display="flex" width="40%" flexDirection="row" justifyContext="center">
                  {selectedPokemonDetail?.types?.map((type, idx) => (
                    <Fragment key={`${idx}-${type}`}>
                      <Box
                        ml="10px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="40px"
                        width="50%"
                        sx={{ backgroundColor: pokemonTypeColors[type], borderRadius: '10%' }}>
                        <Typography>{type[0].toUpperCase() + type.slice(1)}</Typography>
                      </Box>
                    </Fragment>
                  ))}
                </Box>
                {selectedPokemonDetail?.favorite ? (
                  <Star
                    style={{ cursor: 'pointer', fill: 'yellow', marginLeft: '20px' }}
                    onClick={(e) => handleRemoveFavorite(e, selectedPokemon.id)}
                  />
                ) : (
                  <StarBorder
                    style={{ cursor: 'pointer', marginLeft: '20px' }}
                    alignSelf="flex-end"
                    onClick={(e) => handleAddFavorite(e, selectedPokemon.id)}
                  />
                )}
              </Box>
              <Typography id="modal-pokemon-description" sx={{ mt: 2 }}>
                {selectedPokemonDetail?.description}
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                sx={{ mt: 1 }}
                justifyContent="space-between"
                alignItems="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  width="40%"
                  justifyContent="space-between">
                  <Typography id="modal-pokemon-height">
                    {`Height: ${selectedPokemonDetail?.height / 10}m`}
                  </Typography>
                  <Typography id="modal-pokemon-height">
                    {`Weight: ${selectedPokemonDetail?.weight}lbs`}
                  </Typography>
                  <Typography id="modal-pokemon-gender">
                    {selectedPokemonDetail?.has_gender_differences ? 'Male | Female' : 'Genderless'}
                  </Typography>
                </Box>
                <Weather
                  location={selectedPokemonDetail?.location_area_encounters?.split('-').map((move => move[0].toUpperCase() + move.slice(1))).join(' ')}
                  lat={selectedPokemonDetail?.lat}
                  lng={selectedPokemonDetail?.lng}
                  happiness={selectedPokemonDetail?.stats?.happiness}
                />
              </Box>
            </Box>
            <Box height="50%">
              <Radar
                data={{
                  labels: ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'],
                  datasets: [
                    {
                      data: [
                        selectedPokemonDetail?.stats?.hp,
                        selectedPokemonDetail?.stats?.attack,
                        selectedPokemonDetail?.stats?.defebnse,
                        selectedPokemonDetail?.stats?.sp_attack,
                        selectedPokemonDetail?.stats?.sp_defense,
                        selectedPokemonDetail?.stats?.speed
                      ],
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
              />
            </Box>
            <Box display="flex" width="100%" justifyContent="center">
              {deleteClicked ? (
                <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                  <Button width="40%" onClick={(e) => handleDelete(e, selectedPokemon.id)}>
                    Permanently Delete
                  </Button>
                  <Button width="40%" onClick={() => setDeleteClicked(false)}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button alignSelf="center" onClick={() => setDeleteClicked(true)}>
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
