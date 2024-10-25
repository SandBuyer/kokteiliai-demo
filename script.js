async function searchCocktail() {
    const cocktailName = document.getElementById("cocktail-input").value;
    const cocktailList = document.getElementById("cocktail-list");
  
    // Clear previous results
    cocktailList.innerHTML = "";
  
    if (!cocktailName) {
      cocktailList.innerHTML = "<p>Please enter a cocktail name.</p>";
      return;
    }
  
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);
      const data = await response.json();
  
      if (data.drinks) {
        data.drinks.forEach(cocktail => {
          const cocktailItem = document.createElement("div");
          cocktailItem.classList.add("cocktail-item");
  
          const cocktailImage = document.createElement("img");
          cocktailImage.src = cocktail.strDrinkThumb;
          cocktailImage.alt = cocktail.strDrink;
  
          const cocktailName = document.createElement("h3");
          cocktailName.textContent = cocktail.strDrink;
  
          const cocktailInstructions = document.createElement("p");
          cocktailInstructions.textContent = cocktail.strInstructions;
  
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