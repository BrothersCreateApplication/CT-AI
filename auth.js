/* ===== Login gate =====
 * Client-side access control for a static host (Vercel).
 * Only blocks casual access — a determined visitor can bypass client JS.
 * Account: admin  /  Password hash stored below (see PASS_HASH).
 */
(function () {
  'use strict';

  var USER = 'admin';
  var PASS_HASH = 'e7a4c2e188dbfbc41433fd9b58d99145b6d3f693b637218bf9ad718dbf1a1c59'; // sha256 of the login password
  var AUTH_KEY = 'ctai_auth';
  var LOCK_ATTR = 'data-locked';

  var screenEl = document.getElementById('login-screen');

  function sha256Hex(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
      .then(function (hash) {
        return Array.prototype.map.call(new Uint8Array(hash), function (b) {
          return ('0' + b.toString(16)).slice(-2);
        }).join('');
      });
  }

  function unlock() {
    sessionStorage.setItem(AUTH_KEY, '1');
    document.body.removeAttribute(LOCK_ATTR);
    if (screenEl) screenEl.style.display = 'none';
  }

  function showError(msg) {
    var box = document.getElementById('login-error');
    if (!box) return;
    box.textContent = msg;
    box.style.display = msg ? 'block' : 'none';
  }

  function setBusy(busy) {
    var btn = document.getElementById('login-btn');
    if (!btn) return;
    btn.disabled = busy;
    btn.textContent = busy ? 'Đang kiểm tra…' : 'Đăng nhập';
  }

  function initForm() {
    var form = document.getElementById('login-form');
    var user = document.getElementById('login-user');
    var pass = document.getElementById('login-pass');
    if (!form || !user || !pass) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showError('');
      var u = (user.value || '').trim();
      var p = pass.value || '';
      if (!u || !p) {
        showError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
        return;
      }
      setBusy(true);
      sha256Hex(p).then(function (hash) {
        if (u === USER && hash === PASS_HASH) {
          unlock();
        } else {
          showError('Tài khoản hoặc mật khẩu không đúng.');
          pass.value = '';
          setBusy(false);
          pass.focus();
        }
      }).catch(function () {
        showError('Đã xảy ra lỗi khi xác thực. Vui lòng thử lại.');
        setBusy(false);
      });
    });

    if (user) user.focus();
  }

  // Global logout, called from the header button
  window.logout = function () {
    sessionStorage.removeItem(AUTH_KEY);
    document.body.setAttribute(LOCK_ATTR, '');
    window.location.reload();
  };

  if (sessionStorage.getItem(AUTH_KEY) === '1') {
    unlock();
  } else {
    initForm();
  }
})();
