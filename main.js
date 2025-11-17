// Diamonds data (first 3 items)
const diamondsItems = [
  {
    id: 1,
    title: "250",
    image: "https://n9f.site/images/Diamonds.png",
  },
  {
    id: 2,
    title: "1400",
    image: "https://n9f.site/images/Diamonds.png",
  },
  {
    id: 3,
    title: "2800",
    image: "https://n9f.site/images/Diamonds.png",
  },
]

// Class data (next 3 items)
const classItems = [
  {
    id: 4,
    title: "Fire Bandit",
    image: "https://n9f.site/images/firebandit.png",
  },
  {
    id: 5,
    title: "Necromancer",
    image: "https://n9f.site/images/Necromaner.png",
  },
  {
    id: 6,
    title: "Assassin",
    image: "https://n9f.site/images/assassin.png",
  },
  {
    id: 7,
    title: "Cyborg",
    image: "https://n9f.site/images/cyborg.png",
  },
  {
    id: 8,
    title: "Pyromaniac",
    image: "https://n9f.site/images/pyromaniac.png",
  },
]

// Items data (next 3 items)
const itemsData = [
  {
    id: 7,
    title: "Ice Sword",
    image: "https://n9f.site/images/ice sword.png",
  },
  {
    id: 8,
    title: "Trident",
    image: "https://n9f.site/images/trident.png",
  },
  {
    id: 9,
    title: "Cultist King Mace",
    image: "https://n9f.site/images/cultist king mace.png",
  },
]

const allItems = [...diamondsItems, ...classItems, ...itemsData]

// DOM elements
const mainContent = document.getElementById("mainContent")
const usernameInput = document.getElementById("usernameInput")
const continueButton = document.getElementById("continueButton")
const errorMessage = document.getElementById("errorMessage")
const diamondsGrid = document.getElementById("diamondsGrid")
const classGrid = document.getElementById("classGrid")
const itemsGrid = document.getElementById("itemsGrid")
const verifyingModal = document.getElementById("verifyingModal")
const confirmationModal = document.getElementById("confirmationModal")
const sendingModal = document.getElementById("sendingModal")
const finalStepModal = document.getElementById("finalStepModal")
const confirmationText = document.getElementById("confirmationText")
const sendingText = document.getElementById("sendingText")
const selectedItemsContainer = document.getElementById("selectedItemsContainer")
const sendItemsButton = document.getElementById("sendItemsButton")
const verifyNowButton = document.getElementById("verifyNowButton")

// State
let selectedItems = []
/* Track selected items per section for new selection logic */
const selectedItemsPerSection = {
  diamonds: null,
  class: null,
  items: null,
}
let dotInterval

// Initialize
function init() {
  generateItemsForSection(diamondsItems, diamondsGrid)
  generateItemsForSection(classItems, classGrid)
  generateItemsForSection(itemsData, itemsGrid)

  // Add event listeners
  continueButton.addEventListener("click", handleContinue)
  sendItemsButton.addEventListener("click", handleSendItems)
  verifyNowButton.addEventListener("click", handleVerifyNow)

  // Start loading dots animation
  startDotsAnimation()
}

function generateItemsForSection(items, gridElement) {
  items.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "item"
    itemElement.innerHTML = `
            <div class="item-image" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="item-img">
                <div class="item-checkmark">
                    <svg class="checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </div>
            <p class="item-title">${item.title}</p>
        `

    const itemImage = itemElement.querySelector(".item-image")
    itemImage.addEventListener("click", () => handleItemClick(item.id, itemImage))

    gridElement.appendChild(itemElement)
  })
}

// Handle item click
function handleItemClick(itemId, itemElement) {
  /* Updated selection logic to allow only 1 item per section */
  const item = allItems.find((item) => item.id === itemId)
  let sectionType = ""

  // Determine which section this item belongs to
  if (diamondsItems.find((i) => i.id === itemId)) {
    sectionType = "diamonds"
  } else if (classItems.find((i) => i.id === itemId)) {
    sectionType = "class"
  } else if (itemsData.find((i) => i.id === itemId)) {
    sectionType = "items"
  }

  // If this item is already selected, deselect it
  if (selectedItemsPerSection[sectionType] === itemId) {
    selectedItemsPerSection[sectionType] = null
    selectedItems = selectedItems.filter((id) => id !== itemId)
    itemElement.classList.remove("selected")

    // Clear error message
    if (errorMessage.style.display === "block") {
      errorMessage.style.display = "none"
    }
  } else {
    // If another item in this section is selected, deselect it first
    if (selectedItemsPerSection[sectionType] !== null) {
      const previouslySelected = document.querySelector(`[data-id="${selectedItemsPerSection[sectionType]}"]`)
      if (previouslySelected) {
        previouslySelected.classList.remove("selected")
      }
      selectedItems = selectedItems.filter((id) => id !== selectedItemsPerSection[sectionType])
    }

    // Select the new item
    selectedItemsPerSection[sectionType] = itemId
    selectedItems.push(itemId)
    itemElement.classList.add("selected")

    // Clear error message
    if (errorMessage.style.display === "block") {
      errorMessage.style.display = "none"
    }
  }
}

// Validate username
function validateUsername(username) {
  if (!username.trim()) {
    showError("Please enter a valid username.")
    return false
  }
  return true
}

// Show error
function showError(message) {
  const errorElement = document.getElementById("errorMessage")
  errorElement.textContent = message
  errorElement.style.display = "block"

  // Hide after 3 seconds
  setTimeout(() => {
    errorElement.style.display = "none"
  }, 3000)
}

// Handle continue button click
function handleContinue() {
  const username = usernameInput.value

  // Validate username
  if (!validateUsername(username)) {
    return
  }

  // Validate item selection
  if (selectedItems.length === 0) {
    showError("Please select at least 1 item")
    return
  }

  // Clear error
  errorMessage.style.display = "none"

  // Show verifying modal
  mainContent.classList.add("blur")
  verifyingModal.style.display = "flex"

  // After 3 seconds, show confirmation modal
  setTimeout(() => {
    verifyingModal.style.display = "none"

    // Update confirmation text
    confirmationText.textContent = `Would you like to send the items to @${username}?`

    // Generate selected items
    selectedItemsContainer.innerHTML = ""
    selectedItems.forEach((itemId) => {
      const item = allItems.find((item) => item.id === itemId)
      const selectedItemElement = document.createElement("div")
      selectedItemElement.className = "selected-item"
      selectedItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="selected-item-img">
            `
      selectedItemsContainer.appendChild(selectedItemElement)
    })

    confirmationModal.style.display = "flex"
  }, 3000) // 3 seconds
}

// Handle send items button click
function handleSendItems() {
  const username = usernameInput.value

  // Hide confirmation modal
  confirmationModal.style.display = "none"

  // Update sending text
  sendingText.textContent = `Sending items to @${username}`

  // Show sending modal
  sendingModal.style.display = "flex"

  // After 3 seconds, show final step modal
  setTimeout(() => {
    sendingModal.style.display = "none"
    finalStepModal.style.display = "flex"
  }, 3000) // 3 seconds
}

// Handle verify now button click
function handleVerifyNow() {
  const username = usernameInput.value

  // Here you would handle the verification process
  console.log("Verification requested for user:", username)
}

// Start loading dots animation
function startDotsAnimation() {
  const allDots = document.querySelectorAll(".dots")
  let dotCount = 1

  dotInterval = setInterval(() => {
    dotCount = dotCount < 3 ? dotCount + 1 : 1
    allDots.forEach((dots) => {
      dots.textContent = ".".repeat(dotCount)
    })
  }, 500)
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init)
