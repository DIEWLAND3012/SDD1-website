// public/js/user.js

// ตัวแปรเก็บข้อมูล State ของหน้าเพจ
let myRequests = [];
let locationData = { locations: [], buildings: [] };
let selectedFileBase64 = null;

// 1. เริ่มทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    // ตรวจสอบสิทธิ์ให้แน่ใจว่าเป็น user จริงๆ
    const user = getCurrentUser();
    if (!user || user.role !== 'user') {
        window.location.href = 'index.html'; // ถ้าไม่ใช่ให้เตะกลับหน้า Login
        return;
    }

    // แสดงชื่อผู้ใช้ที่ Topbar (อ้างอิง ID ที่จะสร้างใน user.html)
    const nameDisplay = document.getElementById('user-name-display');
    if (nameDisplay) nameDisplay.textContent = user.name.split(' ')[0];

    // โหลดข้อมูลที่จำเป็น
    await loadLocations();
    await loadMyRequests();
});

// ==========================================
// ส่วนที่ 1: การดึงและแสดงรายการแจ้งซ่อม
// ==========================================

async function loadMyRequests() {
    const listContainer = document.getElementById('request-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = `<div class="text-center text-gray-400 py-10"><i data-lucide="loader-2" class="w-8 h-8 animate-spin mx-auto mb-2"></i>กำลังโหลดข้อมูล...</div>`;
    refreshIcons();

    try {
        // ดึงข้อมูลรายการแจ้งซ่อมของตัวเอง (Backend จะใช้ Token ในการกรองข้อมูล)
        const response = await api('GET', '/requests');
        myRequests = response.requests || [];
        renderRequestList();
    } catch (error) {
        listContainer.innerHTML = `<div class="text-center text-red-500 py-10">❌ เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
        toast('โหลดข้อมูลล้มเหลว: ' + error.message, 'error');
    }
}

function renderRequestList() {
    const listContainer = document.getElementById('request-list-container');
    
    if (myRequests.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="inbox" class="w-8 h-8 text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">ยังไม่มีรายการแจ้งซ่อม</h3>
                <p class="text-gray-500 text-sm mt-1">กดปุ่ม "แจ้งซ่อมใหม่" เพื่อเริ่มต้นใช้งาน</p>
            </div>`;
        refreshIcons();
        return;
    }

    // สร้าง Card สำหรับแต่ละรายการ (สไตล์ Glassmorphism ไม่มีเส้นขอบแข็งๆ)
    listContainer.innerHTML = myRequests.map(req => {
        // หาชื่อสถานที่
        const loc = locationData.locations.find(l => l.id == req.location_id);
        const locName = loc ? `${loc.building_name} ${loc.room_number}` : 'ไม่ระบุสถานที่';
        
        // เช็คว่าต้องประเมินไหม (สถานะ done และยังไม่มีคะแนน)
        const needsEval = (req.status === 'done' && !req.evaluation_id);

        return `
        <div class="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/80 transition-all hover:-translate-y-1 hover:shadow-md flex flex-col gap-3">
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">REQ-${req.id.toString().padStart(4, '0')}</span>
                    <h3 class="text-lg font-bold text-gray-900 mt-2">${req.category}</h3>
                </div>
                <div class="flex flex-col items-end gap-2">
                    ${getStatusBadge(req.status)}
                    ${getUrgencyBadge(req.urgency)}
                </div>
            </div>
            
            <p class="text-sm text-gray-600 line-clamp-2">${req.description}</p>
            
            <div class="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <div class="flex items-center gap-1"><i data-lucide="map-pin" class="w-4 h-4"></i> ${locName}</div>
                <div class="flex items-center gap-1"><i data-lucide="clock" class="w-4 h-4"></i> ${formatThaiDate(req.created_at)}</div>
            </div>

            ${needsEval ? `
            <div class="mt-3 pt-3 border-t border-gray-200/50">
                <button onclick="openEvalModal(${req.id})" class="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-2">
                    <i data-lucide="star" class="w-4 h-4 fill-current"></i> ประเมินความพึงพอใจ
                </button>
            </div>` : ''}
        </div>
        `;
    }).join('');

    refreshIcons();
}

// ==========================================
// ส่วนที่ 2: การสร้างรายการแจ้งซ่อมใหม่
// ==========================================

async function loadLocations() {
    try {
        const data = await api('GET', '/locations');
        locationData = data;
        populateLocationDropdown();
    } catch (error) {
        console.error('Failed to load locations', error);
    }
}

function populateLocationDropdown() {
    const select = document.getElementById('req-location');
    if (!select || locationData.locations.length === 0) return;

    select.innerHTML = '<option value="">-- เลือกอาคาร / ห้อง --</option>' + 
        locationData.locations.map(loc => 
            `<option value="${loc.id}">${loc.building_name} - ห้อง ${loc.room_number}</option>`
        ).join('');
}

// สลับหน้าจอระหว่าง "รายการแจ้งซ่อม" กับ "ฟอร์มแจ้งซ่อมใหม่"
function toggleView(viewName) {
    const listSection = document.getElementById('view-list');
    const formSection = document.getElementById('view-form');
    
    if (viewName === 'form') {
        listSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        document.getElementById('form-new-request').reset();
        selectedFileBase64 = null;
    } else {
        formSection.classList.add('hidden');
        listSection.classList.remove('hidden');
    }
}

// จัดการอัปโหลดรูปภาพ (แปลงเป็น Base64 แบบง่าย)
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        selectedFileBase64 = e.target.result;
        toast('แนบรูปภาพสำเร็จ', 'info');
    };
    reader.readAsDataURL(file);
}

// ส่งฟอร์มแจ้งซ่อมใหม่
async function submitNewRequest(event) {
    event.preventDefault();
    
        // ดึงค่าหมวดหมู่และความเร่งด่วนจาก Radio Button ที่ถูกเลือก
    const category = document.querySelector('input[name="req-category"]:checked').value;
    const urgency = document.querySelector('input[name="req-urgency"]:checked').value;

    // วิธีดึงไฟล์รูปภาพเพื่อเตรียมส่งไป Backend
    const imageFile = document.getElementById('req-image').files[0];

    // -- ตัวอย่างการจัดการข้อมูล --
    // ถ้า Backend ของคุณรองรับ FormData (แนะนำสำหรับการอัปโหลดรูป)
    const formData = new FormData();
    formData.append('category', category);
    formData.append('location', document.getElementById('req-location').value);
    formData.append('description', document.getElementById('req-description').value);
    formData.append('urgency', urgency);
    if (imageFile) {
        formData.append('image', imageFile); 
    }

    // แล้วใช้ fetch แบบไม่เซ็ต 'Content-Type': 'application/json' 
    // เพื่อให้เบราว์เซอร์จัดการ Boundary ของ FormData อัตโนมัติ
}

// ==========================================
// ส่วนที่ 3: ระบบประเมิน (Evaluation)
// ==========================================
let currentEvalReqId = null;

function openEvalModal(reqId) {
    currentEvalReqId = reqId;
    const modal = document.getElementById('eval-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Reset stars
        ['quality', 'speed', 'service'].forEach(k => setStars(k, 0));
        document.getElementById('eval-comment').value = '';
    }
}

function closeEvalModal() {
    currentEvalReqId = null;
    const modal = document.getElementById('eval-modal');
    if (modal) modal.classList.add('hidden');
}

function setStars(category, value) {
    document.getElementById(`score-${category}`).value = value;
    const stars = document.querySelectorAll(`#stars-${category} button`);
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('text-yellow-400', 'fill-yellow-400');
            star.classList.remove('text-gray-300');
        } else {
            star.classList.remove('text-yellow-400', 'fill-yellow-400');
            star.classList.add('text-gray-300');
        }
    });
}

async function submitEvaluation() {
    const payload = {
        request_id: currentEvalReqId,
        quality_score: parseInt(document.getElementById('score-quality').value) || 0,
        speed_score: parseInt(document.getElementById('score-speed').value) || 0,
        service_score: parseInt(document.getElementById('score-service').value) || 0,
        comment: document.getElementById('eval-comment').value
    };

    if (!payload.quality_score || !payload.speed_score || !payload.service_score) {
        toast('กรุณาให้คะแนนให้ครบทุกหัวข้อ', 'warning');
        return;
    }

    try {
        await api('POST', '/evaluations', payload);
        toast('ขอบคุณสำหรับการประเมินครับ!', 'success');
        closeEvalModal();
        await loadMyRequests(); // รีเฟรชรายการเพื่อเอาปุ่มประเมินออก
    } catch (error) {
        toast('ส่งผลประเมินล้มเหลว: ' + error.message, 'error');
    }
}

// ดึงค่าหมวดหมู่และความเร่งด่วนจาก Radio Button ที่ถูกเลือก
const category = document.querySelector('input[name="req-category"]:checked').value;
const urgency = document.querySelector('input[name="req-urgency"]:checked').value;

// วิธีดึงไฟล์รูปภาพเพื่อเตรียมส่งไป Backend
const imageFile = document.getElementById('req-image').files[0];

// -- ตัวอย่างการจัดการข้อมูล --
// ถ้า Backend ของคุณรองรับ FormData (แนะนำสำหรับการอัปโหลดรูป)
const formData = new FormData();
formData.append('category', category);
formData.append('location', document.getElementById('req-location').value);
formData.append('description', document.getElementById('req-description').value);
formData.append('urgency', urgency);
if (imageFile) {
    formData.append('image', imageFile); 
}

// แล้วใช้ fetch แบบไม่เซ็ต 'Content-Type': 'application/json' 
// เพื่อให้เบราว์เซอร์จัดการ Boundary ของ FormData อัตโนมัติ