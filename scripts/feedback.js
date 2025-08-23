/* Feedback js */
document.addEventListener('DOMContentLoaded', function () {
    // Find the placeholder div in index.html
    const placeholder = document.getElementById('feedback-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
        <div class="feedback-card">
        <button class="close-btn">&times;</button>
        <h2>We appreciate your feedback.</h2>
        <p>We are always looking for ways to improve your experience.
            Please take a moment to evaluate and tell us what you think.
            Your feedback is invaluable to us and helps shape the future of our services.
        </p>

        <!--Rating Star-->
        <div class="rating-stars">
            <input type="radio" name="rating" id="star5" value="5">
        <label for="star5" tittle="5 star">&#9733;</label>

        <input type="radio" name="rating" id="star4" value="4">
        <label for="star4" tittle="4 star">&#9733;</label>

        <input type="radio" name="rating" id="star3" value="3">
        <label for="star3" tittle="3 star">&#9733;</label>

        <input type="radio" name="rating" id="star2" value="2">
        <label for="star2" tittle="2 star">&#9733;</label>

        <input type="radio" name="rating" id="star1" value="1">
        <label for="star1" tittle="1 star">&#9733;</label>
        </div>

        <!--Feedback Box-->
        <div class="feedback-box">
            <textarea placeholder="Please share your feedback here..."></textarea>

        <!--Submit Button-->
            <button class="submit-btn">Submit My Feedback</button>
    </div>
    </div>
        `;

        // Close Button Functionality
        const closeBtn = placeholder.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            placeholder.style.display = 'none';
        });

        // Submit Button Functionality
        const submitBtn = placeholder.querySelector('.submit-btn');
        const textarea = placeholder.querySelector('textarea');
        const ratingStars = placeholder.querySelectorAll('input[name="rating"]');

        submitBtn.addEventListener('click', () => {
            const feedbackText = textarea.value.trim();
            let selectedRating = null;
            ratingStars.forEach((star) => {
                if (star.checked) {
                    selectedRating = star.value;
                }
            });

            if (!feedbackText) {
                alert('Please enter your feedback before submitting.');
                return;
            }

            // Here you can handle the feedback submission (e.g., send it to a server)
            console.log('Feedback Submitted:', { rating: selectedRating, feedback: feedbackText });

            // Clear the form and close the feedback card
            textarea.value = '';
            ratingStars.forEach((star) => (star.checked = false));
            placeholder.style.display = 'none';
            alert('Thank you for your feedback!');
        });
            }
});
    