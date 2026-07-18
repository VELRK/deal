(function () {
  var depth = 0;
  var ignorePop = false;
  var closingFromPop = false;

  function pushOverlay() {
    try {
      history.pushState({ skOverlay: 1 }, '');
      depth++;
    } catch (e) {}
  }

  function closeOverlay() {
    if (depth <= 0) return;
    depth--;
    ignorePop = true;
    history.back();
  }

  function hideBootstrapOverlays() {
    var modal = document.querySelector('.modal.show');
    if (modal && window.bootstrap && window.bootstrap.Modal) {
      var inst = window.bootstrap.Modal.getInstance(modal);
      if (inst) {
        inst.hide();
        return;
      }
    }
    var canvas = document.querySelector('.offcanvas.show');
    if (canvas && window.bootstrap && window.bootstrap.Offcanvas) {
      var oc = window.bootstrap.Offcanvas.getInstance(canvas);
      if (oc) oc.hide();
    }
  }

  window.addEventListener('popstate', function () {
    if (ignorePop) {
      ignorePop = false;
      return;
    }
    if (depth <= 0) return;
    depth--;
    closingFromPop = true;
    window.dispatchEvent(new CustomEvent('sk-close-modal'));
    hideBootstrapOverlays();
  });

  function onBootstrapHidden() {
    if (closingFromPop) {
      closingFromPop = false;
      return;
    }
    closeOverlay();
  }

  document.addEventListener('shown.bs.modal', pushOverlay);
  document.addEventListener('shown.bs.offcanvas', pushOverlay);
  document.addEventListener('hidden.bs.modal', onBootstrapHidden);
  document.addEventListener('hidden.bs.offcanvas', onBootstrapHidden);

  window.skOverlay = {
    push: pushOverlay,
    close: closeOverlay,
  };
})();
