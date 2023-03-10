import React, { useState, Fragment } from 'react';
import {
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  TextField
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { PokeballIcon } from '../icons/icons';

export default function PokemonList(props) {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = useState(1);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const itemsPerPage = 10;
  const numPages = Math.ceil(props.pokemon.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredItems =
    props.pokemon &&
    props.pokemon.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const paginatedPokemon = filteredItems && filteredItems.slice(startIndex, endIndex);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`pokemon-sidebar-content`}>
        <PokeballIcon color="blue" />
        <ListItemText primary="Discovered Pokemon" style={{ marginLeft: '10px' }} />
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Divider variant="middle" color="primary" sx={{ my: 1 }} />
        {paginatedPokemon &&
          paginatedPokemon.map((item) => (
            <Fragment key={item.id}>
              <ListItem sx={{ cursor: 'pointer' }} onClick={(e) => props.handleClick(e, item)}>
                <ListItemIcon>
                  <img
                    src={item.images.sprite}
                    alt={item.name}
                    style={{ marginRight: '5px', width: '30px', height: '30px' }}
                  />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </Fragment>
          ))}
        <Divider variant="middle" color="primary" sx={{ my: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <Pagination count={numPages} page={page} onChange={handlePageChange} color="primary" />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
