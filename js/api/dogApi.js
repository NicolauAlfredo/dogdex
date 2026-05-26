// Base URL for the Dog CEO API
const BASE_URL = "https://dog.ceo/api";

/**
 * Fetches all dog breeds from the API
 * and formats the response data.
 *
 * @returns {Promise<Array>}
 */
export async function getAllBreeds() {
  const response = await fetch(`${BASE_URL}/breeds/list/all`);

  if (!response.ok) {
    throw new Error("Failed to fetch dog breeds.");
  }

  const { message } = await response.json();

  return Object.keys(message).map((breed, index) => ({
    id: String(index + 1).padStart(3, "0"),
    name: breed,
    image: null,
    subBreeds: message[breed],
  }));
}

/**
 * Fetches a random image for a specific breed.
 *
 * @param {string} breed
 * @returns {Promise<string>}
 */
export async function getBreedImage(breed) {
  const response = await fetch(
    `${BASE_URL}/breed/${breed}/images/random`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch image for breed: ${breed}`);
  }

  const { message } = await response.json();

  return message;
}