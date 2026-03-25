// public/js/utils.js

/**
 * 1. ระบบแจ้งเตือน (Toast Notification)
 * แสดงข้อความแจ้งเตือนที่มุมขวาล่าง แบบ Glassmorphism
 * @param {string} msg - ข้อความที่ต้องการแสดง
 * @param {string} type - 'success' (เขียว), 'error' (แดง), 'warning' (เหลือง), 'info' (ฟ้า)
 */
function toast(msg, type = 'success') {
    let container = document.getElementById('toast-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-root';
        // ใช้ Tailwind จัดตำแหน่งให้อยู่มุมขวาล่าง เลเยอร์บนสุด
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    
    // ตั้งค่าสีและไอคอนตามประเภท
    const configs = {
        success: { color: 'text-green-600', bg: 'bg-green-50/80', border: 'border-green-200', icon: 'check-circle' },
        error: { color: 'text-red-600', bg: 'bg-red-50/80', border: 'border-red-200', icon: 'alert-circle' },
        warning: { color: 'text-amber-600', bg: 'bg-amber-50/80', border: 'border-amber-200', icon: 'alert-triangle' },
        info: { color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-200', icon: 'info' }
    };
    
    const conf = configs[type] || configs.info;

    // สไตล์แบบ Glassmorphism (The Digital Aurora)
    toastEl.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md transform transition-all duration-300 translate-y-10 opacity-0 ${conf.bg} ${conf.border}`;
    
    toastEl.innerHTML = `
        <i data-lucide="${conf.icon}" class="w-5 h-5 ${conf.color}"></i>
        <span class="text-sm font-medium text-gray-800">${msg}</span>
    `;

    container.appendChild(toastEl);
    
    // Render Icon
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: toastEl });

    // Animate เข้า
    setTimeout(() => {
        toastEl.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Animate ออกและลบทิ้งหลัง 3 วินาที
    setTimeout(() => {
        toastEl.classList.add('opacity-0', 'scale-95');
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}

/**
 * 2. ฟังก์ชันแปลงวันที่ (Date Formatter)
 * แปลงวันที่จาก Database ให้เป็นภาษาไทยอ่านง่าย เช่น "12 ธ.ค. 2568 เวลา 14:30 น."
 */
function formatThaiDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date) + ' น.';
}

/**
 * 3. ฟังก์ชันสร้างป้ายสถานะ (Status Badge)
 * คืนค่าเป็น HTML String ของ Badge ตามสถานะงาน
 */
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-700 border border-amber-200">⏳ รอดำเนินการ</span>',
        'in_progress': '<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700 border border-blue-200">⚙️ กำลังดำเนินการ</span>',
        'review': '<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100/80 text-purple-700 border border-purple-200">🔍 รอตรวจสอบ</span>',
        'done': '<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100/80 text-green-700 border border-green-200">✅ เสร็จสมบูรณ์</span>',
        'cancelled': '<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100/80 text-red-700 border border-red-200">❌ ยกเลิก</span>'
    };
    return badges[status] || `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">${status}</span>`;
}

/**
 * 4. ฟังก์ชันสร้างป้ายความเร่งด่วน (Urgency Badge)
 */
function getUrgencyBadge(urgency) {
    const badges = {
        'low': '<span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">ปกติ</span>',
        'medium': '<span class="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">ด่วน</span>',
        'high': '<span class="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">ด่วนมาก</span>',
        'emergency': '<span class="text-xs font-medium text-white bg-red-600 px-2 py-0.5 rounded-md animate-pulse">🚨 ฉุกเฉิน</span>'
    };
    return badges[urgency] || '';
}

/**
 * 5. อัปเดต Icons ของ Lucide ใหม่ทั้งหมด (ใช้เมื่อมีการดึงข้อมูลมาแสดงใหม่)
 */
function refreshIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}