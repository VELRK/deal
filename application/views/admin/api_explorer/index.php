<?php
$catalogJson = json_encode(array_values($catalog), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$groupsJson  = json_encode($groups, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$guideJson   = json_encode($guide, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
?>
<style>
.ae-wrap{display:flex;gap:0;min-height:calc(100vh - 120px);background:#1e1e2e;border-radius:12px;overflow:hidden;color:#cdd6f4;font-size:13px}
.ae-side{width:300px;min-width:260px;background:#181825;border-right:1px solid #313244;display:flex;flex-direction:column}
.ae-side-head{padding:14px 14px 10px;border-bottom:1px solid #313244}
.ae-side-head h5{margin:0;color:#cba6f7;font-size:14px;font-weight:700}
.ae-side-head small{color:#6c7086}
.ae-search{width:100%;margin-top:10px;background:#313244;border:1px solid #45475a;color:#cdd6f4;border-radius:8px;padding:8px 10px}
.ae-list{overflow:auto;flex:1;padding:8px}
.ae-group{margin-bottom:10px}
.ae-group-title{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#6c7086;padding:6px 8px;font-weight:700}
.ae-item{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;background:transparent;color:#cdd6f4;padding:8px 10px;border-radius:8px;cursor:pointer}
.ae-item:hover,.ae-item.active{background:#313244}
.ae-method{font-size:10px;font-weight:800;min-width:46px;font-family:ui-monospace,Consolas,monospace}
.ae-method.GET{color:#a6e3a1}.ae-method.POST{color:#fab387}.ae-method.PUT{color:#89b4fa}.ae-method.DELETE{color:#f38ba8}
.ae-item-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ae-badge{font-size:9px;padding:1px 5px;border-radius:999px;background:#45475a;color:#a6adc8}
.ae-badge.auth{background:#45475a;color:#f9e2af}
.ae-badge.ok{background:#1e3a2f;color:#a6e3a1}
.ae-main{flex:1;display:flex;flex-direction:column;min-width:0}
.ae-top{padding:12px 14px;border-bottom:1px solid #313244;background:#1e1e2e;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ae-url{flex:1;min-width:220px;display:flex;background:#313244;border:1px solid #45475a;border-radius:8px;overflow:hidden}
.ae-url select{border:0;background:#45475a;color:#cdd6f4;font-weight:800;padding:0 10px}
.ae-url input{flex:1;border:0;background:transparent;color:#cdd6f4;padding:10px 12px;outline:none;font-family:ui-monospace,Consolas,monospace;font-size:12px}
.ae-btn{border:0;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer}
.ae-btn-send{background:#cba6f7;color:#1e1e2e}
.ae-btn-send:disabled{opacity:.55;cursor:wait}
.ae-btn-ghost{background:#313244;color:#cdd6f4}
.ae-token-row{padding:10px 14px;border-bottom:1px solid #313244;display:flex;gap:8px;flex-wrap:wrap;align-items:center;background:#181825}
.ae-token-row label{color:#6c7086;font-size:11px;font-weight:700;text-transform:uppercase}
.ae-token-row input{flex:1;min-width:180px;background:#313244;border:1px solid #45475a;color:#cdd6f4;border-radius:8px;padding:8px 10px;font-family:ui-monospace,Consolas,monospace;font-size:12px}
.ae-tabs{display:flex;gap:4px;padding:8px 14px 0;border-bottom:1px solid #313244}
.ae-tab{background:transparent;border:0;color:#6c7086;padding:8px 12px;border-radius:8px 8px 0 0;font-weight:700;cursor:pointer}
.ae-tab.active{background:#313244;color:#cba6f7}
.ae-pane{display:none;padding:14px;overflow:auto;flex:1}
.ae-pane.active{display:block}
.ae-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:1100px){.ae-wrap{flex-direction:column}.ae-side{width:100%;max-height:280px}.ae-grid{grid-template-columns:1fr}}
.ae-card{background:#181825;border:1px solid #313244;border-radius:10px;padding:12px}
.ae-card h6{margin:0 0 8px;color:#cba6f7;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.ae-how{color:#a6adc8;line-height:1.55;margin:0}
.ae-textarea,.ae-pre{width:100%;min-height:220px;background:#11111b;border:1px solid #313244;border-radius:8px;color:#cdd6f4;padding:12px;font-family:ui-monospace,Consolas,monospace;font-size:12px;white-space:pre-wrap;word-break:break-word}
.ae-kv{width:100%;border-collapse:collapse}
.ae-kv th,.ae-kv td{border-bottom:1px solid #313244;padding:8px;text-align:left}
.ae-kv th{color:#6c7086;font-size:11px;width:35%}
.ae-kv input{width:100%;background:#313244;border:1px solid #45475a;color:#cdd6f4;border-radius:6px;padding:6px 8px}
.ae-status{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.ae-pill{padding:4px 10px;border-radius:999px;font-weight:700;font-size:11px;background:#313244}
.ae-pill.ok{background:#1e3a2f;color:#a6e3a1}
.ae-pill.err{background:#3b1d28;color:#f38ba8}
.ae-tips{margin:0;padding-left:18px;color:#a6adc8}
.ae-tips li{margin-bottom:4px}
.ae-empty{color:#6c7086;padding:40px;text-align:center}
</style>

<div class="sk-page-header d-flex align-items-center justify-content-between mb-3">
  <div>
    <h5 class="sk-page-title mb-0"><i class="bi bi-braces-asterisk me-2 text-primary"></i>Mobile API Explorer</h5>
    <small class="text-muted">Postman-style tester for all customer <code>shopkart-api</code> endpoints — live Send + docs</small>
  </div>
  <span class="badge bg-primary"><?= count($catalog) ?> APIs</span>
</div>

<div class="ae-wrap" id="aeApp">
  <aside class="ae-side">
    <div class="ae-side-head">
      <h5>Customer APIs</h5>
      <small>Base: <?= htmlspecialchars(rtrim($api_base, '/')) ?></small>
      <input type="search" class="ae-search" id="aeSearch" placeholder="Search APIs…">
    </div>
    <div class="ae-list" id="aeList"></div>
  </aside>

  <section class="ae-main">
    <div class="ae-top">
      <div class="ae-url">
        <select id="aeMethod" disabled>
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
        </select>
        <input type="text" id="aeUrl" placeholder="Select an API from the left">
      </div>
      <button type="button" class="ae-btn ae-btn-send" id="aeSend">Send</button>
      <button type="button" class="ae-btn ae-btn-ghost" id="aeCopyCurl" title="Copy curl">Copy cURL</button>
    </div>

    <div class="ae-token-row">
      <label>JWT Token</label>
      <input type="text" id="aeToken" placeholder="Paste Bearer token — auto-filled after Login / Register / OTP Verify">
      <label>X-Session-ID</label>
      <input type="text" id="aeSession" value="mobile-guest-session-1" style="max-width:220px">
    </div>

    <div class="ae-tabs">
      <button type="button" class="ae-tab active" data-tab="docs">Docs</button>
      <button type="button" class="ae-tab" data-tab="params">Query</button>
      <button type="button" class="ae-tab" data-tab="headers">Headers</button>
      <button type="button" class="ae-tab" data-tab="body">Body</button>
      <button type="button" class="ae-tab" data-tab="sample">Sample Out</button>
      <button type="button" class="ae-tab" data-tab="response">Response</button>
    </div>

    <div class="ae-pane active" id="tab-docs">
      <div class="ae-empty" id="aeDocsEmpty">Select an API from the left to view the full guide.</div>
      <div id="aeDocs" style="display:none">
        <div class="ae-grid">
          <div class="ae-card">
            <h6>How to use</h6>
            <p class="ae-how" id="aeHow"></p>
            <div class="mt-3" id="aeMeta"></div>
          </div>
          <div class="ae-card">
            <h6>Global guide</h6>
            <ul class="ae-tips" id="aeTips"></ul>
          </div>
        </div>
        <div class="ae-card mt-3">
          <h6>Sample request JSON</h6>
          <pre class="ae-pre" id="aeSampleIn" style="min-height:120px"></pre>
        </div>
      </div>
    </div>

    <div class="ae-pane" id="tab-params">
      <div class="ae-card">
        <h6>Query parameters</h6>
        <table class="ae-kv"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody id="aeParams"></tbody></table>
      </div>
    </div>

    <div class="ae-pane" id="tab-headers">
      <div class="ae-card">
        <h6>Request headers (editable)</h6>
        <table class="ae-kv"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody id="aeHeaders"></tbody></table>
      </div>
    </div>

    <div class="ae-pane" id="tab-body">
      <div class="ae-card">
        <h6>JSON body</h6>
        <textarea class="ae-textarea" id="aeBody" spellcheck="false"></textarea>
      </div>
    </div>

    <div class="ae-pane" id="tab-sample">
      <div class="ae-card">
        <h6>Verified / expected output</h6>
        <pre class="ae-pre" id="aeSampleOut"></pre>
      </div>
    </div>

    <div class="ae-pane" id="tab-response">
      <div class="ae-card">
        <div class="ae-status">
          <span class="ae-pill" id="aeHttp">—</span>
          <span class="ae-pill" id="aeTime">—</span>
          <span class="text-muted" id="aeRespHint">Click Send to call the live API</span>
        </div>
        <pre class="ae-pre" id="aeResponse">{}</pre>
      </div>
    </div>
  </section>
</div>

<script>
(function () {
  const API_BASE = <?= json_encode(rtrim($api_base, '/') . '/') ?>;
  const CATALOG = <?= $catalogJson ?: '[]' ?>;
  const GROUPS = <?= $groupsJson ?: '{}' ?>;
  const GUIDE = <?= $guideJson ?: '{}' ?>;
  let current = null;

  const $ = (id) => document.getElementById(id);
  const listEl = $('aeList');

  function authLabel(a) {
    if (a === true) return 'JWT';
    if (a === 'optional') return 'JWT?';
    return 'Public';
  }

  function renderList(filter) {
    const q = (filter || '').toLowerCase().trim();
    listEl.innerHTML = '';
    Object.keys(GROUPS).forEach(function (gid) {
      const items = CATALOG.filter(function (api) {
        if (api.group !== gid) return false;
        if (!q) return true;
        return (api.name + ' ' + api.path + ' ' + api.method + ' ' + (api.how || '')).toLowerCase().indexOf(q) >= 0;
      });
      if (!items.length) return;
      const wrap = document.createElement('div');
      wrap.className = 'ae-group';
      wrap.innerHTML = '<div class="ae-group-title">' + GROUPS[gid] + '</div>';
      items.forEach(function (api) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ae-item' + (current && current.id === api.id ? ' active' : '');
        btn.innerHTML =
          '<span class="ae-method ' + api.method + '">' + api.method + '</span>' +
          '<span class="ae-item-name">' + api.name + '</span>' +
          (api.verified ? '<span class="ae-badge ok">OK</span>' : '') +
          '<span class="ae-badge auth">' + authLabel(api.auth) + '</span>';
        btn.addEventListener('click', function () { selectApi(api.id); });
        wrap.appendChild(btn);
      });
      listEl.appendChild(wrap);
    });
  }

  function pretty(obj) {
    try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
  }

  function kvRows(tbody, map, editable) {
    tbody.innerHTML = '';
    const entries = Object.keys(map || {});
    if (!entries.length) {
      tbody.innerHTML = '<tr><td colspan="2" class="text-muted">None</td></tr>';
      return;
    }
    entries.forEach(function (k) {
      const tr = document.createElement('tr');
      const val = map[k] == null ? '' : String(map[k]);
      tr.innerHTML = '<th>' + k + '</th><td>' +
        (editable
          ? '<input data-key="' + k + '" value="' + val.replace(/"/g, '&quot;') + '">'
          : '<code>' + val + '</code>') +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  function readKv(tbody) {
    const out = {};
    tbody.querySelectorAll('input[data-key]').forEach(function (inp) {
      out[inp.getAttribute('data-key')] = inp.value;
    });
    return out;
  }

  function buildUrl(api, params) {
    let url = API_BASE + api.path.replace(/^\//, '');
    const qs = new URLSearchParams();
    Object.keys(params || {}).forEach(function (k) {
      if (params[k] !== '' && params[k] != null) qs.set(k, params[k]);
    });
    const s = qs.toString();
    return s ? url + '?' + s : url;
  }

  function selectApi(id) {
    current = CATALOG.find(function (a) { return a.id === id; }) || null;
    if (!current) return;
    renderList($('aeSearch').value);
    $('aeMethod').value = current.method;
    $('aeUrl').value = buildUrl(current, current.query || {});
    $('aeDocsEmpty').style.display = 'none';
    $('aeDocs').style.display = 'block';
    $('aeHow').textContent = current.how || '';
    $('aeMeta').innerHTML =
      '<div class="small text-muted mb-1"><strong>Auth:</strong> ' + authLabel(current.auth) +
      ' &nbsp;|&nbsp; <strong>Verified:</strong> ' + (current.verified ? 'Yes (curl-checked)' : 'No') + '</div>' +
      '<div class="small"><code>' + current.method + ' /shopkart-api/' + current.path + '</code></div>';
    $('aeTips').innerHTML = (GUIDE.tips || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
    $('aeSampleIn').textContent = current.body == null ? '(no body)' : pretty(current.body);
    $('aeSampleOut').textContent = pretty(current.sample_response || {});
    kvRows($('aeParams'), current.query || {}, true);
    const hdrs = Object.assign({}, current.headers || {});
    if (current.auth === true || current.auth === 'optional') {
      if (!hdrs['Authorization']) hdrs['Authorization'] = 'Bearer {{token}}';
    }
    kvRows($('aeHeaders'), hdrs, true);
    $('aeBody').value = current.body == null ? '' : pretty(current.body);
    $('aeBody').disabled = current.body == null && current.method === 'GET';
    switchTab('docs');
  }

  function switchTab(name) {
    document.querySelectorAll('.ae-tab').forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.ae-pane').forEach(function (p) {
      p.classList.toggle('active', p.id === 'tab-' + name);
    });
  }

  document.querySelectorAll('.ae-tab').forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
  });
  $('aeSearch').addEventListener('input', function () { renderList(this.value); });

  function resolveHeaders() {
    const hdrs = readKv($('aeHeaders'));
    const token = ($('aeToken').value || '').trim();
    const session = ($('aeSession').value || '').trim();
    Object.keys(hdrs).forEach(function (k) {
      if (typeof hdrs[k] === 'string') {
        hdrs[k] = hdrs[k].replace(/\{\{token\}\}/g, token);
      }
    });
    if (token && (current.auth === true || current.auth === 'optional')) {
      hdrs['Authorization'] = 'Bearer ' + token.replace(/^Bearer\s+/i, '');
    }
    if (session && (current.group === 'cart' || hdrs['X-Session-ID'] !== undefined)) {
      hdrs['X-Session-ID'] = session;
    }
    return hdrs;
  }

  function buildCurl() {
    if (!current) return '';
    const params = readKv($('aeParams'));
    const url = buildUrl(current, params);
    const hdrs = resolveHeaders();
    let cmd = "curl -X " + current.method + " '" + url + "'";
    Object.keys(hdrs).forEach(function (k) {
      if (!hdrs[k]) return;
      cmd += " \\\n  -H '" + k + ": " + hdrs[k].replace(/'/g, "'\\''") + "'";
    });
    if (current.method !== 'GET' && current.method !== 'DELETE') {
      const body = ($('aeBody').value || '').trim();
      if (body) {
        if (!hdrs['Content-Type']) cmd += " \\\n  -H 'Content-Type: application/json'";
        cmd += " \\\n  -d '" + body.replace(/'/g, "'\\''") + "'";
      }
    }
    return cmd;
  }

  $('aeCopyCurl').addEventListener('click', function () {
    const cmd = buildCurl();
    if (!cmd) return;
    navigator.clipboard.writeText(cmd).then(function () {
      $('aeCopyCurl').textContent = 'Copied!';
      setTimeout(function () { $('aeCopyCurl').textContent = 'Copy cURL'; }, 1200);
    });
  });

  $('aeSend').addEventListener('click', async function () {
    if (!current) return;
    const params = readKv($('aeParams'));
    const url = buildUrl(current, params);
    $('aeUrl').value = url;
    const hdrs = resolveHeaders();
    const opts = { method: current.method, headers: hdrs };
    if (current.method !== 'GET' && current.method !== 'HEAD') {
      const raw = ($('aeBody').value || '').trim();
      if (raw) {
        opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
        opts.body = raw;
      } else if (current.method === 'POST' || current.method === 'PUT') {
        opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
        opts.body = '{}';
      }
    }
    $('aeSend').disabled = true;
    $('aeRespHint').textContent = 'Sending…';
    switchTab('response');
    const t0 = performance.now();
    try {
      const res = await fetch(url, opts);
      const text = await res.text();
      const ms = Math.round(performance.now() - t0);
      let data;
      try { data = JSON.parse(text); } catch (e) { data = text; }
      $('aeHttp').textContent = res.status + ' ' + res.statusText;
      $('aeHttp').className = 'ae-pill ' + (res.ok ? 'ok' : 'err');
      $('aeTime').textContent = ms + ' ms';
      $('aeRespHint').textContent = url;
      $('aeResponse').textContent = typeof data === 'string' ? data : pretty(data);

      if (data && data.success && data.data && data.data.token) {
        $('aeToken').value = data.data.token;
        try { localStorage.setItem('sk_api_explorer_token', data.data.token); } catch (e) {}
      }
    } catch (err) {
      $('aeHttp').textContent = 'ERR';
      $('aeHttp').className = 'ae-pill err';
      $('aeTime').textContent = Math.round(performance.now() - t0) + ' ms';
      $('aeResponse').textContent = String(err);
    } finally {
      $('aeSend').disabled = false;
    }
  });

  // restore token
  try {
    const saved = localStorage.getItem('sk_api_explorer_token');
    if (saved) $('aeToken').value = saved;
  } catch (e) {}
  $('aeToken').addEventListener('change', function () {
    try { localStorage.setItem('sk_api_explorer_token', this.value.trim()); } catch (e) {}
  });

  renderList('');
  if (CATALOG.length) selectApi(CATALOG[0].id);
})();
</script>
