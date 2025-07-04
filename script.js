// Enhanced smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
  
  // Enhanced navbar scroll effect with performance optimization
  let ticking = false
  
  function updateNavbar() {
    const navbar = document.getElementById("navbar")
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
    ticking = false
  }
  
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar)
      ticking = true
    }
  })
  
  // Mobile menu toggle with animation
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll(".bar")
    if (hamburger.classList.contains("active")) {
      bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
      bars[1].style.opacity = "0"
      bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
    } else {
      bars[0].style.transform = "none"
      bars[1].style.opacity = "1"
      bars[2].style.transform = "none"
    }
  })
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
  
      // Reset hamburger animation
      const bars = hamburger.querySelectorAll(".bar")
      bars[0].style.transform = "none"
      bars[1].style.opacity = "1"
      bars[2].style.transform = "none"
    })
  })
  
  // Enhanced AOS (Animate On Scroll) implementation
  class AnimationObserver {
    constructor() {
      this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      })
      this.init()
    }
  
    init() {
      document.querySelectorAll("[data-aos]").forEach((element) => {
        this.observer.observe(element)
      })
    }
  
    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-aos-delay") || 0
          setTimeout(() => {
            entry.target.classList.add("aos-animate")
          }, delay)
          this.observer.unobserve(entry.target)
        }
      })
    }
  }
  
  // Initialize animation observer when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new AnimationObserver()
  })
  
  // Enhanced contact form handling with validation
  document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault()
  
    const formData = new FormData(this)
    const data = Object.fromEntries(formData)
  
    // Enhanced validation
    const errors = validateForm(data)
    if (errors.length > 0) {
      showErrors(errors)
      return
    }
  
    const submitButton = this.querySelector('button[type="submit"]')
    const originalContent = submitButton.innerHTML
  
    // Show loading state
    submitButton.innerHTML = `
          <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span>送信中...</span>
      `
    submitButton.disabled = true
  
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
  
      // Show success message
      showSuccessMessage("メッセージを送信しました。24時間以内にご返信いたします。")
      this.reset()
    } catch (error) {
      showErrorMessage("送信に失敗しました。もう一度お試しください。")
    } finally {
      submitButton.innerHTML = originalContent
      submitButton.disabled = false
    }
  })
  
  function validateForm(data) {
    const errors = []
  
    if (!data.name || data.name.trim().length < 2) {
      errors.push("お名前は2文字以上で入力してください。")
    }
  
    if (!data.email || !isValidEmail(data.email)) {
      errors.push("有効なメールアドレスを入力してください。")
    }
  
    if (!data.subject) {
      errors.push("件名を選択してください。")
    }
  
    if (!data.message || data.message.trim().length < 10) {
      errors.push("メッセージは10文字以上で入力してください。")
    }
  
    return errors
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  function showErrors(errors) {
    const errorHtml = errors.map((error) => `<p style="color: var(--error); margin: 4px 0;">${error}</p>`).join("")
    showMessage(errorHtml, "error")
  }
  
  function showSuccessMessage(message) {
    showMessage(`<p style="color: var(--success);">${message}</p>`, "success")
  }
  
  function showErrorMessage(message) {
    showMessage(`<p style="color: var(--error);">${message}</p>`, "error")
  }
  
  function showMessage(html, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message")
    if (existingMessage) {
      existingMessage.remove()
    }
  
    // Create new message
    const messageDiv = document.createElement("div")
    messageDiv.className = `form-message ${type}`
    messageDiv.innerHTML = html
    messageDiv.style.cssText = `
          margin-top: 16px;
          padding: 16px;
          border-radius: 12px;
          background: ${type === "success" ? "var(--success)" : "var(--error)"}10;
          border: 1px solid ${type === "success" ? "var(--success)" : "var(--error)"}30;
          animation: slideIn 0.3s ease;
      `
  
    const form = document.getElementById("contactForm")
    form.appendChild(messageDiv)
  
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = "slideOut 0.3s ease"
        setTimeout(() => messageDiv.remove(), 300)
      }
    }, 5000)
  }
  
  // Skill progress bar animation
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress")
    skillBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 500)
    })
  }
  
  // Progress bar animation for projects
  function animateProgressBars() {
    const progressBars = document.querySelectorAll(".progress-fill")
    progressBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 1000)
    })
  }
  
  // Trigger animations when elements come into view
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("skills-preview")) {
            animateSkillBars()
          } else if (entry.target.classList.contains("projects-grid")) {
            animateProgressBars()
          }
          skillObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )
  
  document.addEventListener("DOMContentLoaded", () => {
    const skillsPreview = document.querySelector(".skills-preview")
    const projectsGrid = document.querySelector(".projects-grid")
  
    if (skillsPreview) skillObserver.observe(skillsPreview)
    if (projectsGrid) skillObserver.observe(projectsGrid)
  })
  
  // Typing animation for code window
  function typeCode() {
    const codeLines = document.querySelectorAll(".code-text")
    codeLines.forEach((line, index) => {
      const text = line.textContent
      line.textContent = ""
      line.style.opacity = "0"
  
      setTimeout(() => {
        line.style.opacity = "1"
        let i = 0
        const typeInterval = setInterval(() => {
          if (i < text.length) {
            line.textContent += text.charAt(i)
            i++
          } else {
            clearInterval(typeInterval)
          }
        }, 50)
      }, index * 500)
    })
  }
  
  // Initialize typing animation when hero section is visible
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(typeCode, 1000)
          heroObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )
  
  document.addEventListener("DOMContentLoaded", () => {
    const codeWindow = document.querySelector(".code-window")
    if (codeWindow) {
      heroObserver.observe(codeWindow)
    }
  })
  
  // Add CSS animations dynamically
  const style = document.createElement("style")
  style.textContent = `
      @keyframes slideIn {
          from {
              opacity: 0;
              transform: translateY(20px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }
      
      @keyframes slideOut {
          from {
              opacity: 1;
              transform: translateY(0);
          }
          to {
              opacity: 0;
              transform: translateY(-20px);
          }
      }
      
      .animate-spin {
          animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
          from {
              transform: rotate(0deg);
          }
          to {
              transform: rotate(360deg);
          }
      }
  `
  document.head.appendChild(style)
  
  // Performance optimization: Debounce scroll events
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  // Add loading state to page
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")
  
    // Trigger initial animations
    setTimeout(() => {
      document.querySelectorAll("[data-aos]").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("aos-animate")
        }
      })
    }, 100)
  })
  
  // Add keyboard navigation support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close mobile menu
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
  
      // Reset hamburger animation
      const bars = hamburger.querySelectorAll(".bar")
      bars[0].style.transform = "none"
      bars[1].style.opacity = "1"
      bars[2].style.transform = "none"
    }
  })
  
  // Add focus management for accessibility
  document.addEventListener("DOMContentLoaded", () => {
    // Skip to main content link
    const skipLink = document.createElement("a")
    skipLink.href = "#home"
    skipLink.textContent = "メインコンテンツにスキップ"
    skipLink.className = "sr-only"
    skipLink.style.cssText = `
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(--primary-600);
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1001;
          transition: top 0.3s;
      `
  
    skipLink.addEventListener("focus", () => {
      skipLink.style.top = "6px"
    })
  
    skipLink.addEventListener("blur", () => {
      skipLink.style.top = "-40px"
    })
  
    document.body.insertBefore(skipLink, document.body.firstChild)
  })
  