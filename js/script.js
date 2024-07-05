// script.js
const baseURL = 'https://pokeapi.co/api/v2/pokemon';
const limit = 10;
let offset = 0;

async function getPokemons(limit, offset) {
  try {
    const response = await fetch(`${baseURL}?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return [];
  }
}

async function getPokemonDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
    return null;
  }
}

async function displayPokemons(pokemons) {
    const app = document.getElementById('app');
    app.innerHTML = '';
  
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    for (const pokemon of pokemons) {
      const details = await getPokemonDetails(pokemon.url);
      if (details) {
        const listItem = document.createElement('li');
  
        const img = document.createElement('img');
        img.src = details.sprites.front_default;
        img.alt = pokemon.name;
  
        const name = document.createElement('p');
        name.textContent = pokemon.name;
        name.style.fontWeight = 'bold'; // Aplicar negrita
  
        listItem.appendChild(img);
        listItem.appendChild(name);
  
        // Verificar si el Pokémon está marcado como favorito
        if (favorites.includes(details.name)) {
          const favoriteIcon = document.createElement('span');
          favoriteIcon.classList.add('favorite-star');
          favoriteIcon.innerHTML = '&#9733;&#xFE0E;'; // Estrella llena
          listItem.appendChild(favoriteIcon);
        }
  
        listItem.addEventListener('click', async () => {
          const isFavorited = favorites.includes(details.name);
  
          if (isFavorited) {
            // Quitar de favoritos
            const index = favorites.indexOf(details.name);
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            listItem.querySelector('.favorite-star').remove(); // Quitar la estrella
          } else {
            // Añadir a favoritos
            favorites.push(details.name);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            const favoriteIcon = document.createElement('span');
            favoriteIcon.classList.add('favorite-star');
            favoriteIcon.innerHTML = '&#9733;&#xFE0E;'; // Estrella llena
            listItem.appendChild(favoriteIcon);
          }
        });
  
        app.appendChild(listItem);
      }
    }
  }

async function toggleFavorite(pokemonName, listItem) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.indexOf(pokemonName);

  if (index === -1) {
    // No está en favoritos, añadirlo
    favorites.push(pokemonName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    listItem.querySelector('.favorite-star').classList.add('favorited');
    listItem.querySelector('.favorite-star').innerHTML = '&#9733;&#xFE0E;';
  } else {
    // Está en favoritos, quitarlo
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    listItem.querySelector('.favorite-star').classList.remove('favorited');
    listItem.querySelector('.favorite-star').innerHTML = '&#9733;';
  }
}

document.getElementById('nextBtn').addEventListener('click', async () => {
  offset += limit;
  const pokemons = await getPokemons(limit, offset);
  displayPokemons(pokemons);
});

document.getElementById('prevBtn').addEventListener('click', async () => {
  if (offset >= limit) {
    offset -= limit;
    const pokemons = await getPokemons(limit, offset);
    displayPokemons(pokemons);
  }
});

document.getElementById('resetBtn').addEventListener('click', async () => {
  offset = 0;
  const pokemons = await getPokemons(limit, offset);
  displayPokemons(pokemons);
});

document.getElementById('searchBtn').addEventListener('click', async () => {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm.trim() !== '') {
    await searchPokemon(searchTerm);
  } else {
    alert('Please enter a Pokémon name!');
  }
});

async function searchPokemon(searchTerm) {
  try {
    const response = await fetch(`${baseURL}/${searchTerm}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayPokemons([{ name: data.name, url: `${baseURL}/${data.id}` }]);
  } catch (error) {
    console.error('Error searching Pokémon:', error);
  }
}

// Cargar los primeros Pokémon al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const pokemons = await getPokemons(limit, offset);
  displayPokemons(pokemons);
});

document.getElementById('favoritesBtn').addEventListener('click', () => {
    window.location.href = './favoritos.html'; // Redirigir a la página de favoritos
  });