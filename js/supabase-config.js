// ===== SUPABASE CONFIGURATION =====
// Initialize Supabase client
const SUPABASE_URL = 'https://tmemlrumamlwvwioqvhf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZW1scnVtYW1sd3Z3aW9xdmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NjE1MjcsImV4cCI6MjA4MDQzNzUyN30.98gXzpNfENU-21XzjjsIYjGukI3wABuFF5ZvgWcRBnA'

// Initialize Supabase (runtime-guarded)
// Normalize URL (remove trailing slash if present)
const _SUPABASE_URL = (typeof SUPABASE_URL === 'string') ? SUPABASE_URL.replace(/\/+$/, '') : SUPABASE_URL

let supabaseClient = null
if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
  console.error('[Supabase] library not found. Ensure the script tag "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" is included in index.html BEFORE this config file.')
} else {
  try {
    const { createClient } = supabase
    supabaseClient = createClient(_SUPABASE_URL, SUPABASE_ANON_KEY)
    console.info('[Supabase] client initialized:', _SUPABASE_URL)
  } catch (err) {
    console.error('[Supabase] failed to initialize client:', err)
  }
}

// ===== TABLE NAMES =====
const TABLES = {
  SUPPLIER_VISITS: 'supplier_visits',
  SUPPLIERS: 'suppliers',
  ADMIN_USERS: 'admin_users'
}

// ===== SUPABASE SERVICE FUNCTIONS =====

/**
 * Save supplier visit data to Supabase
 * @param {Object} data - Form data to save
 * @returns {Promise<Object>} Response from Supabase
 */
async function saveSupplierVisit(data) {
  try {
    const visitData = {
      supplier_name: data.get('SUPPLIER'),
      scheduled_time: data.get('JAM_MASUK'),
      actual_arrival_time: data.get('JAM_KELUAR'),
      arrival_date: data.get('TANGGAL'),
      arrival_status: data.get('ARRIVAL_STATUS'),
      keterangan: data.get('KETERANGAN'),
      selfie_image: data.get('SELFIE_IMAGE'),
      latitude: data.get('LATITUDE'),
      longitude: data.get('LONGITUDE'),
      browser_info: data.get('BROWSER_INFO'),
      ip_address: data.get('IP_ADDRESS'),
      created_at: new Date().toISOString()
    }

    const { data: response, error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .insert([visitData])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      throw new Error(`Failed to save visit: ${error.message}`)
    }

    return response[0]
  } catch (error) {
    console.error('Error saving supplier visit:', error)
    throw error
  }
}

/**
 * Get all supplier visits with optional filters
 * @param {Object} filters - Filter options (month, year, supplier_name)
 * @returns {Promise<Array>} Array of supplier visits
 */
async function getSupplierVisits(filters = {}) {
  try {
    let query = supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .select('*')
      .order('arrival_date', { ascending: false })

    // Apply filters
    if (filters.supplier_name) {
      query = query.eq('supplier_name', filters.supplier_name)
    }

    if (filters.month && filters.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(filters.year, filters.month, 0).toISOString().split('T')[0]
      query = query.gte('arrival_date', startDate).lte('arrival_date', endDate)
    } else if (filters.year) {
      const startDate = `${filters.year}-01-01`
      const endDate = `${filters.year}-12-31`
      query = query.gte('arrival_date', startDate).lte('arrival_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch visits: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching supplier visits:', error)
    throw error
  }
}

/**
 * Get supplier visits for a specific month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2025)
 * @returns {Promise<Array>} Array of supplier visits for that month
 */
async function getSupplierVisitsByMonth(month, year) {
  return getSupplierVisits({ month, year })
}

/**
 * Get all unique supplier names
 * @returns {Promise<Array>} Array of supplier names
 */
async function getAllSuppliers() {
  try {
    const { data, error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .select('supplier_name')
      .order('supplier_name', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch suppliers: ${error.message}`)
    }

    // Get unique supplier names
    const uniqueSuppliers = [...new Set(data.map(d => d.supplier_name))]
    return uniqueSuppliers
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    throw error
  }
}

/**
 * Get all available years from data
 * @returns {Promise<Array>} Array of years
 */
async function getAvailableYears() {
  try {
    const { data, error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .select('arrival_date')

    if (error) {
      throw new Error(`Failed to fetch dates: ${error.message}`)
    }

    // Extract unique years
    const years = new Set()
    data.forEach(record => {
      const year = new Date(record.arrival_date).getFullYear()
      years.add(year)
    })

    // Add current year if not present
    years.add(new Date().getFullYear())

    return Array.from(years).sort((a, b) => b - a)
  } catch (error) {
    console.error('Error fetching available years:', error)
    return [new Date().getFullYear()]
  }
}

/**
 * Get visitor statistics for a specific month/year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Object>} Statistics object
 */
async function getMonthlyStatistics(month, year) {
  try {
    const visits = await getSupplierVisitsByMonth(month, year)

    const stats = {
      total_visits: visits.length,
      on_time_count: 0,
      late_tolerance_count: 0,
      delay_count: 0,
      on_time_percentage: 0,
      supplier_stats: {}
    }

    visits.forEach(visit => {
      // Count by status
      if (visit.arrival_status === 'Tepat Waktu') {
        stats.on_time_count++
      } else if (visit.arrival_status === 'Late - Tolerance') {
        stats.late_tolerance_count++
      } else if (visit.arrival_status === 'Delay') {
        stats.delay_count++
      }

      // Supplier-level stats
      if (!stats.supplier_stats[visit.supplier_name]) {
        stats.supplier_stats[visit.supplier_name] = {
          total: 0,
          on_time: 0,
          late_tolerance: 0,
          delay: 0
        }
      }

      stats.supplier_stats[visit.supplier_name].total++
      if (visit.arrival_status === 'Tepat Waktu') {
        stats.supplier_stats[visit.supplier_name].on_time++
      } else if (visit.arrival_status === 'Late - Tolerance') {
        stats.supplier_stats[visit.supplier_name].late_tolerance++
      } else if (visit.arrival_status === 'Delay') {
        stats.supplier_stats[visit.supplier_name].delay++
      }
    })

    // Calculate on-time percentage
    if (stats.total_visits > 0) {
      stats.on_time_percentage = Math.round((stats.on_time_count / stats.total_visits) * 100)
    }

    return stats
  } catch (error) {
    console.error('Error calculating statistics:', error)
    throw error
  }
}

/**
 * Get top suppliers by on-time performance
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @param {number} limit - Number of top suppliers to return (default: 5)
 * @returns {Promise<Array>} Array of top suppliers with stats
 */
async function getTopSuppliersByOnTime(month, year, limit = 5) {
  try {
    const stats = await getMonthlyStatistics(month, year)
    
    const topSuppliers = Object.entries(stats.supplier_stats)
      .map(([name, data]) => ({
        supplier_name: name,
        total_visits: data.total,
        on_time_visits: data.on_time,
        late_tolerance_visits: data.late_tolerance,
        delay_visits: data.delay,
        on_time_percentage: Math.round((data.on_time / data.total) * 100) || 0
      }))
      .sort((a, b) => b.on_time_visits - a.on_time_visits)
      .slice(0, limit)

    return topSuppliers
  } catch (error) {
    console.error('Error fetching top suppliers:', error)
    throw error
  }
}

/**
 * Update a supplier visit record
 * @param {number} id - Visit record ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated record
 */
async function updateSupplierVisit(id, updates) {
  try {
    const { data, error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      throw new Error(`Failed to update visit: ${error.message}`)
    }

    return data[0]
  } catch (error) {
    console.error('Error updating supplier visit:', error)
    throw error
  }
}

/**
 * Delete a supplier visit record
 * @param {number} id - Visit record ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteSupplierVisit(id) {
  try {
    const { error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete visit: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting supplier visit:', error)
    throw error
  }
}

/**
 * Search supplier visits
 * @param {string} searchTerm - Search term for supplier name or date
 * @returns {Promise<Array>} Matching supplier visits
 */
async function searchSupplierVisits(searchTerm) {
  try {
    const { data, error } = await supabaseClient
      .from(TABLES.SUPPLIER_VISITS)
      .select('*')
      .ilike('supplier_name', `%${searchTerm}%`)
      .order('arrival_date', { ascending: false })

    if (error) {
      throw new Error(`Failed to search visits: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error searching supplier visits:', error)
    throw error
  }
}

// ===== EXPORT FUNCTIONS =====
// These are accessible globally for use in other modules
window.supabaseService = {
  saveSupplierVisit,
  getSupplierVisits,
  getSupplierVisitsByMonth,
  getAllSuppliers,
  getAvailableYears,
  getMonthlyStatistics,
  getTopSuppliersByOnTime,
  updateSupplierVisit,
  deleteSupplierVisit,
  searchSupplierVisits
}
