// Form validation and submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Mobile menu toggle
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
        // Close mobile menu if open
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger reflow to enable transition
  toast.offsetHeight;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const privacyCheckbox = document.getElementById('privacyPolicy');
  
  // Validation
  if (!nameInput.value.trim()) {
    showToast('Please enter your full name');
    return;
  }
  
  if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
    showToast('Please enter a valid email address');
    return;
  }
  
  if (!privacyCheckbox.checked) {
    showToast('Please accept the privacy policy');
    return;
  }
  
  // Here you would add your Google Script URL
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        fullName: nameInput.value.trim(),
        email: emailInput.value.trim()
      })
    });
    
    if (response.ok) {
      showToast('Form submitted successfully!');
      form.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    showToast('Failed to submit form. Please try again.');
  }
}