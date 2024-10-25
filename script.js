async function basicSearch() {
    const input = document.getElementById("cocktail-input").value.trim();
  
    if (!input) {
      document.getElementById("cocktail-list").innerHTML = "<p>Please enter a search term.</p>";
      return;
    }
  
    let url = "";
  
    // Determine search type
    if (input.length === 1) {
      // Search by first letter
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${input}`;
    } else if (/^[a-zA-Z\s]+$/.test(input)) {
      // If input contains only letters and spaces, search by name
      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`;
    } else {
      // Otherwise, assume it's an ingredient search
      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${input}`;
    }
  
    await fetchCocktails(url);
  }
  
  async function filterByAlcohol() {
    const alcoholic = document.getElementById("alcoholic-filter").value;
    
    if (alcoholic) {
      await fetchCocktails(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcoholic}`);
    } else {
      document.getElementById("cocktail-list").innerHTML = "<p>Please select Alcoholic or Non-Alcoholic.</p>";
    }
  }
  
  async function lookupRandom() {
    await fetchCocktails(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
  }
  
  async function fetchCocktails(url) {
    const cocktailList = document.getElementById("cocktail-list");
    cocktailList.innerHTML = ""; // Clear previous results
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.drinks) {
        data.drinks.forEach(cocktail => {
          const cocktailItem = document.createElement("div");
          cocktailItem.classList.add("cocktail-item");
  
          const cocktailImage = document.createElement("img");
          cocktailImage.src = cocktail.strDrinkThumb || "";
          cocktailImage.alt = cocktail.strDrink || "No Image";
  
          const cocktailName = document.createElement("h3");
          cocktailName.textContent = cocktail.strDrink || "No Name";
  
          const cocktailInstructions = document.createElement("p");
          cocktailInstructions.textContent = cocktail.strInstructions || "No Instructions Available";
  
          cocktailItem.appendChild(cocktailImage);
          cocktailItem.appendChild(cocktailName);
          cocktailItem.appendChild(cocktailInstructions);
  
          cocktailList.appendChild(cocktailItem);
        });
      } else {
        cocktailList.innerHTML = "<p>No cocktails found.</p>";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      cocktailList.innerHTML = "<p>Failed to fetch data. Please try again later.</p>";
    }
  }
  