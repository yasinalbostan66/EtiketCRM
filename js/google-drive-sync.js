/**
 * Google Drive Sync for EtiketCRM
 * Provides easy backup/restore to user's own Google Drive
 */

// --- CONFIGURATION ---
// IMPORTANT: To make this work, you must create a project in Google Cloud Console,
// enable Drive API, and create an OAuth 2.0 Client ID for Web Application.
// Authorized Javascript Origins: http://localhost, http://127.0.0.1 (or your domain)
const DRIVE_CLIENT_ID = '761234567890-example.apps.googleusercontent.com'; // BURAYA KENDİ CLIENT ID'NİZİ YAZIN
const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DRIVE_DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

let driveTokenClient;
let driveGapiInited = false;
let driveGisInited = false;

// UI Elements
const btnDriveAuth = document.getElementById('btnDriveAuth');
const btnDriveSave = document.getElementById('btnDriveSave');
const btnDriveLoad = document.getElementById('btnDriveLoad');
const driveStatus = document.getElementById('driveStatus');
const driveUserEmail = document.getElementById('driveUserEmail');

/**
 * Initialize GAPI
 */
window.gapiLoaded = function() {
    gapi.load('client', async () => {
        await gapi.client.init({
            discoveryDocs: DRIVE_DISCOVERY_DOCS,
        });
        driveGapiInited = true;
        console.log('GAPI loaded');
    });
}

/**
 * Initialize GIS
 */
window.gisLoaded = function() {
    driveTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: DRIVE_CLIENT_ID,
        scope: DRIVE_SCOPES,
        callback: '', // defined in handleDriveAuth
    });
    driveGisInited = true;
    console.log('GIS loaded');
}

function checkAuthReady() {
    if (driveGapiInited && driveGisInited) {
        // UI is ready
    }
}

// Global script loading hooks
window.onload = () => {
    // If libraries were already loaded via script tags
    if (typeof gapi !== 'undefined') gapiLoaded();
    if (typeof google !== 'undefined' && google.accounts) gisLoaded();
};

/**
 * Authentication Flow
 */
async function handleDriveAuth() {
    driveTokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        updateDriveUI(true);
        showToast('Google Drive bağlantısı başarılı.', 'success');
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        driveTokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        driveTokenClient.requestAccessToken({ prompt: '' });
    }
}

function updateDriveUI(isConnected) {
    if (isConnected) {
        btnDriveAuth.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Bağlantıyı Kes';
        btnDriveAuth.onclick = handleDriveSignOut;
        btnDriveSave.style.display = 'flex';
        btnDriveSave.disabled = false;
        btnDriveLoad.style.display = 'flex';
        btnDriveLoad.disabled = false;
        driveStatus.textContent = 'Bağlı';
        driveStatus.style.borderColor = 'var(--success)';
        driveStatus.style.color = 'var(--success)';
    } else {
        btnDriveAuth.innerHTML = '<i class="fa-brands fa-google"></i> Oturum Aç';
        btnDriveAuth.onclick = handleDriveAuth;
        btnDriveSave.style.display = 'none';
        btnDriveLoad.style.display = 'none';
        driveStatus.textContent = 'Bağlı Değil';
        driveStatus.style.borderColor = 'var(--border-color)';
        driveStatus.style.color = 'var(--text-muted)';
        driveUserEmail.textContent = '';
    }
}

function handleDriveSignOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        updateDriveUI(false);
        showToast('Google Drive bağlantısı kesildi.', 'info');
    }
}

/**
 * Backup Logic
 */
async function saveToDrive() {
    try {
        btnDriveSave.disabled = true;
        btnDriveSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yedekleniyor...';

        const data = {};
        const keys = [
            'firmalar', 'siparisler', 'tahsilatlar', 'malzeme_fiyatlari', 'ziyaretler',
            'userName', 'companyName', 'companyLogo', 'defaultCurrency', 'animations', 'theme'
        ];

        keys.forEach(key => {
            const val = localStorage.getItem('etiket_crm_' + key);
            if (val) data[key] = JSON.parse(val);
        });

        const content = JSON.stringify(data, null, 2);
        const fileName = 'etiketcrm_backup.json';

        // 1. Search for existing file
        const response = await gapi.client.drive.files.list({
            q: `name = '${fileName}' and trashed = false`,
            fields: 'files(id, name)',
        });

        const existingFile = response.result.files[0];
        
        let fileId;
        let method = 'POST';
        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

        if (existingFile) {
            fileId = existingFile.id;
            method = 'PATCH';
            url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
        }

        const metadata = {
            name: fileName,
            mimeType: 'application/json',
        };

        const boundary = 'foo_bar_baz';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            content +
            close_delim;

        await gapi.client.request({
            'path': url,
            'method': method,
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        showToast('Verileriniz Google Drive\'a başarıyla yedeklendi.', 'success');
    } catch (err) {
        console.error('Drive Save Error:', err);
        showToast('Yedekleme hatası: ' + (err.message || 'Bilinmeyen hata'), 'error');
    } finally {
        btnDriveSave.disabled = false;
        btnDriveSave.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Buluta Yedekle';
    }
}

/**
 * Restore Logic
 */
async function loadFromDrive() {
    if (!confirm('Buluttaki verileri geri yüklemek istiyor musunuz? Mevcut yerel verilerinizin üzerine yazılacaktır.')) return;

    try {
        btnDriveLoad.disabled = true;
        btnDriveLoad.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yükleniyor...';

        const fileName = 'etiketcrm_backup.json';
        const response = await gapi.client.drive.files.list({
            q: `name = '${fileName}' and trashed = false`,
            fields: 'files(id, name)',
        });

        const file = response.result.files[0];
        if (!file) {
            showToast('Google Drive üzerinde yedek dosya bulunamadı.', 'error');
            return;
        }

        const fileData = await gapi.client.drive.files.get({
            fileId: file.id,
            alt: 'media',
        });

        const data = fileData.result;
        if (data) {
            Object.keys(data).forEach(key => {
                localStorage.setItem('etiket_crm_' + key, JSON.stringify(data[key]));
            });
            showToast('Veriler başarıyla geri yüklendi! Sayfa yenileniyor...', 'success');
            setTimeout(() => location.reload(), 2000);
        }
    } catch (err) {
        console.error('Drive Load Error:', err);
        showToast('Geri yükleme hatası: ' + (err.message || 'Bilinmeyen hata'), 'error');
    } finally {
        btnDriveLoad.disabled = false;
        btnDriveLoad.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Buluttan Geri Yükle';
    }
}

// Bind Events
if (btnDriveAuth) btnDriveAuth.onclick = handleDriveAuth;
if (btnDriveSave) btnDriveSave.onclick = saveToDrive;
if (btnDriveLoad) btnDriveLoad.onclick = loadFromDrive;

// Helper function (if main.js showToast is not available)
function showToast(msg, type = 'info') {
    if (window.showToast) {
        window.showToast(msg, type);
    } else {
        alert(msg);
    }
}
