(function () {
  const searchInput =
    document.getElementById("collectionsSearchInput") ||
    document.getElementById("searchInput");
  const searchForm =
    document.getElementById("collectionsSearchForm") ||
    document.getElementById("searchForm");
  const cards = Array.from(document.querySelectorAll(".collection-card"));
  const emptyState = document.getElementById("collectionsEmptyState");


  if (!searchInput || !cards.length) return;

  const filterCollections = () => {
    const query = (searchInput.value || "").trim().toLowerCase();
    
    let matchesCount = 0;

    cards.forEach((card) => {
      const haystack = (card.dataset.searchable || "").toLowerCase();
      const matches = !query || haystack.includes(query);
      card.style.display = matches ? "flex" : "none";
      if (matches) matchesCount += 1;
    });
    if (emptyState) {
      emptyState.style.display = matchesCount === 0 ? "block" : "none";
    }
  };

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    filterCollections();
  });

  searchInput.addEventListener("input", filterCollections);
})();