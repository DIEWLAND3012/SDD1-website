/* =========================================
   CORE SYSTEM LOGIC (code.js)
   จัดการ Global State, API Fetch และ Utilities
========================================= */

// 1. ตั้งค่า URL ของ API (แก้ไขให้ตรงกับ Backend ของคุณ)
// ถ้าใช้ระบบ Path เดียวกัน (เช่น Node.js) ปล่อยว่างไว้ได้เลย
const API_BASE = ''; 

// 2. Global State สำหรับเก็บข้อมูลที่ต้องใช้ร่วมกันทั้งแอป
window.APP = {
  user: null,
  // สามารถเพิ่ม State อื่นๆ ที่ต้องการแชร์ข้ามไฟล์ได้ที่นี่
};

// =========================================
// STATE MANAGEMENT
// =========================================

// โหลดข้อมูลผู้ใช้จาก LocalStorage (ถ้ามี)
function loadApp() {
  const storedApp = localStorage.getItem('APP_STATE');
  if (storedApp) {
    try {
      window.APP = JSON.parse(storedApp);
    } catch (e) {
      console.error("Failed to parse APP_STATE", e);
    }
  }
}

// บันทึกข้อมูลผู้ใช้ลง LocalStorage
function saveApp() {
  localStorage.setItem('APP_STATE', JSON.stringify(window.APP));
}

// =========================================
// API COMMUNICATION
// =========================================

/**
 * ฟังก์ชันหลักสำหรับเรียกใช้งาน API
 * @param {string} endpoint - ตัวอย่าง: '/auth/login' หรือ '/requests'
 * @param {object} options - Method, Body, Headers
 * @returns {Promise<any>} - ข้อมูล JSON ที่ได้จาก Server
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('APP_TOKEN');
  
  // ตั้งค่า Headers พื้นฐาน
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    // จัดการกรณี Error จาก Server
    if (!response.ok) {
      // ถ้า Token หมดอายุ หรือไม่มีสิทธิ์ (401 Unauthorized) ให้เด้งออกไปหน้า Login
      if (response.status === 401) {
        localStorage.removeItem('APP_TOKEN');
        localStorage.removeItem('APP_STATE');
        window.location.href = 'index.html';
      }
      throw new Error(data.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
    
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

// =========================================
// UTILITIES & UI HELPERS (Minimal Style)
// =========================================

/**
 * สร้าง Badge แสดงสถานะแบบเรียบหรู (ไม่ใช้ Emoji)
 * @param {string} status - สถานะ เช่น 'pending', 'progress', 'completed'
 */
function getStatusBadge(status) {
  const statusConfig = {
    'pending': { 
      text: 'รอดำเนินการ', 
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '<svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    'progress': { 
      text: 'กำลังดำเนินการ', 
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: '<svg class="w-3.5 h-3.5 mr-1.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>'
    },
    'completed': { 
      text: 'เสร็จสิ้น', 
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '<svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
    },
    'cancelled': { 
      text: 'ยกเลิก', 
      classes: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: '<svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
    }
  };

  const config = statusConfig[status] || statusConfig['pending'];
  
  return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes}">
            ${config.icon}
            ${config.text}
          </span>`;
}

// รันคำสั่งโหลดข้อมูลพื้นฐานทันทีที่สคริปต์นี้ทำงาน
loadApp();