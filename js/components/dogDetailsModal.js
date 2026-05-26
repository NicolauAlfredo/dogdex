import { isFavorite } from "../utils/favoritesStorage.js";

/**
 * Creates the modal content for a dog.
 *
 * @param {Object} dog
 * @returns {string}
 */
export function createDogDetailsModalContent(dog) {
  const favorite = isFavorite(dog.name);

  const subBreedsContent =
    dog.subBreeds.length > 0
      ? dog.subBreeds
          .map(
            (subBreed) => `
              <span class="dog-tag">
                ${subBreed}
              </span>
            `,
          )
          .join("")
      : `
          <span class="text-secondary">
            No sub-breeds available.
          </span>
        `;

  return `
    <div class="row g-4 align-items-center">

      <!-- Dog image -->
      <div class="col-md-6">
        <img
          src="${dog.image}"
          alt="${dog.name}"
          class="img-fluid dog-modal-image"
        />
      </div>

      <!-- Dog information -->
      <div class="col-md-6">

        <!-- Dog ID -->
        <span class="dog-badge mb-3 d-inline-block">
          #${dog.id}
        </span>

        <!-- Dog name -->
        <h3 class="fw-bold mb-3">
          ${capitalize(dog.name)}
        </h3>

        <!-- Description -->
        <p class="text-secondary">
          This breed is part of DogDex and was dynamically loaded using the Dog CEO API.
        </p>

        <!-- Sub-breeds section -->
        <h4 class="fs-6 fw-bold mt-4">
          Sub-breeds
        </h4>

        <div class="d-flex flex-wrap gap-2 mt-2">
          ${subBreedsContent}
        </div>

        <!-- Favorite button -->
        <button
          class="btn ${
            favorite ? "btn-danger" : "btn-outline-danger"
          } w-100 mt-4"
          data-favorite="${dog.name}"
        >
          ${favorite ? "Remove from favorites" : "Add to favorites"}
        </button>
      </div>
    </div>
  `;
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} text
 * @returns {string}
 */
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
