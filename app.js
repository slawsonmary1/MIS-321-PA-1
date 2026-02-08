const STORAGE_KEY = "tideMovies";

// load movies array 
function loadMovies() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// save movies array 
function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// make a unique id
function makeId() {
  return "m_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// formatting the date
function formatDate(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  if (!y || !m || !d) return yyyyMmDd;
  return `${m}/${d}/${y}`;
}

// returning movies sorted
function activeMoviesSorted(movies) {
  return movies
    .filter(m => !m.deleted)
    .sort((a, b) => b.rating - a.rating);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[s]));
}

// render movies into table
function renderMoviesUI(movies, elements) {
  const { tbody, statsBadge } = elements;
  const active = activeMoviesSorted(movies);

  statsBadge.textContent = `${active.length} movie${active.length === 1 ? "" : "s"}`;
  tbody.innerHTML = "";

  if (active.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="color: rgba(255,255,255,.75); padding: 18px;">
      No movies yet. Add one above.
    </td>`;
    tbody.appendChild(tr);
    return;
  }

  for (const m of active) {
    const favIcon = m.favorited ? "★" : "☆";
    const favText = m.favorited ? "Yes" : "No";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(m.movieName)}</td>
      <td><span class="pill">${m.rating.toFixed(1)}</span></td>
      <td>${formatDate(m.dateReleased)}</td>
      <td>
        <span class="pill ${m.favorited ? "pill-ok" : "pill-no"}">
          <span class="fav">${favIcon}</span> ${favText}
        </span>
      </td>
      <td>
        <div class="actions">
          <button class="btn small" data-action="toggleFav" data-id="${m.movieId}">
            ${m.favorited ? "Unfavorite" : "Favorite"}
          </button>
          <button class="btn btn-danger small" data-action="delete" data-id="${m.movieId}">
            Delete
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}