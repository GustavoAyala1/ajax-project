const $searchForm = document.querySelector("#searchForm");
const $foundCont = document.querySelector(".foundCont");
const $saveBtn = document.querySelector(".saveBtn");
const $commentForm = document.querySelector(".commentForm");
const $collectionsCont = document.querySelector(".collectionsCont");
const $homePage = document.querySelector(".collections");
const $sort = document.querySelector(".sort");
const $forms = document.querySelector(".commentForm");

/*                       HANDLE SEARCH                                      */
const handleSearch = (event) => {
  event.preventDefault();

  const inputValue = $searchForm.searchInput.value;
  $foundCont.classList.remove("hidden");
  $collectionsCont.classList.add("hidden");
  searchAPI(inputValue, $foundCont);
  $searchForm.reset();
};

/*                       SEARCH REQUEST ON API                                      */
const searchResults = [];

//keys1=k_mfnhal5g
//keys2=k_760ufq2x
const xhr = new XMLHttpRequest();
const searchAPI = (search) => {
  xhr.open(
    "GET",
    `https://imdb-api.com/en/API/SearchTitle/k_mfnhal5g/${search}`
  );

  xhr.responseType = "json";
  xhr.addEventListener("load", () => {
    const response = xhr.response;
    // console.log(xhr.status);
    // console.log(response);
    removeAllChildNodes($foundCont);
    for (let i = 0; i < response.results.length; i++) {
      createFoundElement(response.results[i], $foundCont);
      const resultsObj = {
        title: response.results[i].title,
        description: response.results[i].description,
        image: response.results[i].image,
      };

      if (resultsObj.description.slice(0, 3) === "(I)") {
        resultsObj.year = +resultsObj.description.slice(5, 9);
      } else {
        resultsObj.year = +resultsObj.description.slice(1, 5);
      }

      searchResults.unshift(resultsObj);
    }
  });
  xhr.send();
};

const comingSoon = (search) => {
  xhr.open("GET", `https://imdb-api.com/en/API/MostPopularMovies/k_mfnhal5g`);

  xhr.responseType = "json";
  xhr.addEventListener("load", () => {
    const response = xhr.response;
    // console.log(xhr.status);
    // console.log(response);
    removeAllChildNodes($foundCont);
    for (let i = 0; i < 20; i++) {
      createFoundElement(response.items[i], $collectionsCont);
    }
  });
  xhr.send();
};

const createFoundElement = (results, container) => {
  const dataView = data.nextEntryId++;

  const mainDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  const infoDiv = document.createElement("div");
  const title = document.createElement("h2");
  const paragraph = document.createElement("p");
  const saveBtn = document.createElement("button");
  const commentForm = document.createElement("form");
  const textarea = document.createElement("textarea");
  const commentP = document.createElement("p");
  const extraDiv = document.createElement("div");
  const extraOne = document.createElement("div");
  const deleteAnchor = document.createElement("button");
  const saveColDiv = document.createElement("div");
  const saveAnchor = document.createElement("button");

  mainDiv.className = "lowrow fullCol thirdCol fifthCol resultsCont";
  mainDiv.setAttribute("data-view", dataView);
  imgDiv.className = "halfCol resultsCol";
  infoDiv.className = "halfCol infoSect resultsCol";
  img.setAttribute("src", results.image);
  saveBtn.setAttribute("class", "saveBtn");
  commentForm.className = "commentForm hidden";
  textarea.setAttribute("name", "comments");
  textarea.setAttribute("class", "comments");
  textarea.setAttribute("id", "comments");
  textarea.setAttribute("placeholder", "Add comments");
  commentP.setAttribute("class", "commentReplaced");
  extraDiv.setAttribute("class", "row");
  extraOne.setAttribute("class", "halfCol");
  deleteAnchor.setAttribute("class", "deleteComment");
  saveColDiv.setAttribute("class", "halfCol");
  saveAnchor.setAttribute("class", "addComment");
  saveBtn.setAttribute("data-view", dataView);

  title.textContent = results.title;
  paragraph.textContent = results.description;
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
  extraOne.appendChild(deleteAnchor);
  extraDiv.appendChild(extraOne);
  commentForm.appendChild(extraDiv);
  saveColDiv.appendChild(saveAnchor);
  extraDiv.appendChild(saveColDiv);

  if (container === $collectionsCont) {
    saveBtn.textContent = "Add Comment";
    if (results.comment && results.comment !== '""') {
      saveBtn.classList.add("hidden");
      commentForm.classList.remove("hidden");
      textarea.classList.add("hidden");
      commentP.textContent = results.comment;
      commentForm.prepend(commentP);
    }
  }

  container.appendChild(mainDiv);
};

/*                       SAVING COMMENTS                                      */

const saveClick = (event) => {
  const target = event.target;
  const containerElement = event.target.parentElement.parentElement;
  if (target.getAttribute("class") === "saveBtn") {
    if ($foundCont.classList.contains("hidden")) {
      target.classList.add("hidden");
      target.nextElementSibling.classList.remove("hidden");
    }
    if ($collectionsCont.classList.contains("hidden")) {
      target.classList.add("redSaveBtn");
      const title = containerElement.children[1].children[0].innerText;
      const description = containerElement.children[1].children[1].innerText;
      const imgLink =
        containerElement.children[0].children[0].getAttribute("src");
      const entryObj = {
        title: title,
        description: description,
        image: imgLink,
      };
      if (entryObj.description.slice(0, 3) === "(I)") {
        entryObj.year = +entryObj.description.slice(5, 9);
      } else {
        entryObj.year = +entryObj.description.slice(1, 5);
      }
      data.results.push(entryObj);
    }
  }
};

const addComment = (event) => {
  event.preventDefault();
  const target = event.target;
  let submitter = event.submitter;

  const getForm = target.getAttribute("class");
  const value = target.comments.value;
  if (getForm === "commentForm") {
    let formParent = submitter.parentElement.parentElement.parentElement;
    let textareaNear = formParent.children[0];
    let textareaAfter = formParent.children[1];
    const commentReplaced = document.createElement("p");
    if (submitter.getAttribute("class") === "addComment") {
      if (textareaNear.tagName === "P") {
        textareaNear.remove();
        commentReplaced.remove();
        textareaNear.classList.remove("hidden");
        textareaAfter.classList.remove("hidden");
        textareaAfter.textContent = value;
        for (let i = 0; i < data.results.length; i++) {
          if (
            target.parentElement.children[0].innerText === data.results[i].title
          ) {
            data.results[i].comment = value;
          }
        }
      } else {
        commentReplaced.setAttribute("class", "commentReplaced");
        commentReplaced.innerText = `${value}`;
        formParent.prepend(commentReplaced);
        textareaNear.classList.add("hidden");
        const title = target.parentElement.children[0].innerText;
        const description = target.parentElement.children[1].innerText;
        const imgLink =
          target.parentElement.parentElement.children[0].children[0].getAttribute(
            "src"
          );

        const entryObj = {
          title: title,
          description: description,
          image: imgLink,
          comment: commentReplaced.innerText,
        };
        if (entryObj.description.slice(0, 3) === "(I)") {
          entryObj.year = +entryObj.description.slice(5, 9);
        } else {
          entryObj.year = +entryObj.description.slice(1, 5);
        }
        for (let i = 0; i < data.results.length; i++) {
          if (data.results[i].title === entryObj.title) {
            data.results.splice(i, 1, entryObj);
          }
        }
        // data.results.push(entryObj);
      }
    } else if (submitter.getAttribute("class") === "deleteComment") {
      if (textareaNear.tagName !== "P") {
        formParent.parentElement.parentElement.remove();

        for (let i = 0; i < data.results.length; i++) {
          if (
            formParent.parentElement.firstChild.textContent ===
            data.results[i].title
          ) {
            data.results.splice(i, 1);
          }
        }
      }
      formParent.classList.add("hidden");
      formParent.reset();
      formParent.parentElement.children[2].classList.remove("hidden");
      if (textareaNear.tagName === "P") {
        textareaAfter.textContent = "";
        textareaNear.remove();
      }
      textareaNear.classList.remove("hidden");
      textareaAfter.classList.remove("hidden");
    }
  }
};

/*                       SAVING TO COLLECTIONS                                      */

const saveCollections = (event) => {
  if (data.results.length === 0) {
    removeAllChildNodes($collectionsCont);
    comingSoon();
  }
  removeAllChildNodes($collectionsCont);
  $foundCont.classList.add("hidden");
  $collectionsCont.classList.remove("hidden");
  for (let i = 0; i < data.results.length; i++) {
    createFoundElement(data.results[i], $collectionsCont);
  }
};
if (data.results.length > 0) {
  removeAllChildNodes($collectionsCont);
  $foundCont.classList.add("hidden");
  $collectionsCont.classList.remove("hidden");
  for (let i = 0; i < data.results.length; i++) {
    createFoundElement(data.results[i], $collectionsCont);
  }
} else {
  $foundCont.classList.add("hidden");
  $collectionsCont.classList.remove("hidden");
  for (let i = 0; i < data.results.length; i++) {
    comingSoon("random");
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
/*                       SORTING                                                */
const handleSort = (event, location) => {
  const value = event.target.value;
  let container;
  let otherContainer;
  if (searchResults.length === 0) {
    location = data.results;
    container = $collectionsCont;
    otherContainer = $foundCont;
  } else {
    location = searchResults;
    otherContainer = $collectionsCont;
    container = $foundCont;
  }

  removeAllChildNodes(container);

  for (let i = 0; i < location.length; i++) {
    if (value === "newest") {
      const sorted = location.sort((newer, older) => {
        return older.year - newer.year;
      });
      createFoundElement(sorted[i], container);
    }
    if (value === "oldest") {
      const sorted = location.sort((newer, older) => {
        return newer.year - older.year;
      });
      createFoundElement(sorted[i], container);
    }
    if (value === "sort") {
      createFoundElement(location[i], container);
    }
  }
};
/*                       EVENT LISTENERS                                       */

if (data.results.length === 0) {
  window.addEventListener("load", comingSoon);
}

window.addEventListener("click", saveClick);
$homePage.addEventListener("click", saveCollections);
$searchForm.addEventListener("submit", handleSearch);
window.addEventListener("submit", addComment);
$sort.addEventListener("input", handleSort);
