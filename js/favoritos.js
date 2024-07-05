const baseURL = 'https://pokeapi.co/api/v2/pokemon';
const favoritesApp = document.getElementById('app');

async function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favoritesApp.innerHTML = ''; 

  for (const pokemonName of favorites) {
    const pokemonURL = `${baseURL}/${pokemonName}`;
    const details = await getPokemonDetails(pokemonURL);

    if (details) {
      const listItem = document.createElement('li');

      const img = document.createElement('img');
      img.src = details.sprites.front_default;
      img.alt = details.name;

      const name = document.createElement('p');
      name.textContent = capitalizeFirstLetter(details.name); 

      const favoriteIcon = document.createElement('span');
      favoriteIcon.classList.add('favorite-star');
      favoriteIcon.innerHTML = '&#9733;&#xFE0E;'; 

      listItem.appendChild(img);
      listItem.appendChild(name);
      listItem.appendChild(favoriteIcon);

      // Manejar clic para quitar de favoritos
      listItem.addEventListener('click', async () => {
        const index = favorites.indexOf(details.name);
        if (index !== -1) {
          favorites.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          listItem.remove(); // Quitar el listItem de la lista de favoritos
        }
      });

      favoritesApp.appendChild(listItem);
    }
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

// Función auxiliar para capitalizar la primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Cargar los Pokémon favoritos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await displayFavorites();
});

// Botón para volver a la página principal (index.html)
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});
