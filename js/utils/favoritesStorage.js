// Local storage key used to persist favorite dogs
const FAVORITES_KEY = "dogdex:favorites";

/**
 * Retrieves all favorite dogs from local storage.
 *
 * @returns {Array}
 */
export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

/**
 * Saves favorite dogs to local storage.
 *
 * @param {Array} favorites
 */
export function saveFavorites(favorites) {
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites),
  );
}

/**
 * Checks whether a dog is in favorites.
 *
 * @param {string} dogName
 * @returns {boolean}
 */
export function isFavorite(dogName) {
  return getFavorites().some(
    (dog) => dog.name === dogName,
  );
}

/**
 * Adds or removes a dog from favorites.
 *
 * @param {Object} dog
 * @returns {Array}
 */
export function toggleFavorite(dog) {
  const favorites = getFavorites();

  const alreadyExists = favorites.some(
    (favoriteDog) => favoriteDog.name === dog.name,
  );

  if (alreadyExists) {
    return favorites.filter(
      (favoriteDog) => favoriteDog.name !== dog.name,
    );
  }

  return [...favorites, dog];
}