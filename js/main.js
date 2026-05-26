import { getAllBreeds, getBreedImage } from "./api/dogApi.js";
import { createDogCard } from "./components/dogCard.js";
import { createDogDetailsModalContent } from "./components/dogDetailsModal.js";
import { createDogOfTheDay } from "./components/dogOfTheDay.js";
import { createSkeletonCards } from "./components/skeletonCard.js";
import { createEmptyState, createErrorState } from "./components/uiState.js";
import {
  getFavorites,
  saveFavorites,
  toggleFavorite,
} from "./utils/favoritesStorage.js";

// DOM elements
const themeToggle = document.querySelector("#themeToggle");
const dogsGrid = document.querySelector("#dogsGrid");
const favoritesGrid = document.querySelector("#favoritesGrid");
const searchInput = document.querySelector("#searchInput");
const loadMoreButton = document.querySelector("#loadMoreButton");
const dogDetailsModalBody = document.querySelector("#dogDetailsModalBody");
const dogDetailsModalElement = document.querySelector("#dogDetailsModal");
const dogOfTheDay = document.querySelector("#dogOfTheDay");
const favoritesCount = document.querySelector("#favoritesCount");
const filterButtons = document.querySelectorAll("[data-filter]");

// App constants
const THEME_KEY = "dogdex:theme";
const DOGS_PER_PAGE = 8;

// Bootstrap modal instance
const dogDetailsModal = new bootstrap.Modal(dogDetailsModalElement);

// App state
let dogs = [];
let visibleDogs = [];
let currentPage = 1;
let activeFilter = "all";

/**
 * Initializes the application.
 */
async function init() {
  try {
    loadTheme();
    showLoading();

    dogs = await getAllBreeds();

    await loadDogsPage();

    renderDogOfTheDay();
    renderFavorites();
    updateFavoritesCount();

    updateProjectAge();
  } catch (error) {
    console.error(error);

    dogsGrid.innerHTML = createErrorState(
      "Could not load dog breeds. Please try again later.",
    );

    loadMoreButton.classList.add("d-none");
  }
}

/**
 * Loads the saved theme from local storage.
 */
function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme !== "dark") return;

  document.body.classList.add("dark-mode");
  themeToggle.textContent = "Light mode";
}

/**
 * Toggles between light and dark mode.
 */
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");

  localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
  themeToggle.textContent = isDarkMode ? "Light mode" : "Dark mode";
}

/**
 * Loads the next page of dog breeds with images.
 */
async function loadDogsPage() {
  const start = (currentPage - 1) * DOGS_PER_PAGE;
  const end = currentPage * DOGS_PER_PAGE;
  const dogsToLoad = dogs.slice(start, end);

  const dogsWithImages = await Promise.all(
    dogsToLoad.map(async (dog) => {
      const image = dog.image || (await getBreedImage(dog.name));

      return {
        ...dog,
        image,
      };
    }),
  );

  visibleDogs = [...visibleDogs, ...dogsWithImages];

  updateDogsWithImages(dogsWithImages);
  applyFilters();
  updateLoadMoreButton();
}

/**
 * Updates the main dogs array with loaded images.
 *
 * @param {Array} dogsWithImages
 */
function updateDogsWithImages(dogsWithImages) {
  dogs = dogs.map((dog) => {
    const updatedDog = dogsWithImages.find((item) => item.name === dog.name);

    return updatedDog || dog;
  });
}

/**
 * Renders the featured dog section.
 */
function renderDogOfTheDay() {
  const dogsWithImage = dogs.filter((dog) => dog.image);

  if (dogsWithImage.length === 0) return;

  const randomIndex = Math.floor(Math.random() * dogsWithImage.length);
  const selectedDog = dogsWithImage[randomIndex];

  dogOfTheDay.innerHTML = createDogOfTheDay(selectedDog);
}

/**
 * Renders dog cards.
 *
 * @param {Array} dogsList
 */
function renderDogs(dogsList) {
  if (dogsList.length === 0) {
    dogsGrid.innerHTML = createEmptyState("No breed matches your search.");

    return;
  }

  dogsGrid.innerHTML = dogsList.map((dog) => createDogCard(dog)).join("");
}

/**
 * Renders favorite dog cards.
 */
function renderFavorites() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    favoritesGrid.innerHTML = createEmptyState(
      "You have not added any breeds to favorites yet.",
    );

    return;
  }

  favoritesGrid.innerHTML = favorites.map((dog) => createDogCard(dog)).join("");
}

/**
 * Updates the favorites counter in the navbar.
 */
function updateFavoritesCount() {
  favoritesCount.textContent = getFavorites().length;
}

/**
 * Applies active filter and search term.
 */
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filteredDogs =
    activeFilter === "favorites" ? getFavorites() : visibleDogs;

  if (searchTerm) {
    filteredDogs = filteredDogs.filter((dog) =>
      dog.name.toLowerCase().includes(searchTerm),
    );
  }

  renderDogs(filteredDogs);
  updateLoadMoreVisibility(searchTerm);
}

/**
 * Shows or hides the load more button.
 *
 * @param {string} searchTerm
 */
function updateLoadMoreVisibility(searchTerm = "") {
  if (activeFilter === "favorites" || searchTerm) {
    loadMoreButton.classList.add("d-none");
    return;
  }

  updateLoadMoreButton();
}

/**
 * Renders skeleton cards while data is loading.
 */
function showLoading() {
  dogsGrid.innerHTML = createSkeletonCards();
}

/**
 * Updates the load more button visibility.
 */
function updateLoadMoreButton() {
  const hasMoreDogs = visibleDogs.length < dogs.length;

  loadMoreButton.classList.toggle("d-none", !hasMoreDogs);
}

/**
 * Handles filter button clicks.
 *
 * @param {Event} event
 */
function handleFilterClick(event) {
  const button = event.target.closest("[data-filter]");

  if (!button) return;

  activeFilter = button.dataset.filter;

  updateFilterButtons(button);
  applyFilters();
}

/**
 * Updates the active filter button style.
 *
 * @param {HTMLElement} activeButton
 */
function updateFilterButtons(activeButton) {
  filterButtons.forEach((button) => {
    button.classList.remove("btn-warning");
    button.classList.add("btn-outline-dark");
  });

  activeButton.classList.remove("btn-outline-dark");
  activeButton.classList.add("btn-warning");
}

/**
 * Handles search input changes.
 */
function handleSearch() {
  applyFilters();
}

/**
 * Handles the load more button click.
 */
async function handleLoadMore() {
  currentPage += 1;

  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "Loading...";

  await loadDogsPage();

  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "Load more breeds";
}

/**
 * Handles favorite button clicks.
 *
 * @param {Event} event
 */
function handleFavoriteClick(event) {
  const button = event.target.closest("[data-favorite]");

  if (!button) return;

  const dog = findDogByName(button.dataset.favorite);

  if (!dog || !dog.image) return;

  const updatedFavorites = toggleFavorite(dog);

  saveFavorites(updatedFavorites);

  applyFilters();
  renderFavorites();
  updateFavoritesCount();
  updateOpenModal(dog);
}

/**
 * Handles dog details button clicks.
 *
 * @param {Event} event
 */
function handleDogDetailsClick(event) {
  const button = event.target.closest("[data-dog-details]");

  if (!button) return;

  const dog = findDogByName(button.dataset.dogDetails);

  if (!dog || !dog.image) return;

  dogDetailsModalBody.innerHTML = createDogDetailsModalContent(dog);
  dogDetailsModal.show();
}

/**
 * Finds a dog by name from loaded dogs or favorites.
 *
 * @param {string} dogName
 * @returns {Object | undefined}
 */
function findDogByName(dogName) {
  return (
    dogs.find((dog) => dog.name === dogName) ||
    getFavorites().find((dog) => dog.name === dogName)
  );
}

/**
 * Updates the modal content if it is currently open.
 *
 * @param {Object} dog
 */
function updateOpenModal(dog) {
  if (!dogDetailsModalBody.innerHTML.trim()) return;

  dogDetailsModalBody.innerHTML = createDogDetailsModalContent(dog);
}

// Updates footer year dinamically
// document.querySelector("#currentYear").textContent = new Date().getFullYear();

/**
 * Updates the project age in days.
 */
function updateProjectAge() {
  // Project creation date
  const projectStartDate = new Date("2026-05-22");

  const today = new Date();

  const difference = today - projectStartDate;

  const daysPassed = Math.floor(difference / (1000 * 60 * 60 * 24));

  const projectAgeElement = document.querySelector("#projectAge");

  const dayLabel = daysPassed === 1 ? "day" : "days";

  projectAgeElement.textContent = `This project has been evolving for ${daysPassed} ${dayLabel}.`;
}

// Event listeners
searchInput.addEventListener("input", handleSearch);
loadMoreButton.addEventListener("click", handleLoadMore);
themeToggle.addEventListener("click", toggleTheme);

dogsGrid.addEventListener("click", handleFavoriteClick);
dogsGrid.addEventListener("click", handleDogDetailsClick);

favoritesGrid.addEventListener("click", handleFavoriteClick);
favoritesGrid.addEventListener("click", handleDogDetailsClick);

dogOfTheDay.addEventListener("click", handleDogDetailsClick);

filterButtons.forEach((button) => {
  button.addEventListener("click", handleFilterClick);
});

init();
