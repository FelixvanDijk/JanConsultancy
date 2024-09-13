document.addEventListener('DOMContentLoaded', function () {
    // Modal functionality
    const openModalButton = document.getElementById('open-modal');
    const modal = document.getElementById('booking-modal');
    const closeModalButton = document.getElementById('close-modal');
    const bookingForm = document.getElementById('booking-form');

    // Open modal when 'Book' button is clicked
    openModalButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // Close modal when 'X' button is clicked
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission handler
    bookingForm.addEventListener('submit', function (event) {
        // No need to prevent default submission as we are using Formspree
        // Formspree handles the form submission
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (window.pageYOffset > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Testimonial Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const slidesContainer = document.querySelector('.slides');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const progressBar = document.querySelector('.progress-bar');
    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds

    function showSlide(index) {
        // Ensure index is within bounds
        currentIndex = (index + slides.length) % slides.length;

        // Move slides container to show the current slide
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Reset and animate progress bar
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.transition = `width ${slideDuration}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    // Next and Previous button event listeners
    nextButton.addEventListener('click', function () {
        showSlide(currentIndex + 1);
        resetSlideInterval();
    });

    prevButton.addEventListener('click', function () {
        showSlide(currentIndex - 1);
        resetSlideInterval();
    });

    // Auto-play slides every 5 seconds
    function startSlideInterval() {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = '100%';
        slideInterval = setInterval(function () {
            showSlide(currentIndex + 1);
        }, slideDuration);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    // Initialize the slider
    showSlide(currentIndex);
    startSlideInterval();

    const appointmentDateInput = document.getElementById('appointment-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    const selectedDateInput = document.getElementById('selected-date');
    const selectedTimeInput = document.getElementById('selected-time');
    let selectedTimeSlot = null;

    // Generate time slots in 20-minute intervals
    function generateTimeSlots() {
        timeSlotsContainer.innerHTML = ''; // Clear previous time slots
        selectedTimeSlot = null;
        selectedTimeInput.value = '';

        // Assuming working hours are from 09:00 to 17:00
        const startHour = 9;
        const endHour = 17;
        const intervals = 20; // 20-minute intervals

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += intervals) {
                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');
                const timeString = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                timeSlot.textContent = timeString;

                // Add event listener to select time slot
                timeSlot.addEventListener('click', function () {
                    // Ignore if disabled
                    if (timeSlot.classList.contains('disabled')) return;

                    // Deselect previous selection
                    const previouslySelected = document.querySelector('.time-slot.selected');
                    if (previouslySelected) {
                        previouslySelected.classList.remove('selected');
                    }

                    // Select current time slot
                    timeSlot.classList.add('selected');
                    selectedTimeSlot = timeString;
                    selectedTimeInput.value = timeString;
                });

                timeSlotsContainer.appendChild(timeSlot);
            }
        }
    }

    // Disable past dates and time slots
    function disablePastDates() {
        const today = new Date().toISOString().split('T')[0];
        appointmentDateInput.setAttribute('min', today);
    }

    function disablePastTimeSlots(selectedDate) {
        const timeSlots = document.querySelectorAll('.time-slot');
        const now = new Date();
        const selectedDateObj = new Date(selectedDate);

        timeSlots.forEach((timeSlot) => {
            const timeString = timeSlot.textContent;
            const [hours, minutes] = timeString.split(':').map(Number);
            selectedDateObj.setHours(hours, minutes, 0, 0);

            if (selectedDateObj < now) {
                timeSlot.classList.add('disabled');
            } else {
                timeSlot.classList.remove('disabled');
            }
        });
    }

    // Event listener for date selection
    appointmentDateInput.addEventListener('change', function () {
        const selectedDate = appointmentDateInput.value;
        selectedDateInput.value = selectedDate;
        generateTimeSlots();

        // If selected date is today, disable past time slots
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate === today) {
            disablePastTimeSlots(selectedDate);
        }
    });

    // Initialize date picker and time slots
    disablePastDates();

    // Form submission validation
    bookingForm.addEventListener('submit', function (event) {
        if (!appointmentDateInput.value) {
            alert('Please select a date for your appointment.');
            event.preventDefault();
            return;
        }
        if (!selectedTimeSlot) {
            alert('Please select a time slot for your appointment.');
            event.preventDefault();
            return;
        }
        // Formspree handles the form submission
    });
});

