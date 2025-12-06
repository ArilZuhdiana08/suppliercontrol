/**
 * Custom Dropdown Select untuk Supplier
 * Menyediakan search functionality dan modern UI
 */

// ===== STATE =====
let isDropdownOpen = false;
let selectedSupplier = '';

// ===== DOM ELEMENTS =====
const customSelect = document.getElementById('custom-supplier-select');
const selectHeader = document.querySelector('.custom-select-header');
const searchInput = document.getElementById('supplier-search-input');
const optionsContainer = document.getElementById('supplier-options');
const options = document.querySelectorAll('.custom-option');
const hiddenSelect = document.getElementById('supplier-select');

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
  if (!customSelect) return;
  setupDropdownListeners();
});

/**
 * Setup event listeners untuk dropdown
 */
function setupDropdownListeners() {
  // Toggle dropdown saat header diklik
  selectHeader.addEventListener('click', toggleDropdown);
  
  // Close dropdown saat area lain diklik
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      closeDropdown();
    }
  });
  
  // Search input listener
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keydown', handleKeyboard);
  
  // Option click listeners
  options.forEach((option) => {
    option.addEventListener('click', () => selectOption(option));
    option.addEventListener('mouseenter', () => {
      options.forEach(o => o.classList.remove('hover'));
      option.classList.add('hover');
    });
  });
}

/**
 * Toggle dropdown open/close
 */
function toggleDropdown() {
  if (isDropdownOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

/**
 * Open dropdown
 */
function openDropdown() {
  isDropdownOpen = true;
  selectHeader.classList.add('active');
  optionsContainer.classList.add('show');
  searchInput.focus();
  searchInput.select();
  
  console.log('[Dropdown] Opened');
}

/**
 * Close dropdown
 */
function closeDropdown() {
  isDropdownOpen = false;
  selectHeader.classList.remove('active');
  optionsContainer.classList.remove('show');
  searchInput.value = '';
  
  // Reset semua options ke visible
  options.forEach(option => {
    option.style.display = '';
    option.classList.remove('hover');
  });
  
  console.log('[Dropdown] Closed');
}

/**
 * Handle search input
 */
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  options.forEach((option) => {
    const optionText = option.textContent.toLowerCase();
    
    if (searchTerm === '' || optionText.includes(searchTerm)) {
      option.style.display = '';
    } else {
      option.style.display = 'none';
    }
  });
  
  console.log('[Dropdown] Search:', searchTerm);
}

/**
 * Handle keyboard navigation
 */
function handleKeyboard(e) {
  if (!isDropdownOpen) {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      openDropdown();
      e.preventDefault();
    }
    return;
  }
  
  const visibleOptions = Array.from(options).filter(
    opt => opt.style.display !== 'none'
  );
  const currentHover = document.querySelector('.custom-option.hover');
  const currentIndex = visibleOptions.indexOf(currentHover);
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (currentIndex < visibleOptions.length - 1) {
        visibleOptions[currentIndex + 1].classList.add('hover');
        if (currentHover) currentHover.classList.remove('hover');
      }
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        visibleOptions[currentIndex - 1].classList.add('hover');
        if (currentHover) currentHover.classList.remove('hover');
      }
      break;
      
    case 'Enter':
      e.preventDefault();
      if (currentHover) {
        selectOption(currentHover);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      closeDropdown();
      break;
  }
}

/**
 * Select option dan update form
 */
function selectOption(optionElement) {
  const value = optionElement.dataset.value;
  const text = optionElement.textContent;
  
  // Update selected state
  options.forEach(o => o.classList.remove('selected'));
  optionElement.classList.add('selected');
  
  // Update input placeholder/display
  if (value === '') {
    searchInput.placeholder = '🔍 Cari atau pilih supplier...';
    searchInput.value = '';
    selectedSupplier = '';
  } else {
    searchInput.value = text;
    selectedSupplier = value;
  }
  
  // Update hidden select untuk form compatibility
  hiddenSelect.value = value;
  
  // Trigger change event untuk form.js
  const event = new Event('change', { bubbles: true });
  hiddenSelect.dispatchEvent(event);
  
  console.log('[Dropdown] Selected:', value);
  
  // Close dropdown
  setTimeout(() => {
    closeDropdown();
  }, 200);
}

/**
 * Get selected supplier value
 */
function getSelectedSupplier() {
  return selectedSupplier;
}

// ===== EXPORT =====
window.supplierSelect = {
  getSelectedSupplier,
  openDropdown,
  closeDropdown
};
