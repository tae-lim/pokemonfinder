import React from 'react';
import { ListItem, Box, ListItemText  } from '@mui/material';
import PokemonList from './PokemonList';
import PokemonListFavorites from './PokemonListFavorites';
import { PokeballIcon } from '../icons/icons';

export default function Sidebar({ pokemon, favoritePokemon, handleClick, setPokemonAddModalIsOpen }) {
  return (
    <Box display="flex" flexDirection="column" width="20%" flex="1" overflow="scroll"> 
      <ListItem>
        <PokeballIcon color={'red'}/>
        <ListItemText style={{cursor: 'pointer', marginLeft: '10px  '}} className="MuiAccordion-root" onClick={() => setPokemonAddModalIsOpen(true)} primary="Add Pokemon" />
      </ListItem>
      <PokemonList pokemon={pokemon} handleClick={handleClick}/>
      <PokemonListFavorites pokemon={favoritePokemon} handleClick={handleClick} />
    </Box>
  )
}