/**
 * Creates skeleton loading cards.
 *
 * @param {number} quantity
 * @returns {string}
 */
export function createSkeletonCards(quantity = 8) {
  return Array.from({ length: quantity })
    .map(() => createSkeletonCard())
    .join("");
}

/**
 * Creates a single skeleton card.
 *
 * @returns {string}
 */
function createSkeletonCard() {
  return `
    <div class="col-sm-6 col-md-4 col-xl-3">
      <div class="skeleton-card">

        <!-- Skeleton image -->
        <div class="skeleton skeleton-image"></div>

        <!-- Skeleton content -->
        <div class="skeleton-card-body">

          <!-- Skeleton badge -->
          <div class="skeleton skeleton-badge"></div>

          <!-- Skeleton title -->
          <div class="skeleton skeleton-title"></div>

          <!-- Skeleton text -->
          <div class="skeleton skeleton-text"></div>

          <!-- Skeleton button -->
          <div class="skeleton skeleton-button"></div>
        </div>
      </div>
    </div>
  `;
}
