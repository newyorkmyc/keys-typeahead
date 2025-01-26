// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadJSON);

let data = {}
const searchInput = document.querySelector('.search--input');
const searchBtn = document.querySelector('.fa-search');

searchBtn.addEventListener("click", (e)=> clearSelection());



// Function to load the JSON file and store it in a variable
async function loadJSON() {
    try {
        // Fetch the JSON file (replace 'data.json' with your file path)
        const response = await fetch('./fungi_taxonomy.json');

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${ response.status }`);
        }

        // Parse the JSON file into a JavaScript object
        data = await response.json();
        // Call performSearch to display all results on page load
        performSearch();
    } catch (error) {
        console.error('Error loading the JSON file:', error);
    }
}

function getFlagEmoji(countryCode) {
    if(countryCode === 'ww') return '🌎'

    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => {
            return 127397 + char.charCodeAt()});

    return String.fromCodePoint(...codePoints);
}


function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;  // If no search term is provided, return the original text
    const regex = new RegExp(`(${ searchTerm })`, 'gi');  // Create a case-insensitive regex
    return text.replace(regex, '<strong>$1</strong>');   // Replace the match with bolded text
}

function displayResults(results, searchTerm) {

    const resultsDiv = document.querySelector('.search-results-container');
    resultsDiv.innerHTML = '';  // Clear previous results
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    } else {
        results.forEach(result => {
            const resultElement = document.createElement('article');
            resultElement.classList.add('search-result');
            // Highlight search term in the title, latinName, and commonName
            const title = highlightMatch(result.title, searchTerm);
            const locale = highlightMatch(result.locale, searchTerm);
            const authors = highlightMatch(result.authors.join('</li><li>'), searchTerm);
            const latinName = highlightMatch(result.latinName || '', searchTerm);
            const commonName = highlightMatch(result.commonName || '', searchTerm);
            const language = highlightMatch(result.language || '', searchTerm);
            const countryCode = highlightMatch(result.country_code || '', searchTerm);
            const type = highlightMatch(result.type || '', searchTerm);

            // Construct the result HTML with  matches
            resultElement.innerHTML = `
                    <h5 class='key-locale'><div class="key-taxon--label">Locale:</div> ${ locale }</h5>
                    <h2 class='key-title'><a class='key-title--link' href='${ result.url }' target='_blank'>${ title }</a></h2>
                    <div class='key-meta'>
                        <div class='key-taxon-left'>
                          <div class='key-taxon key-taxon-grid'>
                                <div class='key-taxon--label'>Latin Name:</div>
                                ${ latinName }
                            </div>
                            <div class='key-language key-taxon-grid'>
                                <div class='key-taxon--label'>Language:</div>
                                ${ language }
                            </div>
                            <div class='key-country key-taxon-grid'>
                                <div class='key-taxon--label'>Country:</div>
                                    ${ getFlagEmoji(countryCode) }
                            </div>
                            <div class='key-taxon--type key-taxon-grid'>
                                <div class='key-taxon--label'>Key Type:</div>
                                ${ type }
                            </div>
                        </div>
                        <div class='key-taxon-right'>
                            <div class='key-common-name key-taxon-grid'>
                                <div class='key-taxon--label key-taxon--label-sm'>Common Name:</div>
                                ${ commonName ? commonName : 'N/A' }
                            </div>
                            <div class='key-taxon--authors key-taxon-grid'>
                                <div class='key-taxon--label'>Authors:</div>
                                <ul class='key-taxon--authors-list'>
                                    <li>${ authors }</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            resultsDiv.appendChild(resultElement);
        });
    }
}

// Recursive search function
function searchRecursive(obj, searchTerm, results) {

    if (obj === null) return; // Check if obj is null

    // If the object has "keys", search within them
    if (obj.keys && obj.keys.length > 0) {
        obj.keys.forEach(keyItem => {
            // Add obj.latinName and obj.commonName to the keyItem dictionary
            keyItem.latinName = obj.latinName || null;
            keyItem.commonName = obj.commonName || null;
            keyItem.taxon_id = obj.taxon_id || null;

            if (!searchTerm || keyItem.title.toLowerCase().includes(searchTerm.toLowerCase())
                || keyItem.authors.toString().toLowerCase().includes(searchTerm.toLowerCase())
                || keyItem.locale.toLowerCase().includes(searchTerm.toLowerCase())
                || (obj.latinName && obj.latinName.toLowerCase().includes(searchTerm.toLowerCase()))
                || (obj.commonName && obj.commonName.toLowerCase().includes(searchTerm.toLowerCase()))
            ) {
                results.push(keyItem);
            }
        });
    }

    // Recursively search nested properties
    ['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].forEach(taxon => {
        if (Array.isArray(obj[taxon])) {
            obj[taxon].forEach(subItem => searchRecursive(subItem, searchTerm, results));
        }
    });
}

// Function to count occurrences of each locale
function countCountry(results) {
    const countryCounts = {};

    results.forEach(result => {
        const country = result.locale || 'Global';
        if (countryCounts[country]) {
            countryCounts[country]++;
        } else {
            countryCounts[country] = 1;
        }
    });

    return countryCounts;
}

// Function to display countries with their count
function displayCountries(countryCounts) {
    const countryList = document.querySelector('.menu-country--list');
    countryList.innerHTML = ''; // Clear previous country list
    console.log({countryCounts})

    Object.keys(countryCounts).forEach(country => {
        const count = countryCounts[country];
        console.log({country})
        const countryItem = document.createElement('li');
        countryItem.classList.add('menu-country--item')

        countryItem.innerHTML = `${ country } (${ count })`;

        // Add click event to populate search field and trigger search
        countryItem.addEventListener('click', (e) => {
            searchInput.value = country;
            performSearch(); // Trigger search with the country
        });

        countryList.appendChild(countryItem);
    });
}

// Modify performSearch to also update the locale list
function performSearch() {
    const searchTerm = document.querySelector('.search--input').value.trim();
    const results = [];

    // Search through the data using the recursive function
    searchRecursive(data.life, searchTerm, results);

    // Display the search results
    displayResults(results, searchTerm);

    // Update the dynamic link based on the top result
    updateDynamicLink(results);

    // Count locales and display them
    const countryCounts = countCountry(results);
    console.log({results})
    displayCountries(countryCounts);
}

// Function to update two dynamic link buttons based on the top result's taxon_id
function updateDynamicLink(results) {
    const dynamicLinkButton1 = document.getElementById('dynamicLinkButton1');
    const dynamicLinkButton2 = document.getElementById('dynamicLinkButton2');

    if (results.length == 0) {
        // Disable both buttons if no results
        dynamicLinkButton1.disabled = true;
        dynamicLinkButton2.disabled = true;
    } else {
        dynamicLinkButton1.disabled = false;
        dynamicLinkButton2.disabled = false;

        const topResultTaxonId = results[0].taxon_id;  // Get the taxon_id from the top result
        const topResultLatinName = results[0].latinName;

        // Update text for both buttons
        dynamicLinkButton1.innerHTML = `${ topResultLatinName } Observations <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
        dynamicLinkButton2.innerHTML = `${ topResultLatinName } Observations<br/>with DNA Barcode ITS <i class="fa-solid fa-arrow-up-right-from-square"></i>`;

        // If taxon_id exists, construct the dynamic URLs
        if (topResultTaxonId) {
            // URL for the first button
            const baseUrl1 = "https://www.inaturalist.org/observations?subview=map&taxon_id=";
            const dynamicUrl1 = `${ baseUrl1 }${ topResultTaxonId }`;

            // URL for the second button with the additional field for DNA Barcode ITS
            const baseUrl2 = "https://www.inaturalist.org/observations?subview=map&taxon_id=";
            const dynamicUrl2 = `${ baseUrl2 }${ topResultTaxonId }&field:DNA%20Barcode%20ITS=`;

            // Update the first button's onclick event with the dynamic URL
            dynamicLinkButton1.onclick = function () {
                window.open(dynamicUrl1, "_blank");
            };

            // Update the second button's onclick event with the dynamic URL including the DNA Barcode ITS field
            dynamicLinkButton2.onclick = function () {
                window.open(dynamicUrl2, "_blank");
            };
        }
    }
}



// Function to get a random key from the JSON data
function getRandomKeyFromData(data) {
    const keys = [];

    // Recursive function to collect all keys
    function collectKeys(obj) {
        if (obj == null) return;

        // If the object has keys, add them to the keys array
        if (obj.keys && obj.keys.length > 0) {
            obj.keys.forEach(keyItem => keys.push(keyItem.title));
        }

        // Recursively collect keys from nested taxons
        ['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].forEach(taxon => {
            if (Array.isArray(obj[taxon])) {
                obj[taxon].forEach(collectKeys);
            }
        });
    }

    collectKeys(data.life); // Start from the kingdom level

    // Select a random key
    if (keys.length > 0) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        return keys[randomIndex];
    }

    return null;
}



// Function to fill in the search input with a random key
function exploreRandomKey() {
    const randomKey = getRandomKeyFromData(data);  // Get random key

    if (randomKey) {

        searchInput.value = randomKey;

        // Optionally, trigger the search after filling in the random key
        performSearch();
    } else {
        alert('No keys found in the data!');
    }
}

// Function to clear the search input
function clearSelection() {
    performSearch(); // Optionally, trigger search to clear results
    document.querySelector('.search--input').value = '';
}
