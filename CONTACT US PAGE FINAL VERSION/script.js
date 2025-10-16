// Select all images in the slider
const slides = document.querySelectorAll('.slide'); 
let index = 0; // Current slide index

// Function to show the next slide
function showNextSlide() {
  slides[index].classList.remove('active'); // Hide current slide
  index = (index + 1) % slides.length;      // Go to next slide, loop back to first
  slides[index].classList.add('active');    // Show next slide
}

// Change slide automatically every 5 seconds
setInterval(showNextSlide, 5000);

// Form submission handling
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent page from refreshing
  alert('Message sent successfully!'); // Show confirmation
});
