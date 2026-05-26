/**
 * Creates the "Dog of the Day" featured section.
 *
 * @param {Object} dog
 * @returns {string}
 */
export function createDogOfTheDay(dog) {
  return `
    <article class="row align-items-center g-4 dog-of-day-card">

      <!-- Dog image -->
      <div class="col-lg-5">
        <img
          src="${dog.image}"
          alt="${dog.name}"
          class="dog-of-day-image"
        />
      </div>

      <!-- Dog content -->
      <div class="col-lg-7">

        <!-- Section badge -->
        <span class="badge text-bg-warning mb-3">
          Dog of the Day
        </span>

        <!-- Dog name -->
        <h3 class="fw-bold display-6">
          ${capitalize(dog.name)}
        </h3>

        <!-- Description -->
        <p class="text-secondary">
          A featured breed randomly selected from the DogDex collection.
        </p>

        <!-- Details button -->
        <button
          class="btn btn-dark fw-semibold"
          data-dog-details="${dog.name}"
        >
          View details
        </button>
      </div>
    </article>
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
