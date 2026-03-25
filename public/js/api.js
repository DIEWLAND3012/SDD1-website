// public/js/api.js

const API_BASE_URL = '/api';

/**
 * ฟังก์ชันหลักสำหรับเรียกใช้งาน API (ใช้ได้กับทุกหน้า)
 * @param {string} method - 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
 * @param {string} path - เช่น '/auth/login', '/requests'
 * @param {object} body - ข้อมูลที่จะส่งไป (ถ้ามี)
 * @param {boolean} isForm - ถ้าส่งเป็น FormData (เช่น อัปโหลดไฟล์รูปภาพ) ให้เป็น true
 */
async function api(method, path, body = null, isForm = false) {
    const headers = {};
    
    // 1. ดึง Token จากเครื่องผู้ใช้ (ถ้ามีการ Login ไว้แล้ว)
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 2. ตั้งค่า Header พื้นฐาน (ถ้าไม่ใช่การส่งไฟล์)
    if (!isForm) {
        headers['Content-Type'] = 'application/json';
    }

    const options = {
        method,
        headers
    };

    // 3. แนบข้อมูล (Body)
    if (body) {
        options.body = isForm ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(API_BASE_URL + path, options);
        
        // พยายามแปลงผลลัพธ์เป็น JSON (ถ้า Backend ตอบกลับมาเป็น JSON)
        const data = await response.json().catch(() => ({}));
        
        // 4. จัดการกรณี Error หรือ Token หมดอายุ
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.warn('Unauthorized: Token expired or invalid.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // ถ้าไม่ได้อยู่หน้า Login อยู่แล้ว ให้เด้งกลับไป
                if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                    window.location.href = '/index.html';
                }
            }
            // โยน Error ออกไปให้ไฟล์ที่เรียกใช้จัดการต่อ
            throw new Error(data.error || data.message || `HTTP ${response.status}`);
        }
        
        return data; // ส่งข้อมูลกลับไปใช้งานต่อ
    } catch (error) {
        console.error(`[API Error] ${method} ${path}:`, error);
        throw error;
    }
}