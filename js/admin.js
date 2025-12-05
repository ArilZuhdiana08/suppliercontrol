/**
 * Admin Module
 * Mengelola hamburger menu, password protection, dan data view
 */

// ===== CONSTANTS =====
const ADMIN_PASSWORD = "123098";
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// ===== STATE VARIABLES =====
let adminAuthenticated = false;
let allSupplierData = [];
let currentFilterYear = null;
let currentFilterMonth = null;
let lastDisplayedData = []; // currently shown (filtered) dataset

// ===== DOM ELEMENTS =====
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebarNav = document.getElementById('sidebar-nav');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const homeLink = document.getElementById('home-link');
const adminLink = document.getElementById('admin-link');
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const passwordSubmitBtn = document.getElementById('password-submit-btn');
const passwordCancelBtn = document.getElementById('password-cancel-btn');
const passwordError = document.getElementById('password-error');
const adminPage = document.getElementById('admin-page');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const logoutAdminBtn = document.getElementById('logout-admin-btn');
const yearFilter = document.getElementById('year-filter');
const monthFilter = document.getElementById('month-filter');
const filterBtn = document.getElementById('filter-btn');
const imageModal = document.getElementById('image-modal');
const closeImageModalBtn = document.getElementById('close-image-modal-btn');
const modalImage = document.getElementById('modal-image');
const mainFormSection = document.querySelector('.form-section');

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
  setupAdminEventListeners();
  // Load initial data from Supabase if available
  if (typeof supabaseService !== 'undefined') {
    loadDataFromSupabase();
  } else {
    loadDataFromLocalStorage();
  }
});

// ===== EVENT LISTENERS SETUP =====
/**
 * Setup all admin event listeners
 */
function setupAdminEventListeners() {
  // Hamburger menu
  hamburgerBtn.addEventListener('click', openSidebar);
  closeSidebarBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Menu links
  homeLink.addEventListener('click', goHome);
  adminLink.addEventListener('click', openAdminLogin);

  // Password modal
  passwordSubmitBtn.addEventListener('click', verifyPassword);
  passwordCancelBtn.addEventListener('click', closePasswordModal);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyPassword();
  });

  // Admin page
  backToHomeBtn.addEventListener('click', goHome);
  logoutAdminBtn.addEventListener('click', logoutAdmin);

  // Filters
  filterBtn.addEventListener('click', filterData);
  yearFilter.addEventListener('change', updateMonthFilter);

  // Image modal
  closeImageModalBtn.addEventListener('click', closeImageModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeImageModal();
  });
  
  // Image error handling
  modalImage.addEventListener('error', () => {
    modalImage.alt = '❌ Gambar tidak dapat dimuat';
    modalImage.style.width = '300px';
    modalImage.style.height = 'auto';
  });
}

// ===== SIDEBAR FUNCTIONS =====
/**
 * Open sidebar navigation
 */
function openSidebar() {
  sidebarNav.classList.add('active');
  sidebarOverlay.style.display = 'block';
  // hide the hamburger button while sidebar is open
  if (hamburgerBtn) hamburgerBtn.style.display = 'none';
}

/**
 * Close sidebar navigation
 */
function closeSidebar() {
  sidebarNav.classList.remove('active');
  sidebarOverlay.style.display = 'none';
  // show the hamburger button again when sidebar is closed
  if (hamburgerBtn) hamburgerBtn.style.display = '';
}

// ===== NAVIGATION FUNCTIONS =====
/**
 * Go back to home page
 */
function goHome(e) {
  if (e) e.preventDefault();
  closeSidebar();
  adminPage.style.display = 'none';
  mainFormSection.style.display = 'flex';
}

/**
 * Open admin login dialog
 */
function openAdminLogin(e) {
  e.preventDefault();
  closeSidebar();
  if (adminAuthenticated) {
    showAdminPage();
  } else {
    showPasswordModal();
  }
}

/**
 * Show password modal
 */
function showPasswordModal() {
  passwordModal.style.display = 'flex';
  passwordInput.value = '';
  passwordError.style.display = 'none';
  passwordInput.focus();
}

/**
 * Close password modal
 */
function closePasswordModal() {
  passwordModal.style.display = 'none';
  passwordInput.value = '';
  passwordError.style.display = 'none';
}

/**
 * Verify admin password
 */
function verifyPassword() {
  const enteredPassword = passwordInput.value;
  
  if (enteredPassword === ADMIN_PASSWORD) {
    adminAuthenticated = true;
    closePasswordModal();
    showAdminPage();
  } else {
    passwordError.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

/**
 * Show admin page
 */
function showAdminPage() {
  mainFormSection.style.display = 'none';
  adminPage.style.display = 'block';
  
  // Initialize with current month/year
  const today = new Date();
  currentFilterYear = today.getFullYear();
  currentFilterMonth = today.getMonth() + 1;
  
  // Populate year filter from Supabase or localStorage
  if (typeof supabaseService !== 'undefined') {
    populateYearFilterFromSupabase();
  } else {
    populateYearFilter();
  }
  
  // Set current values
  yearFilter.value = currentFilterYear;
  monthFilter.value = currentFilterMonth;
  
  // Load data
  filterData();
  
  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Logout from admin
 */
function logoutAdmin() {
  adminAuthenticated = false;
  goHome();
}

// ===== DATA LOADING =====
/**
 * Load data from Supabase
 */
async function loadDataFromSupabase() {
  try {
    // Load all data from Supabase
    allSupplierData = await supabaseService.getSupplierVisits();
    console.log('Data loaded from Supabase:', allSupplierData.length, 'records');
  } catch (error) {
    console.error('Error loading from Supabase, falling back to localStorage:', error);
    loadDataFromLocalStorage();
  }
}

/**
 * Load data from localStorage
 */
function loadDataFromLocalStorage() {
  const savedData = localStorage.getItem('supplierData');
  if (savedData) {
    try {
      allSupplierData = JSON.parse(savedData);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      allSupplierData = [];
    }
  }
}

/**
 * Save new entry to localStorage
 */
function saveDataToLocalStorage(entry) {
  allSupplierData.push(entry);
  localStorage.setItem('supplierData', JSON.stringify(allSupplierData));
}

// ===== FILTER FUNCTIONS =====
/**
 * Populate year filter from Supabase
 */
async function populateYearFilterFromSupabase() {
  try {
    const years = await supabaseService.getAvailableYears();
    
    // Clear existing options except first
    while (yearFilter.options.length > 1) {
      yearFilter.remove(1);
    }

    // Add year options
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating years from Supabase:', error);
    populateYearFilter();
  }
}

/**
 * Populate year filter dropdown
 */
function populateYearFilter() {
  const years = new Set();
  years.add(new Date().getFullYear()); // Current year
  years.add(new Date().getFullYear() - 1); // Previous year
  
  // Also add years from existing data
  allSupplierData.forEach(entry => {
    const year = new Date(entry.TANGGAL || entry.arrival_date).getFullYear();
    years.add(year);
  });

  // Sort years in descending order
  const sortedYears = Array.from(years).sort((a, b) => b - a);

  // Clear existing options except first
  while (yearFilter.options.length > 1) {
    yearFilter.remove(1);
  }

  // Add year options
  sortedYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

/**
 * Update month filter based on selected year
 */
function updateMonthFilter() {
  currentFilterYear = parseInt(yearFilter.value) || new Date().getFullYear();
}

/**
 * Filter and display data
 */
async function filterData() {
  currentFilterYear = parseInt(yearFilter.value) || new Date().getFullYear();
  currentFilterMonth = parseInt(monthFilter.value) || (new Date().getMonth() + 1);

  try {
    let filteredData = [];
    
    // Load from Supabase if available
    if (typeof supabaseService !== 'undefined') {
      filteredData = await supabaseService.getSupplierVisitsByMonth(currentFilterMonth, currentFilterYear);
    } else {
      // Fallback to local data
      filteredData = allSupplierData.filter(entry => {
        const entryDate = new Date(entry.TANGGAL || entry.arrival_date);
        return entryDate.getFullYear() === currentFilterYear &&
               (entryDate.getMonth() + 1) === currentFilterMonth;
      });
    }

    // Display data
    displayDataTable(filteredData);
    
    // Display statistics
    displayStatistics(filteredData);
    
    // Display top suppliers
    displayTopSuppliers(filteredData);
  } catch (error) {
    console.error('Error filtering data:', error);
  }
}

// ===== DATA DISPLAY =====
/**
 * Display data in table
 */
function displayDataTable(data) {
  const tbody = document.getElementById('data-tbody');
  // keep reference to currently displayed data for deletion actions
  lastDisplayedData = data || [];
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Tidak ada data untuk periode ini</td></tr>';
    return;
  }

  tbody.innerHTML = data.map((entry, index) => {
    // Support both Supabase field names and localStorage field names
    const supplier = entry.SUPPLIER || entry.supplier_name;
    const date = formatDate(entry.TANGGAL || entry.arrival_date);
    const datetime = formatDateTime(entry.VERIFICATION_TIME || entry.actual_arrival_time);
    const status = entry.ARRIVAL_STATUS || entry.arrival_status;
    const statusClass = status === 'Tepat Waktu' ? 'status-ontime' : 
                       status === 'Terlambat (Toleransi)' || status === 'Late - Tolerance' ? 'status-tolerance' : 
                       'status-delay';
    const imageData = entry.SELFIE_DATA || entry.selfie_image;
    
    return `
        <tr>
          <td>${index + 1}</td>
          <td>${supplier}</td>
          <td>${date}</td>
          <td>${datetime}</td>
          <td>
            <span class="status-badge ${statusClass}">
              ${status}
            </span>
          </td>
          <td>
            <button class="btn-view-image" data-image="${index}" onclick="viewSelfieImage(this.getAttribute('data-image'))">
              👁️ Lihat
            </button>
          </td>
          <td>
            <button class="btn-delete" onclick="confirmDeleteEntry(${index})">🗑️ Hapus</button>
          </td>
        </tr>
    `;
  }).join('');
}

  /**
   * Confirm before deleting an entry shown in the table
   * @param {number} index - index in lastDisplayedData
   */
  function confirmDeleteEntry(index) {
    const entry = lastDisplayedData[index];
    if (!entry) return alert('Data tidak ditemukan untuk dihapus');

    const supplier = entry.SUPPLIER || entry.supplier_name || '—';
    const date = formatDate(entry.TANGGAL || entry.arrival_date || new Date().toISOString());

    const ok = confirm(`Hapus data ${supplier} pada ${date}?\nTindakan ini tidak dapat dikembalikan.`);
    if (!ok) return;

    deleteEntry(index).catch(err => {
      console.error('Gagal menghapus entry:', err);
      alert('Gagal menghapus data. Lihat console untuk detail.');
    });
  }

  /**
   * Delete an entry by index from lastDisplayedData
   * Handles Supabase-backed entries (by id) or localStorage fallback
   */
  async function deleteEntry(index) {
    const entry = lastDisplayedData[index];
    if (!entry) throw new Error('Entry not found');

    // If the entry appears to be from Supabase and has an id, delete via Supabase
    if (entry.id && typeof supabaseService !== 'undefined') {
      await supabaseService.deleteSupplierVisit(entry.id);
      // refresh the view
      await filterData();
      alert('Data berhasil dihapus');
      return;
    }

    // Otherwise, attempt to delete from localStorage data
    // Find exact match in allSupplierData and remove it
    const matchIndex = allSupplierData.findIndex(e => {
      // match by some stable fields (supplier + date + verification time)
      const aSupplier = (e.SUPPLIER || e.supplier_name || '').toString();
      const bSupplier = (entry.SUPPLIER || entry.supplier_name || '').toString();
      const aDate = (e.TANGGAL || e.arrival_date || '').toString();
      const bDate = (entry.TANGGAL || entry.arrival_date || '').toString();
      const aTime = (e.VERIFICATION_TIME || e.actual_arrival_time || '').toString();
      const bTime = (entry.VERIFICATION_TIME || entry.actual_arrival_time || '').toString();

      return aSupplier === bSupplier && aDate === bDate && aTime === bTime;
    });

    if (matchIndex >= 0) {
      allSupplierData.splice(matchIndex, 1);
      localStorage.setItem('supplierData', JSON.stringify(allSupplierData));
      await filterData();
      alert('Data berhasil dihapus (local)');
      return;
    }

    throw new Error('Tidak dapat menemukan entry untuk dihapus');
  }

/**
 * Display statistics
 */
function displayStatistics(data) {
  const totalVisits = data.length;
  const onTimeCount = data.filter(e => {
    const status = e.ARRIVAL_STATUS || e.arrival_status;
    return status === 'Tepat Waktu';
  }).length;
  const lateToleranceCount = data.filter(e => {
    const status = e.ARRIVAL_STATUS || e.arrival_status;
    return status === 'Terlambat (Toleransi)' || status === 'Late - Tolerance';
  }).length;
  const delayCount = data.filter(e => {
    const status = e.ARRIVAL_STATUS || e.arrival_status;
    return status === 'Delay';
  }).length;

  document.getElementById('total-visits').textContent = totalVisits;
  document.getElementById('on-time-count').textContent = onTimeCount;
  document.getElementById('late-tolerance-count').textContent = lateToleranceCount;
  document.getElementById('delay-count').textContent = delayCount;
}

/**
 * Display top suppliers (tepat waktu terbanyak)
 */
function displayTopSuppliers(data) {
  // Group data by supplier and count on-time visits
  const supplierStats = {};

  data.forEach(entry => {
    const supplier = entry.SUPPLIER || entry.supplier_name;
    const status = entry.ARRIVAL_STATUS || entry.arrival_status;
    
    if (!supplierStats[supplier]) {
      supplierStats[supplier] = {
        onTime: 0,
        total: 0
      };
    }
    supplierStats[supplier].total++;
    if (status === 'Tepat Waktu') {
      supplierStats[entry.SUPPLIER].onTime++;
    }
  });

  // Sort by on-time count (descending)
  const sortedSuppliers = Object.entries(supplierStats)
    .map(([supplier, stats]) => ({
      name: supplier,
      ...stats,
      percentage: Math.round((stats.onTime / stats.total) * 100)
    }))
    .sort((a, b) => b.onTime - a.onTime)
    .slice(0, 5); // Top 5

  // Display top suppliers
  const container = document.getElementById('top-suppliers-list');
  
  if (sortedSuppliers.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">Tidak ada data</p>';
    return;
  }

  container.innerHTML = sortedSuppliers.map((supplier, index) => `
    <div class="supplier-item">
      <div class="supplier-rank">🥇 #${index + 1}</div>
      <div class="supplier-info">
        <div class="supplier-name">${supplier.name}</div>
        <div class="supplier-stats">${supplier.onTime}/${supplier.total} kunjungan tepat waktu (${supplier.percentage}%)</div>
      </div>
      <div class="supplier-badge">${supplier.percentage}%</div>
    </div>
  `).join('');
}

// ===== IMAGE MODAL FUNCTIONS =====
/**
 * View selfie image in modal
 */
function viewSelfieImage(imageIndex) {
  const index = parseInt(imageIndex);
  
  if (isNaN(index) || !lastDisplayedData[index]) {
    alert('⚠️ Gambar tidak ditemukan');
    return;
  }
  
  const entry = lastDisplayedData[index];
  const imageData = entry.SELFIE_DATA || entry.selfie_image;
  
  if (!imageData || imageData === 'no-image') {
    alert('⚠️ Gambar selfie tidak tersedia untuk entri ini');
    return;
  }
  
  // Validate if it's a valid data URL
  if (!imageData.startsWith('data:')) {
    alert('⚠️ Format gambar tidak valid');
    return;
  }
  
  modalImage.src = imageData;
  imageModal.style.display = 'flex';
}

/**
 * Close image modal
 */
function closeImageModal() {
  imageModal.style.display = 'none';
  modalImage.src = '';
}

// ===== UTILITY FUNCTIONS =====
/**
 * Format date to DD/MM/YYYY
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format datetime to HH:MM:SS
 */
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Export function to save data
 * Called from form.js after successful submission
 */
function addNewSupplierEntry(formData) {
  const entry = {
    SUPPLIER: formData.get('SUPPLIER'),
    TANGGAL: formData.get('TANGGAL'),
    ACTUAL_DATETIME: formData.get('ACTUAL_DATETIME'),
    VERIFICATION_TIME: formData.get('VERIFICATION_TIME'),
    ARRIVAL_STATUS: formData.get('ARRIVAL_STATUS'),
    SELFIE_DATA: formData.get('SELFIE_DATA')
  };
  
  saveDataToLocalStorage(entry);
}
