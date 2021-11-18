/* exported data */

var data = {
  view: "entry-form",
  results: [],
  editing: null,
  nextEntryId: 1,
};

const previousEntries = localStorage.getItem("entry-local-storage");
if (previousEntries !== null) {
  data = JSON.parse(previousEntries);
}

const handleUnload = (event) => {
  const entryJson = JSON.stringify(data);
  localStorage.setItem("entry-local-storage", entryJson);
};
window.addEventListener("beforeunload", handleUnload);
