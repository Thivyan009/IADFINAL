// profile.js
// This script handles: profile info, tabs, orders, wishlist, addresses using localStorage

(function(){
  // ===============================
  // Helper functions for convenience
  // ===============================
  function qs(sel, root=document){ return root.querySelector(sel); }       // Select first element
  function qsa(sel, root=document){ return Array.from((root||document).querySelectorAll(sel)); } // Select all elements
  function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; } // Create element from HTML string

  // ===============================
  // LocalStorage helpers
  // ===============================
  function saveData(key, data){ 
    try { 
      localStorage.setItem(key, JSON.stringify(data)); 
    } catch(e){ 
      console.error('saveData', e); 
    } 
  }

  function loadData(key, defaultValue){ 
    try { 
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : defaultValue; 
    } catch(e){ 
      console.error('loadData', e); 
      return defaultValue; 
    } 
  }

  // ===============================
  // Legacy key migration
  // Maps old localStorage keys to new keys
  // ===============================
  var MIGRATION_MAP = {
    'oa_profile': ['profile','user_profile','userProfile','profile_info'],
    'oa_orders': ['orders','user_orders','order_list'],
    'oa_wishlist': ['wishlist','fav','favorites'],
    'oa_addresses': ['addresses','saved_addresses','address_list']
  };

  function migrateLegacyKeys(){
    Object.keys(MIGRATION_MAP).forEach(function(dest){
      try {
        if(localStorage.getItem(dest)) return; // Skip if new key exists
        var sources = MIGRATION_MAP[dest];
        for(var i=0;i<sources.length;i++){
          var s = sources[i];
          var val = localStorage.getItem(s);
          if(!val) continue;
          try { 
            var parsed = JSON.parse(val); 
          }
          catch(e){ 
            parsed = dest==='oa_profile' ? { name: val } : [val]; 
          }
          localStorage.setItem(dest, JSON.stringify(parsed));
          console.info('Migrated', s, '->', dest);
          break;
        }
      } catch(e){ console.warn('migrate err', e); }
    });
  }

  // ===============================
  // Load profile info into UI
  // ===============================
  function loadProfileToUI(){
    var profile = loadData('oa_profile', {name:'',email:'',phone:'',picture:''});
    var displayName = qs('#displayName');
    var displayEmail = qs('#displayEmail');
    var displayPhone = qs('#displayPhone');
    var profilePic = qs('#profilePic');

    // Set sidebar display
    if(displayName) displayName.textContent = profile.name || 'Your Name';
    if(displayEmail) displayEmail.textContent = profile.email || 'email@example.com';
    if(displayPhone) displayPhone.textContent = profile.phone || '';
    if(profilePic){
      if(profile.picture) profilePic.src = profile.picture;
      else { profilePic.removeAttribute('src'); profilePic.alt='Profile picture'; }
    }

    // Set form inputs
    var nameInput = qs('#nameInput'), emailInput = qs('#emailInput'), phoneInput = qs('#phoneInput');
    if(nameInput) nameInput.value = profile.name || '';
    if(emailInput) emailInput.value = profile.email || '';
    if(phoneInput) phoneInput.value = profile.phone || '';

    // Set dashboard greeting
    var dashName = qs('#dashName');
    if(dashName) dashName.textContent = profile.name || 'User';
  }

  // ===============================
  // Bind profile form submit & reset
  // ===============================
  function bindProfileForm(){
    var form = qs('#profileForm');
    if(!form) return;
    var picInput = qs('#picInput');

    // Save profile on submit
    form.addEventListener('submit', function(ev){
      ev.preventDefault();

      // Get input values
      var name = (qs('#nameInput') && qs('#nameInput').value) ? qs('#nameInput').value.trim() : '';
      var email = (qs('#emailInput') && qs('#emailInput').value) ? qs('#emailInput').value.trim() : '';
      var phone = (qs('#phoneInput') && qs('#phoneInput').value) ? qs('#phoneInput').value.trim() : '';

      var current = loadData('oa_profile', {name:'',email:'',phone:'',picture:''});
      current.name = name; current.email = email; current.phone = phone;

      // If new profile picture selected
      var file = picInput && picInput.files && picInput.files[0];
      if(file){
        var reader = new FileReader();
        reader.onload = function(e){
          current.picture = e.target.result;
          saveData('oa_profile', current);
          loadProfileToUI();
          alert('Profile saved.');
          window.dispatchEvent(new CustomEvent('oa_profile_updated', {detail: current}));
        };
        reader.readAsDataURL(file);
      } else {
        saveData('oa_profile', current);
        loadProfileToUI();
        alert('Profile saved.');
        window.dispatchEvent(new CustomEvent('oa_profile_updated', {detail: current}));
      }

      // Re-render other lists
      renderOrders(); renderWishlist(); renderAddresses();
    });

    // Reset profile
    var resetBtn = qs('#logoutBtn');
    if(resetBtn) resetBtn.addEventListener('click', function(){
      if(confirm('Reset profile to empty?')){
        saveData('oa_profile', {name:'',email:'',phone:'',picture:''});
        loadProfileToUI();
      }
    });
  }

  // ===============================
  // Render Orders, Wishlist, Addresses
  // ===============================
  function renderOrders(){
    var ordersList = qs('#ordersList');
    if(!ordersList) return;
    ordersList.innerHTML = '';
    var orders = loadData('oa_orders', []);
    if(!Array.isArray(orders) || orders.length===0){ ordersList.innerHTML = '<li>No orders</li>'; return; }
    orders.forEach(function(p){
      var li = el('<li><div style="display:flex;align-items:center;gap:12px;"><img src="'+(p.image||'')+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;"><div><div>'+ (p.title||'Item') +'</div><div style="font-weight:600;">LKR '+ (p.price||0) +'.00</div></div></div><div>'+ (p.qty||1) +'</div></li>');
      ordersList.appendChild(li);
    });
    var ordersCount = qs('#ordersCount');
    if(ordersCount) ordersCount.textContent = orders.length;
  }

  function renderWishlist(){
    var wishlistList = qs('#wishlistList');
    if(!wishlistList) return;
    wishlistList.innerHTML = '';
    var wishlist = loadData('oa_wishlist', []);
    if(!Array.isArray(wishlist) || wishlist.length===0){ wishlistList.innerHTML = '<li>No items in wishlist</li>'; return; }
    wishlist.forEach(function(p){
      var li = el('<li><div style="display:flex;align-items:center;gap:12px;"><img src="'+(p.image||'')+'" style="width:48px;height:48px;object-fit:cover;border-radius:6px;"><div><div>'+ (p.title||'Item') +'</div><div style="font-weight:600;">LKR '+ (p.price||0) +'.00</div></div></div></li>');
      wishlistList.appendChild(li);
    });
    var wishlistCount = qs('#wishlistCount');
    if(wishlistCount) wishlistCount.textContent = wishlist.length;
  }

  function renderAddresses(){
    var addrList = qs('#addressList') || qs('#savedAddressList') || qs('#savedAddresses') || qs('#addressListContainer');
    if(!addrList) return;
    addrList.innerHTML = '';
    var addresses = loadData('oa_addresses', []);
    if(!Array.isArray(addresses) || addresses.length===0){ addrList.innerHTML = '<li>No saved addresses</li>'; return; }
    addresses.forEach(function(a){
      var li = el('<li><div><strong>'+ (a.label||'Address') +'</strong><div>'+ (a.line1||'') +' '+ (a.city||'') +' '+ (a.postal||'') +'</div></div></li>');
      addrList.appendChild(li);
    });
  }

  // ===============================
  // Tabs switching logic
  // ===============================
  function bindTabs(){
    var buttons = qsa('.tab-btn');
    var contents = qsa('.tab-content');

    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        var tab = btn.getAttribute('data-tab');

        // Remove active from all buttons and tabs
        buttons.forEach(function(b){ b.classList.remove('active'); });
        contents.forEach(function(c){ c.classList.remove('active'); });

        // Activate clicked tab
        btn.classList.add('active');
        var target = qs('#' + tab);
        if(target) target.classList.add('active');
      });
    });

    // Edit profile button opens settings tab
    var editBtn = qs('#editProfileBtn');
    if(editBtn){
      editBtn.addEventListener('click', function(){
        var settingsBtn = qsa('.tab-btn').filter(function(b){ return b.getAttribute('data-tab')==='settings'; })[0];
        if(settingsBtn) settingsBtn.click();
        setTimeout(function(){ var ni = qs('#nameInput'); if(ni) ni.focus(); }, 100);
      });
    }
  }

  // ===============================
  // Initialize everything on page load
  // ===============================
  document.addEventListener('DOMContentLoaded', function(){
    try { migrateLegacyKeys(); } catch(e){}

    loadProfileToUI();
    bindProfileForm();
    renderOrders();
    renderWishlist();
    renderAddresses();
    bindTabs();

    // Optional clear buttons
    var clearOrders = qs('#clearOrders'); 
    if(clearOrders) clearOrders.addEventListener('click', function(){ 
      if(confirm('Clear orders?')){ 
        saveData('oa_orders', []); 
        renderOrders(); 
      } 
    });

    var clearWishlist = qs('#clearWishlist'); 
    if(clearWishlist) clearWishlist.addEventListener('click', function(){ 
      if(confirm('Clear wishlist?')){ 
        saveData('oa_wishlist', []); 
        renderWishlist(); 
      } 
    });

    var clearAddresses = qs('#clearAddresses'); 
    if(clearAddresses) clearAddresses.addEventListener('click', function(){ 
      if(confirm('Clear addresses?')){ 
        saveData('oa_addresses', []); 
        renderAddresses(); 
      } 
    });

    // Re-render if localStorage changes in another tab
    window.addEventListener('storage', function(e){
      if(e.key && e.key.indexOf('oa_')===0){
        setTimeout(function(){ 
          renderOrders(); 
          renderWishlist(); 
          renderAddresses(); 
          loadProfileToUI(); 
        }, 50);
      }
    });
  });

  // Expose debug helpers
  window.oa = { saveData, loadData, migrateLegacyKeys };

})();
