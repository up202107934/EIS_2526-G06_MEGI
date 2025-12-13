(function () {
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");
  const cards = Array.from(document.querySelectorAll(".collection-card"));

  if (!searchInput || !cards.length) return;

  const filterCollections = () => {
    const query = (searchInput.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const haystack = (card.dataset.searchable || "").toLowerCase();
      const matches = !query || haystack.includes(query);
      card.style.display = matches ? "flex" : "none";
    });
  };

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    filterCollections();
  });

  searchInput.addEventListener("input", filterCollections);
})();