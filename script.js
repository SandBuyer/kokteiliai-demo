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
  await fetchCocktails(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
}

async function fetchCocktails(url, alcoholicFilter = "") {
  const cocktailList = document.getElementById("cocktail-list");
  cocktailList.innerHTML = "";

  try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.drinks) {
          let cocktails = data.drinks;

          if (alcoholicFilter) {
              cocktails = cocktails.filter(cocktail => cocktail.strAlcoholic === alcoholicFilter.replace("_", " "));
          }

          cocktails.forEach(cocktail => {
              displayCocktail(cocktail);
          });
      } else {
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