/* =========================================
   REQUESTS MANAGEMENT MODULE
   Minimal UI & SVG Icons (Ticketing)
========================================= */

let requestsData = [];

function pageRequestsList() {
  const content = document.getElementById('page-content');
  const userRole = window.APP?.user?.role || 'user';
  
  content.innerHTML = `
    <div class="fade-in space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            ระบบแจ้งซ่อมบำรุง
          </h2>
          <p class="text-slate-500 text-sm mt-1">จัดการและติดตามสถานะรายการแจ้งซ่อมทั้งหมด</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" id="search-request" placeholder="ค้นหาเลขที่, อาการ..." class="input-glass pl-9 py-2 w-64" onkeyup="filterRequests()">
          </div>
          
          <button onclick="openRequestModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            แจ้งซ่อมใหม่
          </button>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
        <div class="overflow-x-auto" id="requests-table-container">
          <div class="p-8 flex flex-col items-center justify-center text-slate-400">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดข้อมูลรายการแจ้งซ่อม...</p>
          </div>
        </div>
      </div>
    </div>

    <div id="request-modal" class="fixed inset-0 z-50 hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
      <div class="glass-pane w-full max-w-2xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform scale-95 transition-transform duration-300 max-h-[90vh] flex flex-col" id="request-modal-panel">
        
        <div class="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white/40 shrink-0">
          <h3 id="req-modal-title" class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            แบบฟอร์มแจ้งซ่อม
          </h3>
          <button onclick="closeRequestModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-5 flex-grow">
          <input type="hidden" id="req-id">
          
          <div class="space-y-4" id="req-user-form">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">หัวข้อปัญหา / อาการเบื้องต้น <span class="text-rose-500">*</span></label>
              <input type="text" id="req-title" class="input-glass" placeholder="เช่น แอร์น้ำหยด, คอมพิวเตอร์เปิดไม่ติด">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">รายละเอียดเพิ่มเติม</label>
              <textarea id="req-desc" class="input-glass min-h-[100px] resize-y" placeholder="อธิบายอาการหรือปัญหาที่พบอย่างละเอียด..."></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">สถานที่ / อาคาร / ห้อง <span class="text-rose-500">*</span></label>
                <input type="text" id="req-location" class="input-glass" placeholder="ระบุจุดที่เกิดปัญหา">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ระดับความเร่งด่วน</label>
                <select id="req-urgency" class="input-glass">
                  <option value="low">ต่ำ (รอได้)</option>
                  <option value="medium" selected>ปานกลาง</option>
                  <option value="high">สูง (ด่วน)</option>
                </select>
              </div>
            </div>
          </div>

          <div id="req-admin-form" class="hidden mt-6 pt-5 border-t border-slate-200/60">
            <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ส่วนสำหรับเจ้าหน้าที่
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">อัปเดตสถานะ</label>
                <select id="req-status" class="input-glass bg-indigo-50/50">
                  <option value="pending">รอดำเนินการ</option>
                  <option value="progress">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">หมายเหตุ / การแก้ปัญหา</label>
                <input type="text" id="req-remark" class="input-glass" placeholder="บันทึกการทำงานของช่าง...">
              </div>
            </div>
          </div>

        </div>

        <div class="p-4 border-t border-slate-200/60 bg-slate-50/50 flex justify-end gap-3 shrink-0">
          <button onclick="closeRequestModal()" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors">ปิดหน้าต่าง</button>
          <button onclick="saveRequest()" id="req-save-btn" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  `;

  fetchRequests();
}

async function fetchRequests() {
  try {
    // กำหนด Endpoint ตาม Role (ถ้าเป็น User ทั่วไปดูแค่ของตัวเอง)
    const role = window.APP?.user?.role;
    const endpoint = (role === 'admin' || role === 'manager' || role === 'technician') 
      ? '/requests' 
      : '/requests/me';

    const data = await apiFetch(endpoint);
    requestsData = Array.isArray(data) ? data : (data.requests || []);
    renderRequestsTable(requestsData);
  } catch (error) {
    document.getElementById('requests-table-container').innerHTML = `
      <div class="p-6 text-center text-rose-600 flex flex-col items-center">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูลได้: ${error.message}</p>
      </div>`;
  }
}

function renderRequestsTable(items) {
  const container = document.getElementById('requests-table-container');
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <p class="font-medium">ยังไม่มีรายการแจ้งซ่อมในระบบ</p>
      </div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-200/80 bg-slate-50/50 text-sm text-slate-600">
          <th class="p-4 font-semibold">รหัสงาน</th>
          <th class="p-4 font-semibold">วันที่แจ้ง</th>
          <th class="p-4 font-semibold">หัวข้อ/อาการ</th>
          <th class="p-4 font-semibold">สถานที่</th>
          <th class="p-4 font-semibold text-center">สถานะ</th>
          <th class="p-4 font-semibold text-right">จัดการ</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
  `;

  items.forEach(req => {
    const dateStr = req.created_at ? new Date(req.created_at).toLocaleDateString('th-TH') : '-';
    
    html += `
      <tr class="hover:bg-white/60 transition-colors">
        <td class="p-4 text-sm font-semibold text-indigo-600">#${req.id || '-'}</td>
        <td class="p-4 text-sm text-slate-500">${dateStr}</td>
        <td class="p-4 text-sm text-slate-800 font-medium truncate max-w-xs" title="${req.title || ''}">${req.title || req.problem_desc || 'ไม่ระบุ'}</td>
        <td class="p-4 text-sm text-slate-500">${req.location || '-'}</td>
        <td class="p-4 text-center">${getStatusBadge(req.status || 'pending')}</td>
        <td class="p-4 text-right">
          <button onclick="openRequestModal(${req.id})" class="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            ดูรายละเอียด
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function filterRequests() {
  const query = document.getElementById('search-request').value.toLowerCase();
  const filtered = requestsData.filter(r => 
    (r.title || '').toLowerCase().includes(query) || 
    (r.id || '').toString().includes(query) ||
    (r.location || '').toLowerCase().includes(query)
  );
  renderRequestsTable(filtered);
}

// ==========================================
// MODAL & FORM LOGIC
// ==========================================

function openRequestModal(id = null) {
  const modal = document.getElementById('request-modal');
  const panel = document.getElementById('request-modal-panel');
  const role = window.APP?.user?.role || 'user';
  const isAdminOrTech = ['admin', 'manager', 'technician'].includes(role);

  // เคลียร์ฟอร์ม
  document.getElementById('req-id').value = '';
  document.getElementById('req-title').value = '';
  document.getElementById('req-desc').value = '';
  document.getElementById('req-location').value = '';
  document.getElementById('req-urgency').value = 'medium';
  
  // ปลดล็อคฟอร์ม
  document.getElementById('req-title').disabled = false;
  document.getElementById('req-desc').disabled = false;
  document.getElementById('req-location').disabled = false;
  document.getElementById('req-urgency').disabled = false;

  const adminForm = document.getElementById('req-admin-form');
  adminForm.classList.add('hidden');

  if (id) {
    // กรณีแก้ไข / ดูรายละเอียด
    document.getElementById('req-modal-title').innerHTML = `
      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      รายละเอียดการแจ้งซ่อม #${id}`;
      
    const req = requestsData.find(r => r.id == id);
    if (req) {
      document.getElementById('req-id').value = req.id;
      document.getElementById('req-title').value = req.title || req.problem_desc || '';
      document.getElementById('req-desc').value = req.description || '';
      document.getElementById('req-location').value = req.location || '';
      document.getElementById('req-urgency').value = req.urgency || 'medium';

      // ถ้าช่าง/แอดมินเข้ามาดู ให้แสดงส่วนอัปเดตสถานะและล็อคฟอร์มแจ้ง
      if (isAdminOrTech) {
        adminForm.classList.remove('hidden');
        document.getElementById('req-status').value = req.status || 'pending';
        document.getElementById('req-remark').value = req.remark || '';
        
        document.getElementById('req-title').disabled = true;
        document.getElementById('req-desc').disabled = true;
        document.getElementById('req-location').disabled = true;
        document.getElementById('req-urgency').disabled = true;
      }
    }
  } else {
    // กรณีสร้างใหม่
    document.getElementById('req-modal-title').innerHTML = `
      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      แจ้งซ่อมบำรุงใหม่`;
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    panel.classList.remove('scale-95');
  }, 10);
}

function closeRequestModal() {
  const modal = document.getElementById('request-modal');
  const panel = document.getElementById('request-modal-panel');
  
  modal.classList.add('opacity-0');
  panel.classList.add('scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

async function saveRequest() {
  const id = document.getElementById('req-id').value;
  const role = window.APP?.user?.role || 'user';
  const isAdminOrTech = ['admin', 'manager', 'technician'].includes(role);
  const btn = document.getElementById('req-save-btn');
  const originalBtnText = btn.innerHTML;

  try {
    btn.disabled = true;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> กำลังบันทึก...`;

    if (id && isAdminOrTech) {
      // แอดมิน/ช่าง อัปเดตสถานะ (PUT)
      const payload = {
        status: document.getElementById('req-status').value,
        remark: document.getElementById('req-remark').value.trim()
      };
      await apiFetch(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) });
      
    } else if (!id) {
      // ผู้ใช้แจ้งซ่อมใหม่ (POST)
      const title = document.getElementById('req-title').value.trim();
      const location = document.getElementById('req-location').value.trim();
      
      if (!title || !location) {
        alert('กรุณากรอกหัวข้อปัญหาและสถานที่ให้ครบถ้วน');
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
        return;
      }

      const payload = {
        title: title,
        description: document.getElementById('req-desc').value.trim(),
        location: location,
        urgency: document.getElementById('req-urgency').value
      };
      await apiFetch('/requests', { method: 'POST', body: JSON.stringify(payload) });
    }

    closeRequestModal();
    fetchRequests(); // โหลดข้อมูลใหม่เพื่ออัปเดตตาราง

  } catch (error) {
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
  }
}