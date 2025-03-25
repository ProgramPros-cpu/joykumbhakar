// Optional: Add any JavaScript functionality if needed
// For example, you can add smooth scrolling or other interactions
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('.content-section');

  // Hide all sections except the active one
  function hideAllSections() {
    sections.forEach(section => {
      section.classList.remove('active');
    });
  }

  // Show the selected section
  function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('active');
    }
  }

  // Add click event listeners to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior
      const sectionId = this.getAttribute('data-section');
      hideAllSections();
      showSection(sectionId);
    });
  });

  // Show the home section by default
  hideAllSections();
  showSection('home');
});
const words = ["HTML", "CSS", "JavaScript", "Python"];
let i = 0;
const typingSpan = document.querySelector(".typing");

function typeEffect() {
  let word = words[i];
  let j = 0;
  let startTime = null;

  function type(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const lettersToShow = Math.floor(progress / 100); // Adjust typing speed here

    if (lettersToShow <= word.length) {
      typingSpan.textContent = word.substring(0, lettersToShow);
      requestAnimationFrame(type);
    } else {
      setTimeout(eraseEffect, 1000); // Wait before erasing
    }
  }

  requestAnimationFrame(type);
}

function eraseEffect() {
  let j = typingSpan.textContent.length;
  let startTime = null;

  function erase(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const lettersToRemove = Math.floor(progress / 50); // Adjust erasing speed here

    if (lettersToRemove <= j) {
      typingSpan.textContent = typingSpan.textContent.substring(0, j - lettersToRemove);
      requestAnimationFrame(erase);
    } else {
      i = (i + 1) % words.length; // Move to the next word
      setTimeout(typeEffect, 500); // Wait before typing the next word
    }
  }

  requestAnimationFrame(erase);
}

// Start the animation
typeEffect();

document.getElementById("search-input").addEventListener("input", function () {
  let searchValue = this.value.toLowerCase();
  let allDivs = document.querySelectorAll("#search-container > div:not(#nain)");

  allDivs.forEach(div => {
    let divText = div.textContent.toLowerCase();
    let divClass = div.className.toLowerCase();
    let divData = div.getAttribute("data-tags") ? div.getAttribute("data-tags").toLowerCase() : "";

    if (divText.includes(searchValue) || divClass.includes(searchValue) || divData.includes(searchValue)) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  });
});

// Search Functionality
document.getElementById("search-input").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase().trim(); // Get the search term
  const allProjects = document.querySelectorAll(".project-container"); // Get all project containers

  allProjects.forEach(project => {
    const title = project.querySelector("h3").textContent.toLowerCase(); // Get project title
    const description = project.querySelector("p").textContent.toLowerCase(); // Get project description

    // Check if the title or description matches the search term
    if (title.includes(searchValue) || description.includes(searchValue)) {
      project.style.display = "flex"; // Show the full project container
    } else {
      project.style.display = "none"; // Hide the project container
    }
  });
});

// mode button
document.querySelector('.theme-switch__checkbox').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
//   pageinet
const projects = document.querySelectorAll('.project-container');
let currentIndex = 0;
const maxVisible = 6;

// Function to update which projects are visible
function showProjects() {
  projects.forEach((project, index) => {
    if (index >= currentIndex && index < currentIndex + maxVisible) {
      project.classList.add('visible');
      project.style.display = 'block';
    } else {
      project.classList.remove('visible');
      project.style.display = 'none';
    }
  });

  // Update button states
  updateButtonStates();
}

// Function to update the state of Next and Previous buttons
function updateButtonStates() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Disable Previous button if on the first page
  prevBtn.disabled = currentIndex === 0;

  // Disable Next button if on the last page
  nextBtn.disabled = currentIndex + maxVisible >= projects.length;
}

// Event listener for Next button
document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentIndex + maxVisible < projects.length) {
    currentIndex += maxVisible;
    showProjects();
  }
});

// Event listener for Previous button
document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentIndex - maxVisible >= 0) {
    currentIndex -= maxVisible;
    showProjects();
  }
});

// Initialize project visibility and button states
showProjects();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".card-container");
  const cards = document.querySelectorAll(".card");
  const middleCard = cards[2]; // Card 3 is the middle card

  // Set the initial scroll position to show Card 3
  container.scrollLeft = middleCard.offsetLeft - (container.offsetWidth / 2) + (middleCard.offsetWidth / 2);

  // Add smooth zoom effect on scroll
  container.addEventListener("scroll", () => {
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;

      // Calculate distance from the center
      const distance = Math.abs(cardCenter - containerCenter);

      // Apply zoom effect based on distance
      if (distance < containerRect.width / 2) {
        const scale = 1 - (distance / (containerRect.width / 2)) * 0.1;
        card.style.transform = `scale(${scale})`;
        card.style.opacity = 1 - (distance / (containerRect.width / 2)) * 0.3;
      } else {
        card.style.transform = "scale(0.9)";
        card.style.opacity = 0.7;
      }
    });
  });
});
// search for webproject
function filterProjects() {
  const searchInput = document.querySelector('.search-field');
  const searchTerm = searchInput.value.toLowerCase();
  const projects = document.querySelectorAll('.webprojectthing-container');

  projects.forEach(project => {
    const title = project.querySelector('.project-title').textContent.toLowerCase();
    const description = project.querySelector('.project-info').textContent.toLowerCase();

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      project.style.display = 'block';
    } else {
      project.style.display = 'none';
    }
  });
}
// form function
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const companyName = document.getElementById('companyName').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const mailtoLink = `mailto:programpros7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Company Name: ${companyName}\n\nMessage: ${message}`
  )}`;

  window.location.href = mailtoLink;

  // Show the "Sent" state
  const button = document.querySelector('.buttonsend');
  button.classList.add('sent');
});