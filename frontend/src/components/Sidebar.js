import React, { useState } from 'react';
import { Divider, Button, Drawer, Accordion, AccordionSummary, AccordionDetails, ExpandMoreIcon, List, ListItem, ListItemIcon, ListItemText, Pagination, TextField } from '@mui/material';
import PokemonList from './PokemonList';
import PokemonListFavorites from './PokemonListFavorites';

export default function Sidebar(props) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
    > 
      <Button onClick={() => props.setPokemonAddModalIsOpen(true)}>Add Pokemon</Button>
      <PokemonList pokemon={props.pokemon} handleClick={props.handleClick}/>
      <PokemonListFavorites pokemon={props.favoritePokemon} handleClick={props.handleClick} />
    </Drawer>
  )
}