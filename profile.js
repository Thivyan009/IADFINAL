 // --- Simple DOM helpers ---
// $ is a shorthand for document.querySelector
// $$ is a shorthand for document.querySelectorAll but returns an array
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// --- Tabs functionality ---
// Grab all tab buttons and sections
const tabs = $$('.tab');
const sections = $$('.section');

// Loop through each tab and add click event listener
tabs.forEach(t => t.addEventListener('click', ()=>{
  // Remove 'active' class from all tabs
  tabs.forEach(x=>x.classList.remove('active'));
  // Add 'active' class to clicked tab
  t.classList.add('active');

  // Remove 'active' class from all sections
  sections.forEach(s=>s.classList.remove('active'));
  // Show section corresponding to clicked tab using data-target attribute
  document.getElementById(t.dataset.target).classList.add('active');
}));

// --- LocalStorage keys ---
// These keys are used to store/retrieve data in localStorage
const KEY_PROFILE = 'organo_profile_v2';
const KEY_ADDR = 'organo_addresses_v2';
const KEY_CARDS = 'organo_cards_v2';
const KEY_ORDERS = 'organo_orders_v2';
const KEY_FAVS = 'organo_favs_v2';

// --- Initialize data from localStorage or defaults ---
// If no data exists, set default values
let profile = JSON.parse(localStorage.getItem(KEY_PROFILE)) || {name:'Guest', email:'', phone:'', pic:'avatar-placeholder.png'};
let addresses = JSON.parse(localStorage.getItem(KEY_ADDR)) || [];
let cards = JSON.parse(localStorage.getItem(KEY_CARDS)) || [];
let orders = JSON.parse(localStorage.getItem(KEY_ORDERS)) || [];
let favs = JSON.parse(localStorage.getItem(KEY_FAVS)) || [];

// --- Quick references to frequently used UI elements ---
const sidePic = $('#sidePic');        // Sidebar profile picture
const sideName = $('#sideName');      // Sidebar profile name
const welcomeName = $('#welcomeName');// Welcome message name
const statOrders = $('#statOrders');  // Orders count
const statFavourites = $('#statFavourites'); // Favourites count
const statCards = $('#statCards');    // Cards count

// --- Save all data to localStorage and refresh stats ---
function persistAll(){ 
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
  localStorage.setItem(KEY_ADDR, JSON.stringify(addresses));
  localStorage.setItem(KEY_CARDS, JSON.stringify(cards));
  localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  localStorage.setItem(KEY_FAVS, JSON.stringify(favs));
  refreshStats(); // Update counts on sidebar
}

// --- Render functions ---
// Update profile info on UI
function refreshProfileUI(){
  sidePic.src = profile.pic || 'avatar-placeholder.png';
  $('#profilePic').src = profile.pic || 'avatar-placeholder.png';
  sideName.textContent = profile.name || 'Guest';
  welcomeName.textContent = profile.name || 'Guest';
  $('#name').value = profile.name || '';
  $('#email').value = profile.email || '';
  $('#phone').value = profile.phone || '';
}

// Update stats (orders, favourites, cards) on UI
function refreshStats(){
  statOrders.textContent = orders.length;
  statFavourites.textContent = favs.length;
  statCards.textContent = cards.length;
}

// --- Render addresses in UI ---
function renderAddresses(){
  const el = $('#addressList'); el.innerHTML=''; // Clear existing
  if(addresses.length===0){ 
    el.innerHTML='<div class="item"><div>No addresses saved</div></div>'; 
    return; 
  }
  addresses.forEach((a,i)=>{
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<div class="meta">
      <div>
        <strong>${a.label}</strong><div style="font-size:13px;color:#6b7280">${a.text}</div>
      </div>
    </div>
    <div>
      <button class="btn-small btn-edit" onclick="editAddress(${i})">Edit</button>
      <button class="btn-small btn-remove" onclick="removeAddress(${i})">Remove</button>
    </div>`;
    el.appendChild(div);
  });
}

// --- Render saved cards in UI ---
function renderCards(){
  const el = $('#cards'); el.innerHTML='';
  if(cards.length===0){ 
    el.innerHTML='<div class="item">No cards saved</div>'; 
    return; 
  }
  cards.forEach((c,i)=>{
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<div class="meta">
      <div>
        <strong>${c.name}</strong><div style="font-size:13px;color:#6b7280">•••• ${c.number.slice(-4)} • Exp ${c.expiry}</div>
      </div>
    </div>
    <div>
      <button class="btn-small btn-remove" onclick="removeCard(${i})">Remove</button>
    </div>`;
    el.appendChild(div);
  });
}

// --- Render orders in UI ---
function renderOrders(){
  const el = $('#ordersList'); el.innerHTML='';
  if(orders.length===0){ 
    el.innerHTML='<div class="item">No orders yet</div>'; 
    return; 
  }
  orders.forEach((o,i)=>{
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<div class="meta">
      <img src="order-placeholder.png" alt="p"/>
      <div><strong>${o.product}</strong><div style="font-size:13px;color:#6b7280">Qty: ${o.qty} • ${o.status}</div></div>
    </div>
    <div>
      <button class="btn-small btn-edit" onclick="editOrder(${i})">Edit</button>
      <button class="btn-small btn-remove" onclick="removeOrder(${i})">Remove</button>
    </div>`;
    el.appendChild(div);
  });
}

// --- Render favourites in UI ---
function renderFavs(){
  const el = $('#favList'); el.innerHTML='';
  if(favs.length===0){ 
    el.innerHTML='<div class="item">No favourites yet</div>'; 
    return; 
  }
  favs.forEach((f,i)=>{
    const div = document.createElement('div'); div.className='item';
    div.innerHTML = `<div class="meta"><div><strong>${f}</strong></div></div><div><button class="btn-small btn-remove" onclick="removeFav(${i})">Remove</button></div>`;
    el.appendChild(div);
  });
}

// --- CRUD helpers (accessible globally) ---
// Edit address: populate input fields with selected address
window.editAddress = i=>{
  const a = addresses[i]; 
  $('#addrLabel').value = a.label; 
  $('#addrText').value = a.text; 
  $('#saveAddr').dataset.edit = i; 
  tabs.forEach(t=>t.classList.remove('active')); 
  document.querySelector('[data-target="addresses"]').classList.add('active'); 
  sections.forEach(s=>s.classList.remove('active')); 
  document.getElementById('addresses').classList.add('active');
}

// Remove address
window.removeAddress = i=>{ 
  if(confirm('Remove address?')){ 
    addresses.splice(i,1); 
    persistAll(); 
    renderAddresses(); 
  } 
}

// Remove saved card
window.removeCard = i=>{ 
  if(confirm('Remove card?')){ 
    cards.splice(i,1); 
    persistAll(); 
    renderCards(); 
  } 
}

// Edit order: populate order form
window.editOrder = i=>{
  const o = orders[i]; 
  $('#orderProduct').value=o.product; 
  $('#orderQty').value=o.qty; 
  $('#orderStatus').value=o.status; 
  $('#addOrder').dataset.edit=i; 
  tabs.forEach(t=>t.classList.remove('active')); 
  document.querySelector('[data-target="orders"]').classList.add('active'); 
  sections.forEach(s=>s.classList.remove('active')); 
  document.getElementById('orders').classList.add('active');
}

// Remove order
window.removeOrder = i=>{ 
  if(confirm('Remove order?')){ 
    orders.splice(i,1); 
    persistAll(); 
    renderOrders(); 
  } 
}

// Remove favourite
window.removeFav = i=>{ 
  if(confirm('Remove favourite?')){ 
    favs.splice(i,1); 
    persistAll(); 
    renderFavs(); 
  } 
}

// --- Event bindings for buttons ---
// Save or update address
$('#saveAddr').addEventListener('click', ()=>{
  const label = $('#addrLabel').value.trim(), text = $('#addrText').value.trim();
  if(!label || !text){ alert('Provide label and address'); return; }
  const edit = $('#saveAddr').dataset.edit;
  if(edit!==undefined && edit!==''){ 
    addresses[+edit] = {label,text}; 
    delete $('#saveAddr').dataset.edit; 
  } else { 
    addresses.push({label,text}); 
  }
  $('#addrLabel').value=''; $('#addrText').value=''; 
  persistAll(); renderAddresses();
});

// Add new card
$('#addCard').addEventListener('click', ()=>{
  const name = $('#cardName').value.trim(), number = $('#cardNumber').value.replace(/\s+/g,''), expiry = $('#cardExpiry').value.trim();
  if(!name||!number||!expiry){ alert('Fill card details'); return; }
  cards.push({name,number,expiry}); 
  $('#cardName').value=''; $('#cardNumber').value=''; $('#cardExpiry').value=''; 
  persistAll(); renderCards();
});

// Add or edit order
$('#addOrder').addEventListener('click', ()=>{
  const product = $('#orderProduct').value.trim(), qty = +$('#orderQty').value || 1, status = $('#orderStatus').value;
  if(!product){ alert('Product required'); return; }
  const edit = $('#addOrder').dataset.edit;
  if(edit!==undefined && edit!==''){ 
    orders[+edit] = {product,qty,status}; 
    delete $('#addOrder').dataset.edit; 
  } else { 
    orders.push({product, qty, status}); 
  }
  $('#orderProduct').value=''; $('#orderQty').value=''; 
  persistAll(); renderOrders();
});

// Add favourite
$('#addFav').addEventListener('click', ()=>{
  const p = $('#favProduct').value.trim();
  if(!p) return alert('Product name required'); 
  favs.push(p); 
  $('#favProduct').value=''; 
  persistAll(); renderFavs();
});

// Save profile
$('#saveProfile').addEventListener('click', ()=>{
  profile.name = $('#name').value.trim();
  profile.email = $('#email').value.trim();
  profile.phone = $('#phone').value.trim();
  persistAll(); refreshProfileUI(); 
  alert('Profile saved');
});

// Upload profile picture
$('#uploadPic').addEventListener('change', e=>{
  const file = e.target.files[0]; 
  if(!file) return;
  const reader = new FileReader(); 
  reader.onload = ()=>{ 
    profile.pic = reader.result; 
    persistAll(); 
    refreshProfileUI(); 
  }; 
  reader.readAsDataURL(file);
});

// Quick edit: jump to settings tab
$('#editQuickProfile').addEventListener('click', ()=>{
  tabs.forEach(t=>t.classList.remove('active')); 
  document.querySelector('[data-target="settings"]').classList.add('active'); 
  sections.forEach(s=>s.classList.remove('active')); 
  document.getElementById('settings').classList.add('active');
});

// Export all data as JSON
$('#downloadData').addEventListener('click', ()=>{
  const data = {profile, addresses, cards, orders, favs, exportedAt: new Date().toISOString()};
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'organo-data.json'; a.click(); 
  URL.revokeObjectURL(url);
});

// Logout and clear localStorage
$('#confirmLogout').addEventListener('click', ()=>{
  if(confirm('Clear local data and logout?')){ 
    localStorage.removeItem(KEY_PROFILE); 
    localStorage.removeItem(KEY_ADDR); 
    localStorage.removeItem(KEY_CARDS); 
    localStorage.removeItem(KEY_ORDERS); 
    localStorage.removeItem(KEY_FAVS); 
    location.reload(); 
  }
});

// --- Initial load: render UI with stored/default data ---
persistAll();
refreshProfileUI();
renderAddresses();
renderCards();
renderOrders();
renderFavs();
