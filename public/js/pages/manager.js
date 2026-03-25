// public/js/manager.js

// ตัวแปรเก็บข้อมูล State
let dashboardData = null;
let pendingRequests = [];
let technicians = [];
let currentAssignReqId = null;

// 1. เริ่มทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    // ตรวจสอบสิทธิ์ให้แน่ใจว่าเป็น manager จริงๆ
    const user = getCurrentUser();
    if (!user || user.role !== 'manager') {
        window.location.href = 'index.html';
        return;
    }

    // แสดงชื่อที่ Topbar
    const nameDisplay = document.getElementById('user-name-display');
    if (nameDisplay) nameDisplay.textContent = user.name.split(' ')[0];

    // โหลดข้อมูลที่จำเป็นทั้งหมดพร้อมกัน
    await Promise.all([
        loadDashboard(),
        loadRequests(),
        loadTechnicians()
    ]);
});

// ==========================================
// ส่วนที่ 1: Dashboard (ภาพรวมระบบ)
// ==========================================

async function loadDashboard() {
    try {
        const data = await api('GET', '/dashboard');
        dashboardData = data;
        renderDashboardStats();
    } catch (error) {
        console.error('Failed to load dashboard', error);
        toast('โหลดข้อมูลสถิติล้มเหลว', 'error');
    }
}

function renderDashboardStats() {
    const container = document.getElementById('dashboard-stats-container');
    if (!container || !dashboardData) return;

    const total = dashboardData.total || {};
    
    // ข้อมูลการ์ดสถิติ พร้อมการกำหนดสีและไอคอน
    const stats = [
        { label: 'งานทั้งหมด', value: total.total || 0, icon: 'clipboard-list', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'รอดำเนินการ', value: total.pending || 0, icon: 'clock', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'กำลังซ่อม', value: total.in_progress || 0, icon: 'settings', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'รอตรวจสอบ', value: total.review || 0, icon: 'search', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'เสร็จสมบูรณ์', value: total.done || 0, icon: 'check-circle', color: 'text-green-600', bg: 'bg-green-50' }
    ];

    container.innerHTML = stats.map(stat => `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-4 md:p-5 shadow-sm border border-white/80 transition-all hover:-translate-y-1 hover:shadow-md flex items-center gap-4">
            <div class="w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0">
                <i data-lucide="${stat.icon}" class="w-6 h-6 ${stat.color}"></i>
            </div>
            <div>
                <p class="text-xs md:text-sm font-medium text-gray-500">${stat.label}</p>
                <h3 class="text-2xl font-bold text-gray-900 leading-tight">${stat.value}</h3>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 2: รายการแจ้งซ่อม (สำหรับจ่ายงาน)
// ==========================================

async function loadRequests() {
    const listContainer = document.getElementById('request-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="text-center text-gray-400 py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-2"></i>กำลังโหลดข้อมูลรายการ...</div>`;
    refreshIcons();

    try {
        const response = await api('GET', '/requests');
        // กรองเอาเฉพาะงานที่ยังไม่เสร็จ (Manager ควรเห็นงานที่ต้องจัดการ)
        pendingRequests = (response.requests || []).filter(req => req.status !== 'done' && req.status !== 'cancelled');
        
        // เรียงลำดับงาน: pending (รอจ่ายงาน) ขึ้นก่อน ตามด้วย review (รอตรวจ) และเรียงตามเวลา
        pendingRequests.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.created_at) - new Date(a.created_at);
        });

        renderRequestList();
    } catch (error) {
        listContainer.innerHTML = `<div class="text-center text-red-500 py-10">❌ เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
        toast('โหลดข้อมูลรายการล้มเหลว', 'error');
    }
}

function renderRequestList() {
    const listContainer = document.getElementById('request-list-container');
    
    if (pendingRequests.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
                <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="check-check" class="w-8 h-8 text-green-500"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">เยี่ยมมาก! ไม่มีงานค้าง</h3>
                <p class="text-gray-500 text-sm mt-1">ทุกรายการถูกจัดการเรียบร้อยแล้ว</p>
            </div>`;
        refreshIcons();
        return;
    }

    listContainer.innerHTML = pendingRequests.map(req => {
        let actionArea = '';

        // ถ้างาน "รอดำเนินการ" -> ปุ่มสำหรับมอบหมายงาน (Assign)
        if (req.status === 'pending') {
            actionArea = `
                <button onclick="openAssignModal(${req.id})" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                    <i data-lucide="user-plus" class="w-4 h-4"></i> มอบหมายงาน
                </button>`;
        } 
        // ถ้างาน "รอตรวจสอบ" -> ปุ่มสำหรับอนุมัติงานจบ (Approve)
        else if (req.status === 'review') {
            actionArea = `
                <button onclick="approveJob(${req.id})" class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4"></i> ตรวจสอบผ่าน
                </button>`;
        }
        // สถานะอื่นๆ (เช่น in_progress) โชว์ว่าใครกำลังทำ
        else {
            const techName = req.technician_name || 'ช่าง';
            actionArea = `<span class="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg"><i data-lucide="tool" class="w-3 h-3"></i> ${techName} กำลังดำเนินการ</span>`;
        }

        return `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/80 transition-all hover:bg-white/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-xs font-bold text-gray-700 bg-gray-200/50 px-2.5 py-1 rounded-md">REQ-${req.id.toString().padStart(4, '0')}</span>
                    ${getStatusBadge(req.status)}
                    ${getUrgencyBadge(req.urgency)}
                </div>
                <h3 class="text-lg font-bold text-gray-900">${req.category}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-1">${req.description}</p>
                <div class="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <div class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formatThaiDate(req.created_at)}</div>
                    <div class="flex items-center gap-1"><i data-lucide="user" class="w-3.5 h-3.5"></i> ผู้แจ้ง: ${req.user_name || 'ไม่ระบุ'}</div>
                </div>
            </div>
            
            <div class="flex shrink-0">
                ${actionArea}
            </div>
        </div>
        `;
    }).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 3: ระบบจัดการมอบหมายงาน (Assign)
// ==========================================

async function loadTechnicians() {
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมดและกรองเฉพาะ role = technician
        const response = await api('GET', '/users');
        technicians = (response.users || []).filter(u => u.role === 'technician' && u.is_active === 1);
        populateTechnicianDropdown();
    } catch (error) {
        console.error('Failed to load technicians', error);
    }
}

function populateTechnicianDropdown() {
    const select = document.getElementById('assign-tech-select');
    if (!select) return;

    if (technicians.length === 0) {
        select.innerHTML = '<option value="">-- ไม่พบข้อมูลช่างในระบบ --</option>';
        return;
    }

    select.innerHTML = '<option value="">-- เลือกช่างผู้รับผิดชอบ --</option>' + 
        technicians.map(tech => 
            // สามารถเพิ่มข้อมูลงานที่รับผิดชอบอยู่ (Active Jobs) หรือแผนก (Department) ได้ถ้า API มีให้
            `<option value="${tech.id}">${tech.name} ${tech.department ? `(${tech.department})` : ''}</option>`
        ).join('');
}

function openAssignModal(reqId) {
    currentAssignReqId = reqId;
    const modal = document.getElementById('assign-modal');
    if (modal) {
        document.getElementById('assign-tech-select').value = ''; // Reset ค่า
        modal.classList.remove('hidden');
    }
}

function closeAssignModal() {
    currentAssignReqId = null;
    const modal = document.getElementById('assign-modal');
    if (modal) modal.classList.add('hidden');
}

async function submitAssignment() {
    const techId = document.getElementById('assign-tech-select').value;
    
    if (!techId) {
        toast('กรุณาเลือกช่างก่อนกดยืนยัน', 'warning');
        return;
    }

    try {
        // ส่ง Request ไปให้ Backend อัปเดตช่างที่รับผิดชอบและเปลี่ยนสถานะเป็น 'in_progress' หรือ 'assigned'
        await api('PATCH', `/requests/${currentAssignReqId}`, { 
            technician_id: techId,
            status: 'in_progress' // เปลี่ยนเป็นกำลังดำเนินการเมื่อจ่ายงานเสร็จ
        });
        
        toast('มอบหมายงานสำเร็จ!', 'success');
        closeAssignModal();
        
        // โหลดข้อมูลใหม่เพื่ออัปเดตหน้าจอ
        await Promise.all([loadDashboard(), loadRequests()]);
    } catch (error) {
        toast('เกิดข้อผิดพลาดในการมอบหมายงาน: ' + error.message, 'error');
    }
}

// ==========================================
// ส่วนที่ 4: ตรวจสอบและปิดงาน (Approve)
// ==========================================

async function approveJob(reqId) {
    if (!confirm('ยืนยันว่างานนี้เสร็จสมบูรณ์และผ่านการตรวจสอบแล้วใช่หรือไม่?')) return;

    try {
        await api('PATCH', `/requests/${reqId}`, { status: 'done' });
        toast('ปิดงานสำเร็จ!', 'success');
        
        // โหลดข้อมูลใหม่เพื่ออัปเดตหน้าจอ
        await Promise.all([loadDashboard(), loadRequests()]);
    } catch (error) {
        toast('ปิดงานไม่สำเร็จ: ' + error.message, 'error');
    }
}