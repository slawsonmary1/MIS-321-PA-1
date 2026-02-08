let movies = [];
let elements = null;

//initializing 
function initApp() {
  movies = loadMovies();
  elements = getElements();

  bindEvents();
  render();
}

function getElements() {
  return {
    form: document.getElementById("movieForm"),
    nameInput: document.getElementById("movieName"),
    ratingInput: document.getElementById("rating"),
    dateInput: document.getElementById("dateReleased"),
    clearAllBtn: document.getElementById("clearAllBtn"),
    tbody: document.getElementById("moviesTbody"),
    statsBadge: document.getElementById("statsBadge"),
  };
}

function bindEvents() {
  elements.form.addEventListener("submit", handleAddMovie);
  elements.tbody.addEventListener("click", handleTableClick);
  elements.clearAllBtn.addEventListener("click", handleClearAll);
}

//handling adding movies
function handleAddMovie(e) {
  e.preventDefault();

  const movieName = elements.nameInput.value.trim();
  const rating = Number(elements.ratingInput.value);
  const dateReleased = elements.dateInput.value;

  const error = validateMovieInput(movieName, rating, dateReleased);
  if (error) {
    alert(error);
    return;
  }

  addMovie(movieName, rating, dateReleased);
  resetForm();
  render();
}

//handling favoriting/unfavoriting and deleting
function handleTableClick(e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const { action, id } = btn.dataset;

  if (action === "toggleFav") {
    toggleFavorite(id);
  } else if (action === "delete") {
    deleteMovie(id); // soft delete
  }

  saveMovies(movies);
  render();
}

//clear all movies
function handleClearAll() {
  const ok = confirm("Clear all movies from local storage?");
  if (!ok) return;

  movies = [];
  saveMovies(movies);
  render();
}

//adding movies
function addMovie(movieName, rating, dateReleased) {
  const newMovie = {
    movieId: makeId(),
    movieName,
    rating,
    dateReleased,
    favorited: false,
    deleted: false,
  };

  movies.push(newMovie);
  saveMovies(movies);
}

//favoriting and unfavoriting
function toggleFavorite(movieId) {
  const idx = findMovieIndexById(movieId);
  if (idx === -1) return;

  movies[idx].favorited = !movies[idx].favorited;
}

//deleting movies
function deleteMovie(movieId) {
  const idx = findMovieIndexById(movieId);
  if (idx === -1) return;

  movies[idx].deleted = true;
}

//searching movies
function findMovieIndexById(movieId) {
  return movies.findIndex(m => m.movieId === movieId);
}

//making sure user input matches the format
function validateMovieInput(movieName, rating, dateReleased) {
  if (!movieName) return "Please enter a movie name.";
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
    return "Rating must be a number from 0 to 10.";
  }
  if (!dateReleased) return "Please choose a release date.";
  return null;
}

function resetForm() {
  elements.form.reset();
}

function render() {
  renderMoviesUI(movies, elements);
}

document.addEventListener("DOMContentLoaded", initApp);