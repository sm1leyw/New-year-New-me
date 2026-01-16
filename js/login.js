// 1. Import Firebase Libraries (ใช้เวอร์ชัน 12.8.0 ตามที่คุณส่งมา)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// 2. Config ของคุณ (atcc-by-aom)
const firebaseConfig = {
    apiKey: "AIzaSyBV-5X4UiXmkuioRm_f2OE1YkUXMJCrmCY",
    authDomain: "atcc-by-aom.firebaseapp.com",
    databaseURL: "https://atcc-by-aom-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "atcc-by-aom",
    storageBucket: "atcc-by-aom.firebasestorage.app",
    messagingSenderId: "94600131999",
    appId: "1:94600131999:web:70b821d82bd506196779aa",
    measurementId: "G-K7CRRH6GL9"
};

// 3. เริ่มต้นระบบ Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // เชื่อมต่อระบบ Auth

// --- ฟังก์ชันการทำงาน ---

// ฟังก์ชันสมัครสมาชิก
async function doRegister() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const confirmPass = document.getElementById('reg-pass-confirm').value;
    const errorDiv = document.getElementById('reg-error');
    const btn = document.getElementById('btn-register-submit');

    // รีเซ็ต Error และเปลี่ยนปุ่มเป็น "กำลังโหลด..."
    errorDiv.style.display = 'none';
    btn.innerText = "กำลังสมัคร...";
    btn.disabled = true;

    if (pass !== confirmPass) {
        showError(errorDiv, "รหัสผ่านไม่ตรงกัน");
        resetBtn(btn, "สมัครสมาชิก");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        alert("✅ สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ " + userCredential.user.email);
        window.location.href = 'index.html'; // ไปหน้าหลัก
    } catch (error) {
        console.error("Register Error:", error);
        let msg = "เกิดข้อผิดพลาด: " + error.message;
        
        // แปล Error เป็นภาษาไทยให้เข้าใจง่าย
        if (error.code === 'auth/email-already-in-use') msg = "อีเมลนี้มีผู้ใช้งานแล้ว";
        if (error.code === 'auth/weak-password') msg = "รหัสผ่านต้องมีความยาว 6 ตัวขึ้นไป";
        if (error.code === 'auth/invalid-email') msg = "รูปแบบอีเมลไม่ถูกต้อง";

        showError(errorDiv, msg);
    } finally {
        resetBtn(btn, "สมัครสมาชิก");
    }
}

// ฟังก์ชันล็อกอิน
async function doLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const errorDiv = document.getElementById('login-error');
    const btn = document.getElementById('btn-login-submit');

    errorDiv.style.display = 'none';
    btn.innerText = "กำลังเข้าสู่ระบบ...";
    btn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        alert("🎉 ล็อกอินสำเร็จ!");
        window.location.href = 'index.html'; // ไปหน้าหลัก
    } catch (error) {
        console.error("Login Error:", error);
        let msg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        
        if (error.code === 'auth/too-many-requests') msg = "ล็อกอินผิดบ่อยเกินไป กรุณารอสักครู่";
        if (error.code === 'auth/user-not-found') msg = "ไม่พบผู้ใช้งานนี้";
        if (error.code === 'auth/wrong-password') msg = "รหัสผ่านผิด";

        showError(errorDiv, msg);
    } finally {
        resetBtn(btn, "Login");
    }
}

// ฟังก์ชันสลับหน้า Login <-> Register
function toggleForm() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
    
    // เคลียร์ Error เก่าทิ้งตอนสลับหน้า
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('reg-error').style.display = 'none';
}

// Helper: แสดง Error
function showError(element, message) {
    element.innerText = message;
    element.style.display = 'block';
}

// Helper: คืนค่าปุ่ม
function resetBtn(btn, text) {
    btn.innerText = text;
    btn.disabled = false;
}

// --- เชื่อมต่อปุ่ม (Event Listeners) ---
// ส่วนนี้จะทำงานเมื่อหน้าเว็บโหลดเสร็จ
document.getElementById('btn-login-submit').addEventListener('click', doLogin);
document.getElementById('btn-register-submit').addEventListener('click', doRegister);
document.getElementById('btn-goto-register').addEventListener('click', toggleForm);
document.getElementById('btn-goto-login').addEventListener('click', toggleForm);