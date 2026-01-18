// --- KONFIGURASI SUPABASE ---
const SUPABASE_URL = 'https://owivtazpjnkbncfwmitk.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_vnReD59s-Lp0WREr31RK-A_7QVrmQgE';
const BUCKET_NAME = 'media';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const uploadArea = document.getElementById('upload-area');
const loadingArea = document.getElementById('loading-area');
const resultArea = document.getElementById('result-area');
const progressBar = document.getElementById('progress-bar');
const shareUrlInput = document.getElementById('share-url');
const errorMsg = document.getElementById('error-msg');

// Drag and drop visual
['dragenter', 'dragover'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });
});

['dragleave', 'drop'].forEach(name => {
    dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
    });
});

dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length) handleUpload(files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleUpload(e.target.files[0]);
});

async function handleUpload(file) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        showError("Supabase URL/Key belum diisi di kodenya, bos.");
        return;
    }

    errorMsg.classList.add('hidden');
    uploadArea.classList.add('hidden');
    loadingArea.classList.remove('hidden');
    progressBar.style.width = '10%';

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        progressBar.style.width = '100%';

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        setTimeout(() => {
            loadingArea.classList.add('hidden');
            resultArea.classList.remove('hidden');
            shareUrlInput.value = publicUrl;
        }, 500);

    } catch (err) {
        showError("Gagal upload: " + err.message);
        resetUI();
    }
}

function copyLink() {
    shareUrlInput.select();
    document.execCommand('copy');
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Copied!';
    setTimeout(() => btn.innerText = originalText, 2000);
}

function resetUI() {
    uploadArea.classList.remove('hidden');
    loadingArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    fileInput.value = '';
    progressBar.style.width = '0%';
}

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.classList.remove('hidden');
}
