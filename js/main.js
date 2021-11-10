const $searchForm = document.querySelector("#searchForm");
const $foundCont = document.querySelector(".foundCont");

/*                       HANDLE SEARCH                                      */
const handleSearch = (event) => {
  event.preventDefault();
  const inputValue = $searchForm.searchInput.value;
  searchAPI(inputValue);
  $searchForm.reset();
};

/*                       SEARCH REQUEST ON API                                      */
const xhr = new XMLHttpRequest();
const searchAPI = (search) => {
  xhr.open(
    "GET",
    `https://imdb-api.com/en/API/SearchTitle/k_mfnhal5g/${search}`
  );
  xhr.responseType = "json";
  xhr.addEventListener("load", () => {
    const response = xhr.response;
    console.log(xhr.status);
    console.log(response);
    for (let i = 0; i < response.results.length; i++) {
      const mainDiv = document.createElement("div");
      const imgDiv = document.createElement("div");
      const img = document.createElement("img");
      const infoDiv = document.createElement("div");
      const title = document.createElement("h2");
      const paragraph = document.createElement("p");
      const saveBtn = document.createElement("button");
      const commentForm = document.createElement("form");
      const textarea = document.createElement("textarea");
      const extraDiv = document.createElement("div");
      const extraOne = document.createElement("div");
      const deletePara = document.createElement("p");
      const deleteAnchor = document.createElement("a");
      const saveColDiv = document.createElement("div");
      const savePara = document.createElement("p");
      const saveAnchor = document.createElement("a");

      mainDiv.className = "lowrow fullCol thirdCol fifthCol resultsCont";
      imgDiv.className = "halfCol resultsCol";
      infoDiv.className = "halfCol infoSect resultsCol";
      img.setAttribute("src", response.results[i].image);
      saveBtn.setAttribute("class", "saveBtn");
      commentForm.className = "commentForm hidden";
      textarea.setAttribute("name", "comments");
      textarea.setAttribute("class", "comments");
      textarea.setAttribute("placeholder", "Add comments");
      extraDiv.setAttribute("class", "row");
      extraOne.setAttribute("class", "halfCol");
      deleteAnchor.setAttribute("class", "deleteComment");
      saveColDiv.setAttribute("class", "halfCol");
      saveAnchor.setAttribute("class", "addComment");

      title.textContent = response.results[i].title;
      paragraph.textContent = response.results[i].description;
      saveBtn.textContent = "Save";
      deleteAnchor.textContent = "Delete Comment";
      saveAnchor.textContent = "Add Comment";

      mainDiv.appendChild(imgDiv);
      imgDiv.appendChild(img);
      mainDiv.appendChild(infoDiv);
      infoDiv.appendChild(title);
      infoDiv.appendChild(paragraph);
      infoDiv.appendChild(saveBtn);
      infoDiv.appendChild(commentForm);
      commentForm.appendChild(textarea);
      deletePara.appendChild(deleteAnchor);
      extraOne.appendChild(deletePara);
      extraDiv.appendChild(extraOne);
      commentForm.appendChild(extraDiv);
      savePara.appendChild(saveAnchor);
      saveColDiv.appendChild(savePara);
      commentForm.appendChild(saveColDiv);

      $foundCont.appendChild(mainDiv);
    }
  });
  xhr.send();
};

$searchForm.addEventListener("submit", handleSearch);
