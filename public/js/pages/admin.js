// public/js/admin.js

// ตัวแปรเก็บข้อมูล State
let dashboardData = null;
let usersData = [];
let materialsData = { items: [], low_count: 0 };

// 1. เริ่มทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    // ตรวจสอบสิทธิ์ให้แน่ใจว่าเป็น admin จริงๆ
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // แสดงชื่อที่ Topbar
    const nameDisplay = document.getElementById('user-name-display');
    if (nameDisplay) nameDisplay.textContent = user.name.split(' ')[0];

    // โหลดหน้า Dashboard เป็นหน้าแรก
    switchTab('dashboard');
});

// ==========================================
// ระบบ Navigation (สลับหน้าจอ)
// ==========================================
function switchTab(tabName) {
    // ซ่อนทุกหน้า
    ['view-dashboard', 'view-users', 'view-materials'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // รีเซ็ตสไตล์ปุ่มเมนูทั้งหมดให้เป็นสีเทา
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white', 'shadow-md');
        btn.classList.add('bg-white/50', 'text-gray-600', 'hover:bg-white');
    });

    // แสดงหน้าและไฮไลท์ปุ่มที่ถูกเลือก
    const activeView = document.getElementById(`view-${tabName}`);
    const activeBtn = document.getElementById(`nav-${tabName}`);
    
    if (activeView) activeView.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.classList.remove('bg-white/50', 'text-gray-600', 'hover:bg-white');
        activeBtn.classList.add('bg-purple-600', 'text-white', 'shadow-md');
    }

    // โหลดข้อมูลตามหน้าที่เลือก
    if (tabName === 'dashboard') loadDashboard();
    else if (tabName === 'users') loadUsers();
    else if (tabName === 'materials') loadMaterials();
}

// ==========================================
// ส่วนที่ 1: Dashboard (ภาพรวมระบบทั้งหมด)
// ==========================================
async function loadDashboard() {
    try {
        const data = await api('GET', '/dashboard');
        dashboardData = data;
        renderDashboardStats();
    } catch (error) {
        toast('โหลดข้อมูลสถิติล้มเหลว', 'error');
    }
}

function renderDashboardStats() {
    const container = document.getElementById('admin-stats-container');
    if (!container || !dashboardData) return;

    const total = dashboardData.total || {};
    
    const stats = [
        { label: 'งานแจ้งซ่อมทั้งหมด', value: total.total || 0, icon: 'database', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'กำลังดำเนินการ', value: total.in_progress || 0, icon: 'activity', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'รอตรวจสอบ', value: total.review || 0, icon: 'search', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'เสร็จสิ้นแล้ว', value: total.done || 0, icon: 'check-circle', color: 'text-green-600', bg: 'bg-green-50' }
    ];

    container.innerHTML = stats.map(stat => `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/80 transition-all hover:-translate-y-1 hover:shadow-md flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-500 mb-1">${stat.label}</p>
                <h3 class="text-3xl font-bold text-gray-900">${stat.value}</h3>
            </div>
            <div class="w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center">
                <i data-lucide="${stat.icon}" class="w-7 h-7 ${stat.color}"></i>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 2: จัดการผู้ใช้งาน (Users)
// ==========================================
async function loadUsers() {
    const container = document.getElementById('users-list-container');
    if (!container) return;

    container.innerHTML = `<div class="text-center py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-gray-400"></i></div>`;
    refreshIcons();

    try {
        const response = await api('GET', '/users');
        usersData = response.users || [];
        renderUsers();
    } catch (error) {
        container.innerHTML = `<div class="text-center text-red-500 py-10">❌ เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน</div>`;
    }
}

function renderUsers() {
    const container = document.getElementById('users-list-container');
    
    // ฟังก์ชันช่วยแปลง Role เป็นป้ายสี
    const getRoleBadge = (role) => {
        const roles = {
            'admin': '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">👑 ผู้ดูแลระบบ</span>',
            'manager': '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">👔 หัวหน้าช่าง</span>',
            'technician': '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700">🔧 ช่างซ่อม</span>',
            'user': '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">👤 ผู้ใช้ทั่วไป</span>'
        };
        return roles[role] || `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">${role}</span>`;
    };

    container.innerHTML = usersData.map(u => `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/80">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0 border border-white">
                    ${u.name.charAt(0)}
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                        ${u.name}
                        ${u.is_active === 0 ? '<span class="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">ถูกระงับ</span>' : ''}
                    </h4>
                    <p class="text-xs text-gray-500 mt-0.5">${u.email} | รหัส: ${u.student_id || '-'}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                ${getRoleBadge(u.role)}
                <div class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">${u.department || 'ไม่ระบุแผนก'}</div>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 3: จัดการวัสดุอุปกรณ์ (Materials)
// ==========================================
async function loadMaterials() {
    const container = document.getElementById('materials-list-container');
    if (!container) return;

    container.innerHTML = `<div class="text-center py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto text-gray-400"></i></div>`;
    refreshIcons();

    try {
        const response = await api('GET', '/materials');
        materialsData = response;
        renderMaterials();
    } catch (error) {
        container.innerHTML = `<div class="text-center text-red-500 py-10">❌ เกิดข้อผิดพลาดในการโหลดข้อมูลวัสดุอุปกรณ์</div>`;
    }
}

function renderMaterials() {
    const container = document.getElementById('materials-list-container');
    
    // อัปเดตตัวเลขแจ้งเตือนของใกล้หมด
    const alertBadge = document.getElementById('low-stock-alert');
    if (alertBadge) {
        if (materialsData.low_count > 0) {
            alertBadge.textContent = `⚠️ มีของใกล้หมด ${materialsData.low_count} รายการ!`;
            alertBadge.classList.remove('hidden');
        } else {
            alertBadge.classList.add('hidden');
        }
    }

    if (!materialsData.items || materialsData.items.length === 0) {
        container.innerHTML = `<div class="text-center py-10 text-gray-500">ไม่มีข้อมูลวัสดุอุปกรณ์ในระบบ</div>`;
        return;
    }

    container.innerHTML = materialsData.items.map(m => {
        // เช็คสถานะจำนวนของ
        let stockStatus = '';
        let stockColor = 'text-green-600 bg-green-50';
        
        if (m.quantity <= 0) {
            stockStatus = 'หมด!';
            stockColor = 'text-red-600 bg-red-50 border border-red-200 animate-pulse';
        } else if (m.quantity <= (m.min_quantity || 5)) {
            stockStatus = 'ใกล้หมด';
            stockColor = 'text-amber-600 bg-amber-50 border border-amber-200';
        } else {
            stockStatus = 'ปกติ';
            stockColor = 'text-gray-600 bg-gray-50';
        }

        return `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/80 flex items-center justify-between transition-all hover:bg-white/80">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                    <i data-lucide="package" class="w-5 h-5"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-gray-900">${m.name}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">รหัส: ${m.code || '-'} | หมวดหมู่: ${m.category || '-'}</p>
                </div>
            </div>
            <div class="flex flex-col items-end gap-1">
                <div class="flex items-baseline gap-1">
                    <span class="text-lg font-bold text-gray-900">${m.quantity}</span>
                    <span class="text-xs text-gray-500">${m.unit || 'ชิ้น'}</span>
                </div>
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-md ${stockColor}">${stockStatus}</span>
            </div>
        </div>
        `;
    }).join('');

    refreshIcons();
}