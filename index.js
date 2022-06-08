// Global Variables
let offset = 0;
let searchTerm = "";
let limit = 15;
const API_KEY = 'nOjzgnRK5wSxGHruvjd3HVSux7Zxk46H';
const API_URL = `http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=${limit}&q=`;
const TRENDING_API_URL = `http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${limit}`;

// Query Selectors
const submitFormElement = document.querySelector('.search');
const resultsDivElement = document.querySelector('.results');
const showMoreButtonElement = document.querySelector('.show-more');

// Functions
const fetchSearchTerm = () => {
    return submitFormElement.input.value;
}


const fetchApiResults = async (e) => {
    // Prevents reload after submit
    e.preventDefault();

    // Fetch and store search term and add it to fetch path
    const searchTerm = fetchSearchTerm();
    console.log("search term is: " + searchTerm);
    const API_PATH = API_URL + searchTerm;

    if (!searchTerm.length) {
        fetchTrendingResults();
        return;
    }


    // Sends a request to the API
    const response = await fetch(API_PATH).then(async (res) => {
        return await res.json(); // Convert to JS Object

    })

    // fetchApiResult is only called when user does a new search, therefore we need
    // to empty the results container and reset the offset to 0 
    if (resultsDivElement) { resultsDivElement.innerHTML = ''; }
    offset = 0;

    // Reveal the "show more" button
    showMoreButtonElement.classList.remove("hidden");

    // Displays the results on html page
    console.log("reponse is: " + response.data);
    populateGifs(response.data);

}


const fetchAdditionalResults = async () => {
    // Grab the search term and update the offset
    searchTerm = fetchSearchTerm();
    offset += limit;
    const API_PATH = ((searchTerm.length) ? API_URL : TRENDING_API_URL) + searchTerm + "&offset=" + offset;

    // Populate the result container with the additional results
    const response = await fetch(API_PATH).then(async (res) => {
        return await res.json(); // Convert to JS Object

    })

    // Display additional results
    console.log("response is: " + response.data);
    populateGifs(response.data);
}


const fetchTrendingResults = async () => {
    // Make a request to GIPHY Trending API
    const API_PATH = TRENDING_API_URL;
    const response = await fetch(API_PATH).then(async (res) => {
        return await res.json(); // Convert to JS Object

    })

    // fetchTrendingResults is only called when user does an empty search or is onload. 
    // We need to empty the results container and reset the offset to 0 
    if (resultsDivElement) { resultsDivElement.innerHTML = ''; }
    offset = 0;

    // Reveal the "show more" button
    showMoreButtonElement.classList.remove("hidden");

    // Display trending results
    console.log("response is: " + response.data);
    populateGifs(response.data);
}


const populateGifs = (arr) => {
    // For every object in the array given by the api call, display the gif
    arr.forEach((obj, index) => {
        let gifUrl = obj.images.fixed_height.url; // Url of gif
        let title = obj.title; // Title of gif, for img alt

        // Create and add HTML element
        resultsDivElement.innerHTML += `
        <div class="gif ${index + offset}">
            <img src="${gifUrl}" alt="${title}">
        </div>
        `;
    });
}


// Event Listeners
submitFormElement.addEventListener("submit", fetchApiResults);
showMoreButtonElement.addEventListener("click", fetchAdditionalResults);


// Onload Function
window.onload = fetchTrendingResults;