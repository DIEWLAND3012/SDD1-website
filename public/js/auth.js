// public/js/auth.js

// 1. เช็คสถานะทันทีที่โหลดหน้าเว็บ (สำหรับหน้า Login)
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    // ถ้าอยู่หน้า Login แต่มี Token อยู่แล้ว ให้พาข้ามไปหน้าของตัวเองเลย ไม่ต้อง Login ซ้ำ
    if (token && userStr && isLoginPage) {
        const user = JSON.parse(userStr);
        redirectBasedOnRole(user.role);
    }
});

// 2. ฟังก์ชันจัดการเมื่อกดปุ่ม "เข้าสู่ระบบ"
async function handleLogin(event) {
    event.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const btnSubmit = document.getElementById('btn-login');
    const errorAlert = document.getElementById('login-error');
    
    // ซ่อนข้อความแจ้งเตือน Error ก่อนเริ่มทำงาน
    if (errorAlert) errorAlert.classList.add('hidden');
    
    // เปลี่ยนสถานะปุ่มเป็น Loading
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> กำลังตรวจสอบ...`;
    btnSubmit.disabled = true;

    try {
        // ยิง API ไปที่ Backend ของคุณ
        const response = await api('POST', '/auth/login', { 
            email: emailInput, 
            password: passwordInput 
        });

        // ถ้าสำเร็จ Backend จะส่ง token และข้อมูล user กลับมา
        if (response.token && response.user) {
            // บันทึกลงเครื่อง (localStorage)
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // เปลี่ยนหน้าตามสิทธิ์
            redirectBasedOnRole(response.user.role);
        } else {
            throw new Error('รูปแบบข้อมูลตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง');
        }

    } catch (error) {
        // กรณีอีเมล/รหัสผ่านผิด หรือเซิร์ฟเวอร์มีปัญหา
        if (errorAlert) {
            errorAlert.textContent = error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            errorAlert.classList.remove('hidden');
        } else {
            alert(error.message || 'เข้าสู่ระบบล้มเหลว');
        }
        
        // Render ไอคอนของ Lucide ใหม่ (ถ้ามี)
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
    } finally {
        // คืนค่าปุ่มกลับมาเหมือนเดิม
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// 3. ฟังก์ชันเตะเปลี่ยนหน้าตาม Role
function redirectBasedOnRole(role) {
    switch (role) {
        case 'user':
            window.location.href = 'user.html';
            break;
        case 'technician':
            window.location.href = 'technician.html';
            break;
        case 'manager':
            window.location.href = 'manager.html';
            break;
        case 'admin':
            window.location.href = 'admin.html';
            break;
        default:
            console.error('Unknown role:', role);
            alert('ไม่พบสิทธิ์การใช้งานที่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ');
            localStorage.clear();
            window.location.reload();
    }
}

// 4. ฟังก์ชันออกจากระบบ (เรียกใช้ได้จากทุกหน้า)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// 5. ดึงข้อมูลผู้ใช้ปัจจุบัน (Helper function ไว้ใช้ในหน้าอื่นๆ)
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}