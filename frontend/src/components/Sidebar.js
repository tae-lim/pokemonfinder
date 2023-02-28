import React from 'react';
import { ListItem, Box, ListItemText } from '@mui/material';
import PokemonList from './PokemonList';
import PokemonListFavorites from './PokemonListFavorites';
import AddIcon from '@mui/icons-material/Add';
import { PokeballIcon } from '../icons/icons';

export default function Sidebar({
  pokemon,
  favoritePokemon,
  handleClick,
  setPokemonAddModalIsOpen
}) {
  return (
    <Box display="flex" flexDirection="column" width="20%" flex="1" overflow="scroll">
      <ListItem
        style={{ cursor: 'pointer' }}
        className="MuiAccordion-root"
        onClick={() => setPokemonAddModalIsOpen(true)}
      >
        <PokeballIcon color={'red'} />
        <ListItemText style={{ marginLeft: '10px' }} primary="Add Pokemon" />
        <AddIcon />
      </ListItem>
      <PokemonList pokemon={pokemon} handleClick={handleClick} />
      <PokemonListFavorites pokemon={favoritePokemon} handleClick={handleClick} />
    </Box>
  );
}
