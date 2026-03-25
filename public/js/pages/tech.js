// public/js/tech.js

// ตัวแปรเก็บข้อมูล State
let myJobs = [];
let locationData = { locations: [], buildings: [] };

// 1. เริ่มทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    // ตรวจสอบสิทธิ์ให้แน่ใจว่าเป็น technician จริงๆ
    const user = getCurrentUser();
    if (!user || user.role !== 'technician') {
        window.location.href = 'index.html';
        return;
    }

    // แสดงชื่อช่างที่ Topbar
    const nameDisplay = document.getElementById('user-name-display');
    if (nameDisplay) nameDisplay.textContent = user.name.split(' ')[0];

    // โหลดข้อมูล
    await loadLocations();
    await loadMyJobs();
});

// ==========================================
// ส่วนที่ 1: การดึงและแสดงรายการงานที่ได้รับมอบหมาย
// ==========================================

async function loadLocations() {
    try {
        const data = await api('GET', '/locations');
        locationData = data;
    } catch (error) {
        console.error('Failed to load locations', error);
    }
}

async function loadMyJobs() {
    const listContainer = document.getElementById('job-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="text-center text-gray-400 py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-2"></i>กำลังโหลดงานของคุณ...</div>`;
    refreshIcons();

    try {
        // ดึงข้อมูลรายการแจ้งซ่อม (Backend จะกรองเฉพาะงานที่ assign ให้ช่างคนนี้มาให้จาก Token)
        const response = await api('GET', '/requests');
        myJobs = response.requests || [];
        
        // เรียงลำดับงาน: งานที่ยังไม่เสร็จขึ้นก่อน และเรียงตามความเร่งด่วน
        myJobs.sort((a, b) => {
            if (a.status === 'done' && b.status !== 'done') return 1;
            if (a.status !== 'done' && b.status === 'done') return -1;
            return new Date(b.created_at) - new Date(a.created_at);
        });

        renderJobList();
    } catch (error) {
        listContainer.innerHTML = `<div class="text-center text-red-500 py-10">❌ เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
        toast('โหลดข้อมูลล้มเหลว: ' + error.message, 'error');
    }
}

function renderJobList() {
    const listContainer = document.getElementById('job-list-container');
    
    // กรองงานที่ยังไม่เสร็จสมบูรณ์เพื่อใช้นับจำนวน
    const activeJobs = myJobs.filter(job => job.status !== 'done' && job.status !== 'cancelled');
    const activeCountDisplay = document.getElementById('active-job-count');
    if (activeCountDisplay) activeCountDisplay.textContent = activeJobs.length;

    if (myJobs.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="coffee" class="w-8 h-8 text-blue-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">ไม่มีงานค้าง</h3>
                <p class="text-gray-500 text-sm mt-1">คุณสามารถพักผ่อนได้เลยในตอนนี้</p>
            </div>`;
        refreshIcons();
        return;
    }

    listContainer.innerHTML = myJobs.map(job => {
        const loc = locationData.locations.find(l => l.id == job.location_id);
        const locName = loc ? `${loc.building_name} ${loc.room_number}` : 'ไม่ระบุสถานที่';
        
        // สร้างปุ่ม Action ตามสถานะงานปัจจุบัน
        let actionButtons = '';
        if (job.status === 'pending' || job.status === 'assigned') {
            actionButtons = `
                <button onclick="updateJobStatus(${job.id}, 'in_progress')" class="flex-1 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-sm hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                    <i data-lucide="play-circle" class="w-4 h-4"></i> เริ่มดำเนินการ
                </button>`;
        } else if (job.status === 'in_progress') {
            actionButtons = `
                <button onclick="updateJobStatus(${job.id}, 'review')" class="flex-1 py-2 bg-purple-600 text-white rounded-xl font-medium text-sm shadow-sm hover:bg-purple-700 transition-all flex justify-center items-center gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> ส่งงาน (รอตรวจสอบ)
                </button>`;
        } else if (job.status === 'review') {
             actionButtons = `
                <div class="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl font-medium text-sm text-center border border-gray-200 cursor-not-allowed flex justify-center items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4"></i> รอหัวหน้าตรวจสอบ
                </div>`;
        }

        return `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/80 transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3 ${job.status === 'done' ? 'opacity-70' : ''}">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">REQ-${job.id.toString().padStart(4, '0')}</span>
                    <h3 class="text-lg font-bold text-gray-900 mt-2">${job.category}</h3>
                </div>
                <div class="flex flex-col items-end gap-2">
                    ${getStatusBadge(job.status)}
                    ${getUrgencyBadge(job.urgency)}
                </div>
            </div>
            
            <p class="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">${job.description}</p>
            
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 mt-2">
                <div class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i> ${locName}</div>
                <div class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i> แจ้งเมื่อ: ${formatThaiDate(job.created_at)}</div>
            </div>

            ${actionButtons ? `
            <div class="mt-3 pt-3 border-t border-gray-200/50 flex gap-2">
                ${actionButtons}
            </div>` : ''}
        </div>
        `;
    }).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 2: การอัปเดตสถานะงาน (Action)
// ==========================================

async function updateJobStatus(jobId, newStatus) {
    if (!confirm(`ยืนยันการเปลี่ยนสถานะงานนี้ใช่หรือไม่?`)) return;

    try {
        // สมมติว่า Backend ใช้ Method PATCH ไปที่ /api/requests/:id
        await api('PATCH', `/requests/${jobId}`, { status: newStatus });
        
        toast('อัปเดตสถานะงานสำเร็จ', 'success');
        
        // รีโหลดข้อมูลใหม่เพื่ออัปเดตหน้าจอ
        await loadMyJobs();
    } catch (error) {
        toast('อัปเดตสถานะไม่สำเร็จ: ' + error.message, 'error');
    }
}