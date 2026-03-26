/* =========================================
   MATERIALS MANAGEMENT MODULE
   Minimal UI & SVG Icons
========================================= */

// เก็บข้อมูลวัสดุไว้ในหน่วยความจำชั่วคราวเพื่อใช้ค้นหาและแก้ไข
let materialsData = [];

function pageMaterials() {
  const content = document.getElementById('page-content');
  
  content.innerHTML = `
    <div class="fade-in space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            คลังวัสดุอุปกรณ์
          </h2>
          <p class="text-slate-500 text-sm mt-1">จัดการรายการอะไหล่และตรวจสอบจำนวนคงเหลือ</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" id="search-material" placeholder="ค้นหาชื่อวัสดุ..." class="input-glass pl-9 py-2 w-full md:w-64" onkeyup="filterMaterials()">
          </div>
          
          <button onclick="openMaterialModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            เพิ่มวัสดุ
          </button>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm">
        <div class="overflow-x-auto" id="materials-table-container">
          <div class="p-8 flex flex-col items-center justify-center text-slate-400">
            <svg class="w-8 h-8 animate-spin mb-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <p class="text-sm font-medium">กำลังโหลดข้อมูลคลังวัสดุ...</p>
          </div>
        </div>
      </div>
    </div>

    <div id="material-modal" class="fixed inset-0 z-50 hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
      <div class="glass-pane w-full max-w-md rounded-2xl shadow-2xl border border-white/80 overflow-hidden transform scale-95 transition-transform duration-300" id="material-modal-panel">
        <div class="p-5 border-b border-slate-200/60 flex justify-between items-center bg-white/40">
          <h3 id="modal-title" class="text-lg font-bold text-slate-800">เพิ่มวัสดุใหม่</h3>
          <button onclick="closeMaterialModal()" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <input type="hidden" id="m-id">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">ชื่อวัสดุ/อุปกรณ์ <span class="text-rose-500">*</span></label>
            <input type="text" id="m-name" class="input-glass" placeholder="เช่น หลอดไฟ LED 18W">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">จำนวน <span class="text-rose-500">*</span></label>
              <input type="number" id="m-qty" class="input-glass" placeholder="0" min="0">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">หน่วยนับ</label>
              <input type="text" id="m-unit" class="input-glass" placeholder="เช่น หลอด, ชิ้น">
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">จุดคุ้มทุน (Low Stock Alert)</label>
            <input type="number" id="m-min" class="input-glass" placeholder="แจ้งเตือนเมื่อเหลือน้อยกว่า..." min="0">
          </div>
        </div>
        <div class="p-4 border-t border-slate-200/60 bg-slate-50/50 flex justify-end gap-3">
          <button onclick="closeMaterialModal()" class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors">ยกเลิก</button>
          <button onclick="saveMaterial()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">บันทึกข้อมูล</button>
        </div>
      </div>
    </div>
  `;

  fetchMaterials();
}

async function fetchMaterials() {
  try {
    // เรียก API ดึงข้อมูลวัสดุ
    const data = await apiFetch('/materials');
    materialsData = Array.isArray(data) ? data : (data.materials || []);
    renderMaterialsTable(materialsData);
  } catch (error) {
    console.error("Materials fetch error:", error);
    document.getElementById('materials-table-container').innerHTML = `
      <div class="p-6 text-center text-rose-600 flex flex-col items-center">
        <svg class="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-medium">ไม่สามารถโหลดข้อมูลได้: ${error.message}</p>
      </div>`;
  }
}

function renderMaterialsTable(items) {
  const container = document.getElementById('materials-table-container');
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 flex flex-col items-center">
        <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        <p class="font-medium">ไม่พบรายการวัสดุอุปกรณ์ในคลัง</p>
      </div>`;
    return;
  }

  let html = `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-slate-200/80 bg-slate-50/50 text-sm text-slate-600">
          <th class="p-4 font-semibold">รหัส</th>
          <th class="p-4 font-semibold">รายการวัสดุ/อุปกรณ์</th>
          <th class="p-4 font-semibold text-center">คงเหลือ</th>
          <th class="p-4 font-semibold text-center">สถานะ</th>
          <th class="p-4 font-semibold text-right">จัดการ</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
  `;

  items.forEach(m => {
    const qty = parseInt(m.quantity) || 0;
    const min = parseInt(m.min_quantity) || 5;
    const isLow = qty <= min;
    
    // สร้าง Badge สถานะ
    const statusBadge = isLow 
      ? `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ใกล้หมด</span>`
      : `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ปกติ</span>`;

    html += `
      <tr class="hover:bg-white/60 transition-colors">
        <td class="p-4 text-sm font-medium text-slate-500">${m.id || '-'}</td>
        <td class="p-4 text-sm font-semibold text-slate-800">${m.name || 'ไม่ระบุชื่อ'}</td>
        <td class="p-4 text-sm text-center font-bold ${isLow ? 'text-rose-600' : 'text-slate-700'}">${qty} <span class="text-xs font-normal text-slate-500">${m.unit || 'ชิ้น'}</span></td>
        <td class="p-4 text-center">${statusBadge}</td>
        <td class="p-4 text-right space-x-2">
          <button onclick="editMaterial(${m.id})" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors inline-flex" title="แก้ไข">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button onclick="deleteMaterial(${m.id})" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors inline-flex" title="ลบ">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ระบบค้นหาแบบ Real-time (ทำงานฝั่ง Client)
function filterMaterials() {
  const query = document.getElementById('search-material').value.toLowerCase();
  const filtered = materialsData.filter(m => 
    (m.name || '').toLowerCase().includes(query) || 
    (m.id || '').toString().includes(query)
  );
  renderMaterialsTable(filtered);
}

// ==========================================
// MODAL & CRUD LOGIC
// ==========================================

function openMaterialModal(material = null) {
  const modal = document.getElementById('material-modal');
  const panel = document.getElementById('material-modal-panel');
  const title = document.getElementById('modal-title');
  
  // Reset Form
  document.getElementById('m-id').value = '';
  document.getElementById('m-name').value = '';
  document.getElementById('m-qty').value = '';
  document.getElementById('m-unit').value = '';
  document.getElementById('m-min').value = '5'; // ค่าเริ่มต้น

  if (material) {
    title.innerText = 'แก้ไขข้อมูลวัสดุ';
    document.getElementById('m-id').value = material.id;
    document.getElementById('m-name').value = material.name;
    document.getElementById('m-qty').value = material.quantity;
    document.getElementById('m-unit').value = material.unit;
    document.getElementById('m-min').value = material.min_quantity || 5;
  } else {
    title.innerText = 'เพิ่มวัสดุใหม่';
  }

  // Animate In
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    panel.classList.remove('scale-95');
  }, 10);
}

function closeMaterialModal() {
  const modal = document.getElementById('material-modal');
  const panel = document.getElementById('material-modal-panel');
  
  // Animate Out
  modal.classList.add('opacity-0');
  panel.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

function editMaterial(id) {
  const material = materialsData.find(m => m.id == id);
  if (material) openMaterialModal(material);
}

async function saveMaterial() {
  const id = document.getElementById('m-id').value;
  const payload = {
    name: document.getElementById('m-name').value.trim(),
    quantity: parseInt(document.getElementById('m-qty').value) || 0,
    unit: document.getElementById('m-unit').value.trim(),
    min_quantity: parseInt(document.getElementById('m-min').value) || 0
  };

  if (!payload.name) {
    alert('กรุณากรอกชื่อวัสดุ');
    return;
  }

  try {
    if (id) {
      // อัปเดตข้อมูล (PUT)
      await apiFetch(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      // สร้างใหม่ (POST)
      await apiFetch('/materials', { method: 'POST', body: JSON.stringify(payload) });
    }
    
    closeMaterialModal();
    fetchMaterials(); // รีเฟรชตาราง
  } catch (error) {
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  }
}

async function deleteMaterial(id) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;
  
  try {
    await apiFetch(`/materials/${id}`, { method: 'DELETE' });
    fetchMaterials(); // รีเฟรชตาราง
  } catch (error) {
    alert(`ลบไม่สำเร็จ: ${error.message}`);
  }
}