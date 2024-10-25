const apiUrl = 'www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita'; 

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const dataDiv = document.getElementById('data');
        data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
            dataDiv.appendChild(postElement);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });