'use strict';


const createProjectItemHtml = function (project) {
  const title = project.title || "Untitled";
  const category = (project.category || "").toLowerCase();
  const categoryLabel = project.categoryLabel || project.category || "";
  const image = project.image || "";
  const alt = project.alt || title.toLowerCase();
  const url = project.url || "#";
  const article = project.article || "";

  return `
    <li class="project-item active" data-filter-item data-category="${category}">
      <a href="${url}" data-project-link data-project-article="${article}" data-project-title="${title}">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${image}" alt="${alt}" loading="lazy">
        </figure>
        <h3 class="project-title">${title}</h3>
        <p class="project-category">${categoryLabel}</p>
      </a>
    </li>
  `;
};

const loadPortfolioProjects = async function () {
  const projectList = document.getElementById("project-list");
  if (!projectList) {
    return;
  }

  try {
    const response = await fetch("assets/contents/projects/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error("Invalid projects data format");
    }

    projectList.innerHTML = projects.map(createProjectItemHtml).join("");
  } catch (error) {
    console.error("Error loading projects:", error);
    projectList.innerHTML = "";
  }
};

loadPortfolioProjects();


const projectModalContainer = document.querySelector("[data-modal-container]");
const projectModalCloseBtn = document.querySelector("[data-modal-close-btn]");
const projectModalOverlay = document.querySelector("[data-overlay]");
const projectModalTitle = document.querySelector("[data-modal-title]");
const projectArticleContainer = document.querySelector("[data-project-article]");
const projectListContainer = document.getElementById("project-list");

const openProjectModal = function () {
  if (!projectModalContainer || !projectModalOverlay) {
    return;
  }

  projectModalContainer.classList.add("active");
  projectModalOverlay.classList.add("active");
};

const closeProjectModal = function () {
  if (!projectModalContainer || !projectModalOverlay) {
    return;
  }

  projectModalContainer.classList.remove("active");
  projectModalOverlay.classList.remove("active");
};

const extractArticleHtml = function (rawHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  if (doc && doc.body && doc.body.innerHTML.trim()) {
    return doc.body.innerHTML;
  }

  return rawHtml;
};

const loadProjectArticle = async function (articlePath, title) {
  if (!projectArticleContainer) {
    return;
  }

  if (projectModalTitle) {
    projectModalTitle.textContent = title || "Project Article";
  }

  projectArticleContainer.innerHTML = "<p>Loading article...</p>";
  openProjectModal();

  if (!articlePath) {
    projectArticleContainer.innerHTML = "<p>Article is not available yet.</p>";
    return;
  }

  try {
    const response = await fetch(articlePath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const articleHtml = await response.text();
    projectArticleContainer.innerHTML = extractArticleHtml(articleHtml);
  } catch (error) {
    console.error("Error loading project article:", error);
    projectArticleContainer.innerHTML = "<p>Failed to load article. Please try again later.</p>";
  }
};

if (projectModalCloseBtn) {
  projectModalCloseBtn.addEventListener("click", closeProjectModal);
}

if (projectModalOverlay) {
  projectModalOverlay.addEventListener("click", closeProjectModal);
}

if (projectListContainer) {
  projectListContainer.addEventListener("click", function (event) {
    const projectLink = event.target.closest("[data-project-link]");
    if (!projectLink) {
      return;
    }

    event.preventDefault();

    const articlePath = projectLink.dataset.projectArticle || "";
    const title = projectLink.dataset.projectTitle || "Project Article";
    loadProjectArticle(articlePath, title);
  });
}



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn && overlay && modalContainer) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    if (select) {
      elementToggleFunc(select);
    }
    filterFunc(selectedValue);

  });
}

const filterFunc = function (selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
if (filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) {
        selectValue.innerText = this.innerText;
      }
      filterFunc(selectedValue);

      if (lastClickedBtn) {
        lastClickedBtn.classList.remove("active");
      }
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form && formBtn && form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else if (formBtn) {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}