document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const placesList = document.getElementById('places-list');
    const placeDetails = document.getElementById('place-details');
    const reviewForm = document.getElementById('review-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    if (placesList) {
        const token = getCookie('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        fetchPlaces();
    }

    if (placeDetails) {
        const token = getCookie('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const placeId = getPlaceIdFromURL();
        fetchPlaceDetails(placeId);
    }

    if (reviewForm) {
        const token = getCookie('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const placeId = getPlaceIdFromURL();

        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;
            await submitReview(placeId, reviewText, rating);
        });
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getPlaceImage(title) {
    if (title === 'Parc des Princes') {
        return 'images/parc.png';
    }
    if (title === 'Santiago Bernabeu') {
        return 'images/bernabeu.png';
    }
    if (title === 'La Bombonera') {
        return 'images/bombonera.png';
    }
    if (title === 'Westfalenstadion') {
        return 'images/westfalen.png';
    }
    return 'images/logo.png';
}

async function fetchPlaces() {
    const token = getCookie('token');

    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch places:', response.status);
            return;
        }

        const places = await response.json();
        displayPlaces(places);
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    if (!places || places.length === 0) {
        placesList.innerHTML = '<p>No places available.</p>';
        return;
    }

    places.forEach(place => {
        const placeCard = document.createElement('article');
        placeCard.className = 'place-card';

        placeCard.innerHTML = `
            <img src="${getPlaceImage(place.title)}" alt="${place.title}" class="place-image">
            <h3>${place.title}</h3>
            <p>${place.description}</p>
            <p>Price: ${place.price} €/night</p>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;

        placesList.appendChild(placeCard);
    });
}

async function fetchPlaceDetails(placeId) {
    const token = getCookie('token');

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch place details:', response.status);
            return;
        }

        const place = await response.json();
        console.log('PLACE =', place);
        console.log('AMENITIES =', place.amenities);

        displayPlaceDetails(place);
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');

let amenitiesHTML = '<p>No amenities available.</p>';

if (place.amenities && place.amenities.length > 0) {
    amenitiesHTML = `
        <ul class="amenities-list">
            ${place.amenities.map(amenity => {
                const label =
                    amenity?.name ||
                    amenity?.title ||
                    amenity?.amenity ||
                    amenity?.label ||
                    amenity?.id ||
                    amenity;

                return `<li>${label ? label : 'Unknown amenity'}</li>`;
            }).join('')}
        </ul>
    `;
}

let reviewsHTML = '<p>No reviews yet.</p>';

if (place.reviews && place.reviews.length > 0) {
    reviewsHTML = place.reviews.map(review => `
        <article class="review-card">
            <p><strong>User:</strong> ${review.user_name || review.user_id || 'Unknown'}</p>
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p>${review.text || ''}</p>
        </article>
    `).join('');
}

    const token = getCookie('token');
    const addReviewButton = token
        ? `<a href="add_review.html?id=${place.id}" class="details-button">Add Review</a>`
        : '';

    placeDetails.innerHTML = `
        <article class="place-card">
            <img src="${getPlaceImage(place.title)}" alt="${place.title}" class="place-image">
            <h2>${place.title}</h2>

            <div class="place-info">
                <p><strong>Description:</strong> ${place.description}</p>
                <p><strong>Price:</strong> ${place.price} €/night</p>
                <p><strong>Latitude:</strong> ${place.latitude}</p>
                <p><strong>Longitude:</strong> ${place.longitude}</p>
            </div>

            <section class="place-section">
                <h3>Amenities</h3>
                ${amenitiesHTML}
            </section>

            <section class="place-section">
                <h3>Reviews</h3>
                ${reviewsHTML}
            </section>

            <section class="place-section">
                ${addReviewButton}
            </section>
        </article>
    `;
}

async function submitReview(placeId, reviewText, rating) {
    const token = getCookie('token');

    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: reviewText,
                rating: parseInt(rating),
                place_id: placeId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Failed to submit review: ' + (errorData.message || response.statusText));
            return;
        }

        alert('Review submitted successfully!');
        window.location.href = `place.html?id=${placeId}`;
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Could not submit review.');
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Login failed: ' + (errorData.message || response.statusText));
            return;
        }

        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during login:', error);
        alert('Could not connect to the API.');
    }
}