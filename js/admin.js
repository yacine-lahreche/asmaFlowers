async function fetchProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return await response.json();
    } catch (err) {
        console.error('Fetch error:', err);
        return [];
    }
}

async function renderDashboard() {
    const products = await fetchProducts();
    const table = document.getElementById('inventoryTable');
    table.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.img}" class="item-preview"></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.price}</td>
            <td>${p.tag || '-'}</td>
            <td><button class="btn-delete" onclick="deleteItem(${p.id})">Delete</button></td>
        </tr>
    `).join('');
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to remove this piece from the collection?')) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            renderDashboard();
        } catch (err) {
            alert('Error deleting product.');
        }
    }
}

document.getElementById('addFlowerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('flowerImg');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Crafting...';
    submitBtn.disabled = true;

    try {
        // 1. Upload to Supabase Storage
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/flowers/${fileName}`;
        
        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': file.type,
                'x-upsert': 'true'
            },
            body: file
        });

        if (!uploadResponse.ok) {
            const errorMsg = await uploadResponse.json();
            throw new Error(`Upload error: ${errorMsg.error || errorMsg.message || 'Unknown error'}`);
        }

        // 2. Get Public URL
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/flowers/${fileName}`;

        // 3. Save Record to Database
        const productData = {
            name: document.getElementById('flowerName').value,
            price: document.getElementById('flowerPrice').value + ' DA',
            img: publicUrl,
            tag: document.getElementById('flowerTag').value,
            desc: document.getElementById('flowerDesc').value
        };

        const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(productData)
        });

        if (!dbResponse.ok) {
            const dbError = await dbResponse.json();
            throw new Error(`DB Error: ${dbError.message || dbError.details || 'Unknown DB error'}`);
        }

        // 4. Success & Re-render
        e.target.reset();
        alert('New flower added to the sanctuary!');
        renderDashboard();

    } catch (err) {
        console.error(err);
        alert('An error occurred. Please check console.');
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

// Settings Toggle & Social Links Management
const settingsBtn = document.getElementById('settingsBtn');
const settingsSection = document.getElementById('settingsSection');
const socialLinksList = document.getElementById('socialLinksList');

const defaultSocials = {
    instagram: 'Not set',
    facebook: 'Not set',
    tiktok: 'Not set',
    whatsapp: '213696004501'
};

settingsBtn.addEventListener('click', () => {
    const isHidden = settingsSection.style.display === 'none';
    settingsSection.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderSocials();
});

function renderSocials() {
    const socials = JSON.parse(localStorage.getItem('asmaFlowersSocials')) || defaultSocials;
    const keys = ['instagram', 'facebook', 'tiktok', 'whatsapp'];
    
    socialLinksList.innerHTML = keys.map(key => `
        <div class="social-row" onclick="startEditSocial('${key}', '${socials[key]}')">
            <span class="social-label">${key}</span>
            <div id="container-${key}" style='max-width: 40%; overflow-x: auto; scrollbar-width: none;'>
                <span class="social-value" style='text-wrap: nowrap; overflow-x: auto;'>${socials[key]}</span>
            </div>
        </div>
    `).join('');
}

window.startEditSocial = function(key, currentValue) {
    const container = document.getElementById(`container-${key}`);
    const row = container.closest('.social-row');
    
    // Prevent multiple clicks creating multiple inputs
    if (container.querySelector('input')) return;
    
    // stopPropagation so clicking the row doesn't re-trigger startEditSocial
    container.innerHTML = `
        <div class="edit-container" onclick="event.stopPropagation()">
            <input type="text" class="social-input" id="input-${key}" value="${currentValue === 'Not set' ? '' : currentValue}">
            <button class="btn-confirm-mini" onclick="saveSocial('${key}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
        </div>
    `;
    
    document.getElementById(`input-${key}`).focus();
};

window.saveSocial = function(key) {
    const newValue = document.getElementById(`input-${key}`).value || 'Not set';
    const socials = JSON.parse(localStorage.getItem('asmaFlowersSocials')) || defaultSocials;
    
    socials[key] = newValue;
    localStorage.setItem('asmaFlowersSocials', JSON.stringify(socials));
    
    renderSocials();
};

// Authentication Logic
const SUPABASE_URL = 'https://acsjkmknrzohrojwmjmi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc2prbWtucnpvaHJvandtam1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzkyOTUsImV4cCI6MjA5MTc1NTI5NX0.1jxe8mk4lb4snMpXuDFLQyWull56YriUBdlKk1KslFw';

const authOverlay = document.getElementById('authOverlay');
const adminContent = document.getElementById('adminContent');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('adminPassword');
const authCard = document.querySelector('.auth-card');

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

loginBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    if (!password) return;

    try {
        const inputHash = await hashPassword(password);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/admins?select=password_hash`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        const data = await response.json();
        const isValid = data.some(admin => admin.password_hash === inputHash);

        if (isValid) {
            authOverlay.style.display = 'none';
            adminContent.style.display = 'block';
            renderDashboard();
        } else {
            authCard.classList.add('shake');
            passwordInput.value = '';
            setTimeout(() => authCard.classList.remove('shake'), 400);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        alert('Connection error. Please try again.');
    }
});

// Allow Enter key
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});
