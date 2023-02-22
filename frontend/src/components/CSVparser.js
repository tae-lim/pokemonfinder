import React, { useState } from 'react';
import Papa from 'papaparse';
import { AToJPolylines, KtoZPolylines } from '../utils/polylines';

export default function CSVParser() {
  const [pokemon, setPokemon] = useState([]);

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setPokemon(formatData(results.data));
      },
    });
  }

  const formatData = pokemon => {
    return pokemon.map(item => {
      if (!item.lat && !item.long) {
        const [Long, Lat] = selectPolylineSource(item);
        return { ...item, Lat, Long };
      }
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

    const polyline = selectedPolylines[polylinesIdx];
    const polylineIdx = Math.floor(Math.random() * polyline.length);

    return polyline[polylineIdx];
  }

  const handleSubmit = async (e) => {
		e.preventDefault();
		try {
      if (!pokemon.length) return;
			const res = await fetch('http://127.0.0.1:8000/api/pokefinder/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(pokemon)
			});
			if (res.status === 200) {
				const data = await res.json();
			} else {
				throw Error('Unable to save pokemon');
			}
		} catch(e) {
			console.error(e);
		}
	}

  
  return (
    <div>
      <input 
        type="file"
        name="file"
        accept=".csv"
        onChange={handleCSVUpload}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}