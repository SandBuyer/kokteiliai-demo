async function basicSearch() {
  const input = document.getElementById("cocktail-input").value.trim();
  const alcoholicFilter = document.getElementById("alcoholic-filter").value;

  if (!input) {
      document.getElementById("cocktail-list").innerHTML = "<p>Please enter a search term.</p>";
      return;
  }

  let url = "";
  if (input.length === 1) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${input}`;
  } else if (/^[a-zA-Z\s]+$/.test(input)) {
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`;
  } else {
      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${input}`;
  }

  await fetchCocktails(url, alcoholicFilter);
}

async function filterByAlcohol() {
  await basicSearch();
}

async function lookupRandom() {
  const alcoholicFilter = document.getElementById("alcoholic-filter").value;
  const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  await fetchCocktails(url, alcoholicFilter);
}

async function fetchCocktails(url, alcoholicFilter = "") {
  const cocktailList = document.getElementById("cocktail-list");
  cocktailList.innerHTML = ""; // Clear previous results

  try {
    let apiUrl = url;

    // Adjust the API URL based on the alcoholic filter
    if (alcoholicFilter === "Alcoholic") {
      apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
    } else if (alcoholicFilter === "Non_Alcoholic") {
      apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
    }

    const response = await fetch(apiUrl); // Fetch the API using the adjusted URL
    const data = await response.json(); // Parse the response as JSON

    // Check if the API returned any drinks
    if (data.drinks) {
      let cocktails = data.drinks;

      // If the filter is not empty, only show drinks with matching "strAlcoholic" value
      if (alcoholicFilter) {
        cocktails = cocktails.filter(cocktail => cocktail.strAlcoholic === alcoholicFilter.replace("_", " "));
      }

      // Display each cocktail using the displayCocktail function
      cocktails.forEach(cocktail => {
        displayCocktail(cocktail); // Assuming this function handles displaying the cocktail info
      });
    } else {
      // If no cocktails were found, display a message
      cocktailList.innerHTML = "<p>No cocktails found.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    cocktailList.innerHTML = "<p>Failed to fetch data. Please try again later.</p>";
  }
}

function displayCocktail(cocktail) {
  const cocktailList = document.getElementById("cocktail-list");

  const cocktailItem = document.createElement("div");
  cocktailItem.classList.add("cocktail-item");
  cocktailItem.onclick = () => showModal(cocktail);

  const cocktailImage = document.createElement("img");
  cocktailImage.src = cocktail.strDrinkThumb;
  cocktailImage.alt = cocktail.strDrink;
  cocktailImage.classList.add("cocktail-image");

  const cocktailInfo = document.createElement("div");
  cocktailInfo.classList.add("cocktail-info");

  const cocktailName = document.createElement("h3");
  cocktailName.textContent = cocktail.strDrink || "No Name";

  const cocktailShortDesc = document.createElement("p");
  cocktailShortDesc.textContent = cocktail.strInstructions ? cocktail.strInstructions.slice(0, 50) + "..." : "No description available";

  cocktailInfo.appendChild(cocktailName);
  cocktailInfo.appendChild(cocktailShortDesc);

  cocktailItem.appendChild(cocktailImage);
  cocktailItem.appendChild(cocktailInfo);

  cocktailList.appendChild(cocktailItem);
}

function showModal(cocktail) {
  const modal = document.getElementById("cocktail-modal");
  const modalImage = document.getElementById("modal-image");
  const modalName = document.getElementById("modal-name");
  const modalDescription = document.getElementById("modal-description");
  const modalIngredients = document.getElementById("modal-ingredients");

  modalImage.src = cocktail.strDrinkThumb;
  modalName.textContent = cocktail.strDrink;
  modalDescription.textContent = cocktail.strInstructions || "No description available";
  
  modalIngredients.innerHTML = "";
  for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
          const listItem = document.createElement("li");
          listItem.textContent = `${measure || ""} ${ingredient}`;
          modalIngredients.appendChild(listItem);
      }
  }

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("cocktail-modal").style.display = "none";
}