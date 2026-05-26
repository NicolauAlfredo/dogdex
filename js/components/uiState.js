/**
 * Creates an empty state component.
 *
 * @param {string} message
 * @returns {string}
 */
export function createEmptyState(message) {
  return `
    <div class="col-12">
      <div class="empty-state text-center">

        <!-- Empty state title -->
        <h3>
          Nothing found
        </h3>

        <!-- Empty state message -->
        <p>
          ${message}
        </p>
      </div>
    </div>
  `;
}

/**
 * Creates an error state component.
 *
 * @param {string} message
 * @returns {string}
 */
export function createErrorState(message) {
  return `
    <div class="col-12">
      <div class="error-state text-center">

        <!-- Error state title -->
        <h3>
          Oops, something went wrong
        </h3>

        <!-- Error state message -->
        <p>
          ${message}
        </p>
      </div>
    </div>
  `;
}
