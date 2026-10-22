const movies = [
    { id: 1, title: "Neon Horizon", genre: "Sci-Fi", year: 2026, rating: "8.7", duration: "2h 08m", art: "#173c42", glow: "#48f2ba", label: "NEON" },
    { id: 2, title: "Last Kingdom", genre: "Action", year: 2025, rating: "8.4", duration: "1h 56m", art: "#392b3d", glow: "#e9a45f", label: "KINGDOM" },
    { id: 3, title: "Silent Echo", genre: "Mystery", year: 2026, rating: "8.1", duration: "1h 48m", art: "#23344b", glow: "#6b9fff", label: "ECHO" },
    { id: 4, title: "Paper Hearts", genre: "Drama", year: 2025, rating: "7.9", duration: "2h 01m", art: "#583b45", glow: "#ffb8a7", label: "HEARTS" },
    { id: 5, title: "Orbit Zero", genre: "Sci-Fi", year: 2026, rating: "8.9", duration: "2h 14m", art: "#27385b", glow: "#8a9dff", label: "ORBIT" },
    { id: 6, title: "Weekend Plan", genre: "Comedy", year: 2024, rating: "7.6", duration: "1h 42m", art: "#3d4734", glow: "#d8ed78", label: "WEEKEND" },
    { id: 7, title: "Shadow District", genre: "Action", year: 2025, rating: "8.2", duration: "2h 04m", art: "#2e2d42", glow: "#a28cff", label: "SHADOW" },
    { id: 8, title: "The Deep", genre: "Mystery", year: 2024, rating: "8.0", duration: "1h 51m", art: "#1c444b", glow: "#58d7e2", label: "THE DEEP" },
    { id: 9, title: "Golden Hour", genre: "Drama", year: 2026, rating: "7.8", duration: "1h 58m", art: "#5b402b", glow: "#ffc46b", label: "GOLDEN" },
    { id: 10, title: "Pixel Pals", genre: "Comedy", year: 2025, rating: "7.7", duration: "1h 35m", art: "#24463b", glow: "#66f2b3", label: "PIXEL" },
    { id: 11, title: "Red Signal", genre: "Action", year: 2026, rating: "8.3", duration: "2h 10m", art: "#512b32", glow: "#ff656d", label: "SIGNAL" },
    { id: 12, title: "Moon Archive", genre: "Sci-Fi", year: 2025, rating: "8.5", duration: "1h 59m", art: "#302c58", glow: "#9d91ff", label: "MOON" }
];
let activeFilter = "All";
let watchlist = new Set();
let continueWatching = [movies[2].id, movies[4].id];
let currentMovie = movies[0];
const $ = (s) => document.querySelector(s);
const grid = $("#movieGrid");
const toast = $("#toast");

function showToast(message) {
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function movieCard(m) {
    const saved = watchlist.has(m.id);
    return `<article class="movie-card" data-id="${m.id}" tabindex="0" aria-label="Open ${m.title}">
  <div class="poster" style="--art:${m.art};--glow:${m.glow}">
   <span class="poster-rating">★ ${m.rating}</span>
   <button class="save-btn" data-save="${m.id}" aria-label="${saved ? 'Remove from' : 'Add to'} watch list">${saved ? '✓' : '+'}</button>
   <span class="poster-figure"></span>
   <div class="poster-title"><small>${m.genre.toUpperCase()} · ${m.year}</small>${m.label}</div>
  </div>
  <div class="movie-info"><h3>${m.title}</h3><p>${m.genre}<span>•</span>${m.duration}</p></div>
 </article>`;
}
function renderMovies() {
    const q = $("#searchInput").value.trim().toLowerCase();
    const filtered = movies.filter(m => (activeFilter === "All" || m.genre === activeFilter) && (`${m.title} ${m.genre} ${m.year}`.toLowerCase().includes(q)));
    grid.innerHTML = filtered.length ? filtered.map(movieCard).join("") : `<p class="muted">No titles found. Try another search.</p>`;
}
function renderWide() {
    const popular = [movies[4], movies[6], movies[0], movies[10], movies[2], movies[8]];
    $("#popularRow").innerHTML = popular.map((m, i) => `<article class="wide-card" data-id="${m.id}"><div class="wide-art" style="--art:${m.art};--glow:${m.glow}"></div><div class="wide-meta"><h3>${m.title}</h3><p>★ ${m.rating} &nbsp; · &nbsp; ${m.genre}</p></div></article>`).join("");
    const recent = continueWatching.map(id => movies.find(m => m.id === id)).filter(Boolean);
    $("#continueRow").innerHTML = recent.length ? recent.map((m, i) => `<article class="wide-card" data-id="${m.id}"><div class="wide-art" style="--art:${m.art};--glow:${m.glow}"></div><div class="progress"><span style="width:${i === 0 ? 62 : 34}%"></span></div><div class="wide-meta"><h3>${m.title}</h3><p>Continue · ${i === 0 ? "42 min left" : "1h 06m left"}</p></div></article>`).join("") : `<p class="muted">No titles here yet.</p>`;
}
function renderWatchCount() { $("#watchCount").textContent = watchlist.size; }
function toggleSave(id) {
    const m = movies.find(x => x.id === Number(id)); if (!m) return;
    if (watchlist.has(m.id)) { watchlist.delete(m.id); showToast(`${m.title} removed from Watch List`) }
    else { watchlist.add(m.id); showToast(`${m.title} added to Watch List`) }
    renderMovies(); renderWatchCount();
}
function openModal(id) {
    currentMovie = movies.find(m => m.id === Number(id)); if (!currentMovie) return;
    $("#modalTitle").textContent = currentMovie.title;
    $("#modalDescription").textContent = `${currentMovie.year} · ${currentMovie.genre} · ★ ${currentMovie.rating} · ${currentMovie.duration}. ${currentMovie.title} is part of this sample catalog.`;
    $("#modalArt").style.setProperty("--art", currentMovie.art);
    $("#modalArt").style.setProperty("--glow", currentMovie.glow);
    $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden", "false");
}
function closeModal() { $("#modal").classList.remove("open"); $("#modal").setAttribute("aria-hidden", "true"); }
$("#filters").addEventListener("click", e => { const b = e.target.closest("[data-filter]"); if (!b) return; activeFilter = b.dataset.filter; document.querySelectorAll(".filter").forEach(x => x.classList.toggle("active", x === b)); renderMovies(); });
grid.addEventListener("click", e => { const save = e.target.closest("[data-save]"); if (save) { e.stopPropagation(); toggleSave(save.dataset.save); return; } const card = e.target.closest("[data-id]"); if (card) openModal(card.dataset.id); });
grid.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".movie-card")) openModal(e.target.dataset.id); });
document.querySelectorAll(".wide-row").forEach(row => row.addEventListener("click", e => { const card = e.target.closest("[data-id]"); if (card) openModal(card.dataset.id); }));
$("#searchInput").addEventListener("input", renderMovies);
$("#themeBtn").addEventListener("click", () => { document.body.classList.toggle("light-theme"); showToast(document.body.classList.contains("light-theme") ? "Light theme enabled" : "Dark theme enabled"); });
$("#menuBtn").addEventListener("click", () => $(".nav-links").classList.toggle("open"));
$("#watchHero").addEventListener("click", () => openModal(1));
$("#addHero").addEventListener("click", () => toggleSave(1));
$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
$("#modalAdd").addEventListener("click", () => toggleSave(currentMovie.id));
$("#newsletterForm").addEventListener("submit", e => { e.preventDefault(); showToast("Thanks! You're on the demo update list."); e.target.reset(); });
renderMovies(); renderWide(); renderWatchCount();
