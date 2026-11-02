document.addEventListener('DOMContentLoaded', () => {
    // Lightbox Image Modal
    const images = document.querySelectorAll('main img');
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.classList.add('lightbox-modal');

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt || 'Full View';

            modal.appendChild(fullImg);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            modal.addEventListener('click', () => {
                modal.remove();
                document.body.style.overflow = 'auto';
            });
        });
    });

    // Clear error highlights & reset green block when typing in contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const outerSection = document.getElementById('contactSection') || contactForm.closest('.contact');
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
                
                const errorSpan = document.getElementById(input.id.replace('Input', 'Error')) || document.getElementById(input.id + 'Error');
                if (errorSpan) errorSpan.textContent = '';

                if (outerSection) {
                    outerSection.classList.remove('outer-block-success');
                }
            });
        });
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    if (nav) {
        nav.classList.toggle('nav-open');
    }
}

// Enquiry Form: Validation & Calculator
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('enquiry-name');
        const emailInput = document.getElementById('enquiry-email');
        const serviceSelect = document.getElementById('service-type');
        const sizeInput = document.getElementById('project-size');
        const resultBox = document.getElementById('enquiryResult');
        const resultText = document.getElementById('resultText');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const rate = serviceSelect ? parseFloat(serviceSelect.value) : NaN;
        const size = sizeInput ? parseFloat(sizeInput.value) : NaN;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            showError('enquiry-name-error', 'Please enter your full name.', nameInput);
            return;
        }

        if (!emailPattern.test(email)) {
            showError('enquiry-email-error', 'Please enter a valid email address.', emailInput);
            return;
        }

        if (isNaN(rate) || rate <= 0) {
            showError('service-type-error', 'Please select a service from the dropdown.', serviceSelect);
            return;
        }

        if (isNaN(size) || size <= 0) {
            showError('project-size-error', 'Please enter a valid area size in m².', sizeInput);
            return;
        }

        const totalCost = rate * size;
        const formattedCost = totalCost.toLocaleString('en-ZA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (resultText) {
            resultText.textContent = `Thank you ${name}! Estimated Cost for ${size} m² is: R ${formattedCost}`;
        }

        if (resultBox) {
            resultBox.style.display = 'block';
        }
    });
}


// Contact Form: Validation, Security and Green Outer Block Success State
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            clearErrors();

            const nameInput = document.getElementById('nameInput');
            const emailInput = document.getElementById('emailInput');
            const phoneInput = document.getElementById('phoneInput');
            const branchSelect = document.getElementById('branchSelect');
            const subjectInput = document.getElementById('subjectInput');
            const messageInput = document.getElementById('messageInput');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const branch = branchSelect ? branchSelect.value : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^(\+27|0)\d{9}$/;

            let isValid = true;

            if (!name) {
                showError('nameError', 'Please enter your name.', nameInput);
                isValid = false;
            }

            if (!emailPattern.test(email)) {
                showError('emailError', 'Please enter a valid email address.', emailInput);
                isValid = false;
            }

            if (!phonePattern.test(phone)) {
                showError('phoneError', 'Please enter a valid 10-digit phone number.', phoneInput);
                isValid = false;
            }

            if (!branch) {
                showError('branchError', 'Please select a branch location.', branchSelect);
                isValid = false;
            }

            if (!subject) {
                showError('subjectError', 'Please enter a subject.', subjectInput);
                isValid = false;
            }

            if (!message) {
                showError('messageError', 'Please enter your message.', messageInput);
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            const formStatus = document.getElementById('formStatus');
            const submitBtn = document.getElementById('sendEmailBtn');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending Email...';
            }

            // Web3Forms Submit
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }

                if (formStatus) {
                    formStatus.style.display = 'block';
                    if (data.success) {
                        formStatus.className = 'form-status success';
                        formStatus.textContent = `Thank you, ${name}! Your message has been successfully sent to our ${branch} branch.`;
                        contactForm.reset();
                    } else {
                        formStatus.className = 'form-status error';
                        formStatus.textContent = data.message || 'Something went wrong. Please try again.';
                    }
                }
            });
        });
    }
});
    
// Portfolio gallery filter
let activeCategory = 'all';

function filterPortfolio(category, event) {
    activeCategory = category;

    if (event && event.target) {
        $('.filter-btn').removeClass('active');
        $(event.target).addClass('active');
    }

    // Hide all sub-filter dropdowns first
    const $subResidential = $('#sub-residential');
    const $subCommercial = $('#sub-commercial');
    const $subInterior = $('#sub-interior');

    $subResidential.hide();
    $subCommercial.hide();
    $subInterior.hide();

    // Show the correct dropdown based on what was clicked
    if (category === 'residential') {
        $subResidential.fadeIn(200).val('all'); 
    } else if (category === 'commercial') {
        $subCommercial.fadeIn(200).val('all'); 
    } else if (category === 'interior') {
        $subInterior.fadeIn(200).val('all'); 
    }

    searchPortfolio(); 
}

function searchPortfolio() {
    const query = $('#portfolioSearch').val() ? $('#portfolioSearch').val().toLowerCase().trim() : '';
    let activeSubFilter = 'all';
    if ($('#sub-residential').is(':visible')) {
        activeSubFilter = $('#sub-residential').val();
    } else if ($('#sub-commercial').is(':visible')) {
        activeSubFilter = $('#sub-commercial').val();
    } else if ($('#sub-interior').is(':visible')) {
        activeSubFilter = $('#sub-interior').val();
    }

    $('.portfolio-card').each(function() {
        const $card = $(this);
        const titleText = $card.find('h3').text().toLowerCase() || '';
        const matchesSearch = titleText.includes(query);
        
        const matchesCategory = (activeCategory === 'all' || $card.hasClass(activeCategory) || $card.attr('data-category') === activeCategory);
        const cardSub = $card.attr('data-sub') || '';
        const matchesSub = (activeSubFilter === 'all' || cardSub === activeSubFilter);

        if (matchesCategory && matchesSub && matchesSearch) {
            $card.stop(true, true).fadeIn(300);
        } else {
            $card.stop(true, true).fadeOut(200);
        }
    });
}


// Image Comparison Slider
const slider = document.getElementById('slider');
const afterWrapper = document.getElementById('afterWrapper');
if (slider && afterWrapper) {
    slider.addEventListener('input', function (e) {
        afterWrapper.style.width = `${e.target.value}%`;
    });
}

// Helper Functions for Validation Errors & Sanitization
function showError(elementId, message, inputElement) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
        errorSpan.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('input-error');
    }
}

function clearErrors() {
    const errorSpans = document.querySelectorAll('.error-msg');
    errorSpans.forEach(span => {
        span.textContent = '';
    });
    const inputs = document.querySelectorAll('.input-error');
    inputs.forEach(input => {
        input.classList.remove('input-error');
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


// Testimonial Slider
document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.getElementById('testimonialDots');

    let currentSlide = 0;
    let autoSlide;

    if (!testimonials.length || !dotsContainer) return;

    testimonials.forEach((testimonial, index) => {
        const dot = document.createElement('button');

        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);

        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active-slide', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });

        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonials.length;
        showSlide(nextIndex);
    }

    function startAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 5000);
    }

    showSlide(0);
    startAutoSlide();
});