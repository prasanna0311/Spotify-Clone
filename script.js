// spotify web api from the given link

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
var AuthCode = null;
var redirect_uri = "https://vigilant-goldwasser-5290c8.netlify.app/";
function getQueryParamerter() {
  // the hash property sets or returns the anchor part of a URL

  let queryParameters = window.location.hash;
  if (queryParameters.length > 0) {
    document.getElementById("welcome-message").style = "display:none";
    let token = queryParameters
      .substr(1)
      .split("access_token=")[1]
      .split("&token_type=Bearer&expires_in=3600")[0];
    localStorage.setItem("bearer", token);
    window.location.hash = "";
    document.getElementById("login-btn").style = "display:none;";
    document.getElementById("loggedInButton").style = "";

    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("bearer"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log("current user info", result);
        document.getElementById("user-name").innerText = result.display_name;
        document.getElementById("profile-id").href =
          result.external_urls.spotify;
        localStorage.setItem("user-id", result.id);
      })
      .catch((err) => {
        console.error(err);
      });
    getCategories();

    getMyPlaylists();
  }
}

// paage load

function pageLoad() {
  localStorage.clear();
  var client_id = "79527bd8653942b8808c0b56c9d3fa08";
  var client_secret = "16662c507e2d4dcf93da9630690a6edb";
  // Your unqiue client id and cliend secret
  localStorage.setItem("clientId", "79527bd8653942b8808c0b56c9d3fa08");
  localStorage.setItem("client_secret", "16662c507e2d4dcf93da9630690a6edb");

  // Spotify Authorization Page
  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=token";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url;
}

// Get categories

function getCategories() {
  let categoryResult = [];
  fetch(
    "https://api.spotify.com/v1/browse/categories?locale=en&limit=20&offset=5",
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("bearer"),
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      categoryResult = result.categories.items;
      createCategoryRows(categoryResult);
    })
    .catch((err) => {
      console.error(err);
    });
}

// by rows

function createCategoryRows(itemArray) {
  for (let i = 0; i < itemArray.length; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row ms-2 mb-3 pb-3");

    let h1 = document.createElement("h1");
    h1.classList = "category-heading";
    h1.innerText = itemArray[i].name;

    row.append(h1);

    // rowCols.append(musicCard(itemArray[i]))
    fetch(
      "https://api.spotify.com/v1/browse/categories/" +
        itemArray[i].id +
        "/playlists?limit=6",
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("bearer"),
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // rowCols.append(h1)

        if (result.playlists.items && result.playlists.items.length > 0) {
          for (let j = 0; j < result.playlists.items.length; j++) {
            let rowCols = document.createElement("div");
            rowCols.setAttribute("class", "col-12 col-sm-1 col-md-2 col-lg-2 ");
            rowCols.style = "color:white;";
            rowCols.appendChild(musicCard(result.playlists.items[j]));
            row.append(rowCols);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // row.appendChild(rowCols)

    document.getElementById("music-div").appendChild(row);
  }
}

function musicCard(item) {
  let cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", "card");
  cardDiv.style = "";
  cardDiv.setAttribute("data-id", item.id);
  cardDiv.setAttribute("data-heading", item.name);
  cardDiv.setAttribute("data-description", item.description);

  cardDiv.addEventListener("click", (event) => {
    //clickfunction
    drawPlaylist(item.id, item.name, item.description, item.images[0].url);
  });

  let cardImage = document.createElement("img");
  cardImage.src = item.images[0].url;
  cardImage.alt = item.id;
  cardImage.setAttribute("class", "pt-2");
  cardImage.setAttribute("class", "img-fluid");
  cardImage.style = "width:148px;height:148px";

  let cardBody = document.createElement("div");
  cardBody.classList = "card-body";

  let cardTitle = document.createElement("h5");
  cardTitle.classList = "card-title";
  cardTitle.innerText = item.name;

  let cardText = document.createElement("div");
  cardTitle.classList = "card-text";
  cardText.innerText = item.name;
  cardBody.append(cardTitle, cardText);

  cardDiv.append(cardImage, cardBody);

  return cardDiv;
}

//navigateToHome
function navigateToHome() {
  // document.getElementById('playlist-detail').innerHtml = '';

  const container = document.querySelector("#playlist-detail");
  removeAllChildNodes(container);
  document.getElementById("playlist-detail").style = "display:none;";

  document.getElementById("main-pageContent").style = "";
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//logout functionality
function logout() {
  localStorage.clear();
  document.getElementById("music-div").innerHTML = "";

  document.getElementById("login-btn").style = "";
  document.getElementById("loggedInButton").style = "display:none;";

  document.getElementById("welcome-message").style =
    "color: white; padding-left:400px;margin-top: 200px;";

  document.getElementById("playlist-list").innerHTML = "";
}

function drawPlaylist(id, name, description, imageUri) {
  // drawPlaylist(event.currentTarget.dataset.id, event.currentTarget.dataset.name, event.currentTarget.dataset.description, event.currentTarget.dataset.image)

  document.getElementById("main-pageContent").style = "display:none;";

  document.getElementById("playlist-detail").style = "display:none;";
  document.getElementById("playlist-detail").em;
  document.getElementById("playlist-detail").style = "";

  let container = document.getElementById("playlist-detail");
  container.setAttribute("class", "container");
  container.style = "color: white;height: 900px;onverflow:hidden;";

  let imageRow = document.createElement("div");
  imageRow.setAttribute(
    "class",
    "col-12 col-sm-12 col-md-12 col-lg-12 mt-5 pt-5"
  );
  imageRow.style = "height:340px;padding-left: 314px;";

  let imageRowDiv = document.createElement("div");
  imageRow.setAttribute("class", "row");

  let outerDiv1 = document.createElement("div");
  outerDiv1.style = "width: 100%;cursor: default;";
  outerDiv1.id = "intro-row";

  let row1 = document.createElement("div");
  row1.setAttribute("class", "row");
  row1.style = "width: 100%;";

  let col1 = document.createElement("div");
  col1.setAttribute("class", "col-2 col-sm-2 col-md-2 col-lg-2");

  let col1Img = document.createElement("img");
  col1Img.src = imageUri;
  col1Img.crossOrigin = "Anonymous";
  col1Img.id = "intro-image";
  col1Img.style = "width: 232px;height:232px;";

  col1.append(col1Img);

  let col2 = document.createElement("div");
  col2.setAttribute("class", "col-6 col-sm-6 col-md-6 col-lg-6 pt-5");

  let cardBody = document.createElement("div");
  cardBody.classList = "card-body";

  let cardTitle = document.createElement("h5");
  cardTitle.classList = "card-title";
  cardTitle.innerText = name;

  let cardText = document.createElement("p");
  cardTitle.classList = "card-text";
  cardText.innerText = description;
  cardBody.append(cardTitle, cardText);

  cardBody.append(cardTitle, cardText);

  col2.append(cardBody);

  row1.append(col1, col2);

  outerDiv1.append(row1);

  imageRow.append(imageRowDiv, outerDiv1);

  container.append(imageRow);

  //add upper table part
  container.appendChild(upperTable());

  fetch(
    "https://api.spotify.com/v1/playlists/" +
      id +
      "/tracks?market=IN&fields=items(added_by.id%2Ctrack(name%2Chref%2Calbum(name%2Chref)))&limit=10&offset=5",
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("bearer"),
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      container.appendChild(createPlaylistTable(result.items));
    })
    .catch((err) => {
      console.error(err);
    });

  //add table

  let image = document.getElementById("intro-image");
  let background = getAverageRGB(image);
  // 'linear - gradient(to down, rgba('+ background.r + ', ' + background.g + ',' + background.b +) +, rgba(255, 0, 0, 1)+')';
  document.getElementById("intro-row").style =
    "background-color:rgba(" +
    background.r +
    "," +
    background.g +
    "," +
    background.b +
    ");";
}

//For Play, like and more options
function upperTable(id) {
  let outerDiv = document.createElement("div");
  outerDiv.setAttribute("class", "row mt-4 mb-2");
  outerDiv.style = "padding-left: 314px;";

  let img1 = document.createElement("img");
  img1.src =
    "https://jccdallas.org/wp-content/uploads/2020/06/Spotify-Play-Button-1.png";
  // img1.alt = "play";
  img1.id = "play-button";

  let tempImg = document.createElement("img");
  tempImg.src = "./images/favorite_white_24dp.svg";
  tempImg.style = "";
  tempImg.id = "play-button";
  tempImg.style = "display:none";
  tempImg.addEventListener("click", (id) => {
    tempImg.style = "display:none;";
    unFollowPlaylist(id);
  });

  let img2 = document.createElement("img");
  img2.src = "https://./images/favorite_border_white_24dp.svg";
  img2.style = "color:white;";
  img2.class = "follow-button";
  img2.id = "play-button";
  img2.addEventListener("click", (id) => {
    followPlaylist(id);
    img2.style = "display:none";
    tempImg.style = "";
    followPlaylist(id);
  });

  let img3 = document.createElement("img");
  img3.src = "./images/more_horiz_white_24dp.svg";
  img3.id = "play-button";

  outerDiv.append(img1, img2, tempImg, img3);

  return outerDiv;
}

//Tracks table with track rows
function createPlaylistTable(items) {
  let outerRow = document.createElement("div");
  outerRow.setAttribute("class", "row mb-5 pb-5");
  outerRow.style = "height:340px;padding-left: 320px;";

  let table = document.createElement("table");

  let headerRow = document.createElement("tr");
  headerRow.style =
    "border-bottom: 1px solid white;font-weight: 40.0;height: 80px; ";

  let td1 = document.createElement("td");
  td1.innerText = "#";

  let td2 = document.createElement("td");
  td2.innerText = "TITLE";

  let td3 = document.createElement("td");
  td3.innerText = "ALBUM";

  let td4 = document.createElement("td");
  td4.innerText = "";

  let td5 = document.createElement("td");
  td5.innerText = "05:00";

  headerRow.append(td1, td2, td3, td4, td5);

  table.append(headerRow);

  //table values

  for (let i = 0; i < items.length; i++) {
    let valueRow = document.createElement("tr");
    valueRow.style = "height:80px;";
    valueRow.id = "table-heading";

    let td1 = document.createElement("td");
    td1.innerText = i + 1;
    td1.style = "width:1%;";

    let td2 = document.createElement("td");
    td2.innerText = items[i].track.album.name.split(" (")[0];
    td2.style = "width:37%;";

    let td3 = document.createElement("td");

    let name = items[i].track.album.name;
    if (
      name
        .substring(name.indexOf('From "'), name.indexOf('")'))
        .split('From "')[1]
    ) {
      td3.innerText = name
        .substring(name.indexOf('From "'), name.indexOf('")'))
        .split('From "')[1];
    } else {
      td3.innerText = "Generic album";
    }

    let td4 = document.createElement("td");
    td4.innerText = "";

    let td5 = document.createElement("td");
    td5.innerText = "03:08";

    valueRow.append(td1, td2, td3, td4, td5);

    table.append(valueRow);
  }
  outerRow.appendChild(table);
  return outerRow;
}

function followPlaylist(id) {
  fetch("https://api.spotify.com/v1/playlists/" + id + "/followers", {
    body: { public: false },
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("bearer"),
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "*",
    },
    method: "PUT",
  }).then((response) => {
    console.log(response);
    // return response.json()
  });
}

function unFollowPlaylist(id) {
  fetch("https://api.spotify.com/v1/playlists/" + id + "/followers", {
    headers: {
      Accept: "application/json",

      Authorization: "Bearer " + localStorage.getItem("bearer"),
      "Content-Type": "application/json",
    },
    method: "DELETE",
    mode: "no-cors",
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result);

      docuement.querySelector(".follow-button").style = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

function createPlayList() {
  fetch(
    "https://api.spotify.com/v1/users/foz6p5s28c0yakp61spnmqfd7/playlists",
    {
      body: JSON.stringify({
        name: "Playlist from API",
        description: "New playlist from API",
        public: false,
      }),
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer BQB_IRGyY0w_uB774hF55GGogUpqg-lapunv53dUj2VvnH-D5F8LzKsEO29HUYvo244zYOszJJRhux0KeWNZXMAPOXl53O3UwT8OPNNZfcPeyQigwg-MiHa5P486jqyyuHNvIutnGc_ADbg7QUICVVoHLgO9Y0WBrwVrvVqt4ObpQGPUew694l7NOWVxA-53WnwLBpernNOyByHS_4cXvd-OmX95RCdFLL-rzFHnPgbgnB6pSg",
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result);
      getMyPlaylists();
    })
    .catch((err) => {
      console.error(err);
    });
}

function getMyPlaylists() {
  fetch(
    "https://api.spotify.com/v1/users/" +
      localStorage.getItem("user-id") +
      "/playlists",
    {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("bearer"),
        "Content-Type": "application/json",
      },
    }
  )
    .then((resposne) => {
      return resposne.json();
    })
    .then((result) => {
      console.log(result.items);

      let playListDiv = document.getElementById("playlist-list");

      for (let i = 0; i < result.items.length; i++) {
        console.log(result.items[i]);
        let div = document.createElement("div");
        div.innerText = result.items[i].name;
        playListDiv.appendChild(div);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
