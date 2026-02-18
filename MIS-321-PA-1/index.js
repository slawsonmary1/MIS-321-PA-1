let app = document.getElementById("app")
let movies = getMovies()

function handleOnLoad(){
  render()
}

function getMovies(){
  return JSON.parse(localStorage.getItem("myMovies")) || []
}

function saveMovies(){
  localStorage.setItem("myMovies", JSON.stringify(movies))
}

function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function render(){
  createTable(sortMovies(movies))
  createForm()
}

function createTable(movies){
  let html = `
    <table class="table table-striped">
      <tr>
        <th>Movie</th>
        <th>Rating</th>
        <th>Release Date</th>
        <th>Favorite</th>
        <th>Delete</th>
      </tr>
  `

  movies.forEach((movie, index) => {
    html += `
      <tr>
        <td>${movie.movie}</td>
        <td>${movie.rating}</td>
        <td>${movie.date}</td>
        <td>
          <button class="btn btn-danger-subtle" onclick="favoriteMovie('${movie.id}')">
            ${movie.favorite ? "♥" : "♡"}
          </button>
        </td>
        <td>
          <button class="btn btn-danger" onclick="deleteMovie('${movie.id}')">
            Delete
          </button>
        </td>
      </tr>
    `
  })

  html += `</table>`

  app.innerHTML = html
}

function createForm(){
  let html = `
    <div class="mt-3">
      <div class="row g-2">
        <div class="col">
          <input id="newMovie" class="form-control" placeholder="Movie">
        </div>
        <div class="col-2">
          <input id="newRating" type="number" class="form-control" placeholder="1-10" min="1" max="10">
        </div>
        <div class="col">
          <input id="newDate" type="date" class="form-control" placeholder="Release Date">
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" onclick="addMovie()">Add</button>
        </div>
      </div>
    </div>
  `

  app.innerHTML += html
}

function addMovie(){
  let movieInput = document.getElementById("newMovie")
  let ratingInput = document.getElementById("newRating")
  let dateInput = document.getElementById("newDate")

  if(!movieInput.value || !ratingInput.value || !dateInput.value){
    alert("Please fill out all fields")
    return
  }

  let movie = {
    id: generateId(),
    movie: movieInput.value,
    rating: ratingInput.value,
    date: dateInput.value,
    favorite: false
  }

  movies.push(movie)
  saveMovies()
  render()
}

function favoriteMovie(id){
  movies = movies.map(movie =>
    movie.id === id ? {...movie, favorite: !movie.favorite} : movie
  )

  saveMovies()
  render()
}

function deleteMovie(id){
  movies = movies.filter(movie => movie.id !== id)
  saveMovies()
  render()
}

function sortMovies(movies) {
  const key = "rating"

  return [...movies].sort((a,b) => {
    const va = Number(a[key])
    const vb = Number(b[key])

    return vb - va
  })
}
