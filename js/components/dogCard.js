import { isFavorite } from "../utils/favoritesStorage.js";

/**
 * Generates a reusable dog breed card component.
 *
 * @param {Object} dog
 * @returns {string}
 */
export function createDogCard(dog) {
  // Checks whether the current breed is already in favorites
  const favorite = isFavorite(dog.name);

  // Selects the correct heart icon based on favorite state
  const heartIcon = favorite
    ? "./assets/icons/heart-solid.svg"
    : "./assets/icons/heart-icon.svg";

  // Applies active styles when the breed is favorited
  const favoriteClass = favorite ? "favorite-btn active" : "favorite-btn";

  return `
    <div class="col-sm-6 col-md-4 col-xl-3">
      <article class="dog-card h-100">
        <div class="dog-card-image-wrapper">
          <img
            src="${dog.image}"
            alt="${dog.name}"
            class="dog-card-image"
          />
        </div>

        <div class="dog-card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="dog-badge">
              #${dog.id}
            </span>

            <button
              class="${favoriteClass}"
              data-favorite="${dog.name}"
              aria-label="Favorite ${dog.name}"
            >
              <img
                src="${heartIcon}"
                alt=""
                class="favorite-icon"
              />
            </button>
          </div>

          <h3 class="dog-card-title">
            ${capitalize(dog.name)}
          </h3>

          <p class="dog-card-text">
            ${
              dog.subBreeds.length > 0
                ? `${dog.subBreeds.length} sub-breed(s)`
                : "No sub-breeds"
            }
          </p>

          <button
            class="btn btn-warning w-100 fw-semibold"
            data-dog-details="${dog.name}"
          >
            View details
          </button>
        </div>
      </article>
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
