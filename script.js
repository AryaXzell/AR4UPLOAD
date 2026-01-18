// ==========================================
// CONFIG - ISI DULU DISINI
// ==========================================
const SUPABASE_URL = 'https://owivtazpjnkbncfwmitk.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXZ0YXpwam5rYm5jZndtaXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTc2MjUsImV4cCI6MjA4NDI5MzYyNX0.nCz4yDlg-iPOZfHrrQHU5tvlDTZJ2HpXWJMGXVPYVsI'; 
const BUCKET_NAME = 'media'; 
// ==========================================

const { createClient } = supabase;
let supabaseClient = null;
let isUploading = false;

// seleksi elemen
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const viewUpload = document.getElementById('view-upload');
const viewProgress = document.getElementById('view-progress');
const viewResult = document.getElementById('view-result');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const resultLink = document.getElementById('result-link');
const fileNameEl = document.getElementById('file-name');
const fileSizeEl = document.getElementById('file-size');

// inisialisasi pas load
window.addEventListener('DOMContentLoaded', () => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        document.getElementById('config-warning').classList.remove('hidden');
        fileInput.disabled = true;
        dropZone.style.cursor = 'not-allowed';
    } else {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
});

// handling drag & drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
    dropZone.addEventListener(e, (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    });
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', e => {
    if (e.target.files.length) handleFiles(e.target.files[0]);
});

async function handleFiles(file) {
    if (isUploading) return;
    if (!supabaseClient) return showToast('config supabase belum lengkap', 'error');
    if (file.size > 50 * 1024 * 1024) return showToast('file terlalu besar (max 50mb)', 'error');

    isUploading = true;
    dropZone.classList.add('uploading');
    updateView('progress');
    
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    updateProgressUI(0);

    const fileExt = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'file';
    const uniqueName = `${crypto.randomUUID()}.${fileExt}`;

    let progressInterval;
    try {
        // fake progress biar user gak bengong (smooth feeling)
        let fakeProg = 0;
        progressInterval = setInterval(() => {
            if (fakeProg >= 92) fakeProg += (100 - fakeProg) * 0.12;
            else fakeProg += 2.5 + Math.random() * 7;
            updateProgressUI(Math.min(fakeProg, 92));
        }, 160);

        const { data, error } = await supabaseClient.storage
            .from(BUCKET_NAME)
            .upload(uniqueName, file, { cacheControl: '3600', upsert: false });

        clearInterval(progressInterval);
        if (error) throw error;

        updateProgressUI(100);
        const { data: urlData } = supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(uniqueName);

        setTimeout(() => {
            resultLink.value = urlData.publicUrl;
            updateView('result');
            showToast('upload berhasil!', 'success');
        }, 600);

    } catch (err) {
        clearInterval(progressInterval);
        showToast(err.message || 'gagal upload nih...', 'error');
        setTimeout(() => updateView('upload'), 2600);
    } finally {
        isUploading = false;
        dropZone.classList.remove('uploading');
    }
}

function updateView(view) {
    [viewUpload, viewProgress, viewResult].forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${view}`).classList.remove('hidden');
}

function updateProgressUI(val) {
    const percent = Math.round(val);
    progressBar.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
}

function formatBytes(bytes) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function copyToClipboard() {
    resultLink.select();
    document.execCommand('copy');
    showToast('link sudah dicopy!', 'success');
}

function resetApp() {
    fileInput.value = '';
    updateProgressUI(0);
    updateView('upload');
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    const icon = document.getElementById('toast-icon');

    msgEl.textContent = msg;
    icon.className = type === 'error' 
        ? 'fas fa-exclamation-circle text-red-400 text-xl' 
        : 'fas fa-check-circle text-green-400 text-xl';

    toast.classList.remove('-translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
    }, 3200);
}
