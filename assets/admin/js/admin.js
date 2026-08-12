/* ShopKart Admin - Global JS */

// Confirm delete — name can be a display name OR a row element ID prefixed with '#'/'row-'
function skConfirmDelete(url, nameOrRowId) {
  var label = (nameOrRowId && String(nameOrRowId).startsWith('row-')) ? 'this item' : (nameOrRowId || 'this item');
  var isCustomerRow = nameOrRowId && String(nameOrRowId).startsWith('row-') && (url || '').indexOf('customers/delete') !== -1;
  var confirmMsg = isCustomerRow
    ? 'Permanently delete this customer?\n\n• Account, addresses, cart, wallet and reviews will be removed.\n• Order history is KEPT (customer link removed).\n\nThis cannot be undone.'
    : ('Delete "' + label + '"? This cannot be undone.');
  if (confirm(confirmMsg)) {
    $.ajax({
      url: url,
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res && res.success) {
          if (nameOrRowId && String(nameOrRowId).startsWith('row-')) {
            $('#' + nameOrRowId).fadeOut(300, function() { $(this).remove(); });
          } else {
            location.reload();
          }
          if (res.message) {
            alert(res.message);
          }
        } else {
          alert((res && res.message) ? res.message : 'Delete failed.');
        }
      },
      error: function(xhr) {
        var msg = 'Delete failed.';
        try {
          var body = xhr.responseJSON || JSON.parse(xhr.responseText || '{}');
          if (body && body.message) msg = body.message;
        } catch (e) {}
        if (xhr.status === 404) msg = 'Item not found or delete URL is invalid.';
        if (xhr.status === 403) msg = 'You do not have permission to delete this item.';
        alert(msg);
      }
    });
  }
}

// Toggle status
function skToggleStatus(url, btn) {
  $.post(url, {}, function(res) {
    if (res.success) location.reload();
  }, 'json');
}

// Ajax modal form submit
$(document).on('submit', '.sk-ajax-form', function(e) {
  e.preventDefault();
  var form = $(this);
  var formData = new FormData(this);
  $.ajax({
    url: form.attr('action'),
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(res) {
      if (res.success) {
        $('.modal').modal('hide');
        location.reload();
      } else {
        alert(res.message || 'An error occurred.');
      }
    }
  });
});

// Image preview
$(document).on('change', '.sk-img-preview-input', function() {
  var reader = new FileReader();
  var target = $(this).data('target');
  reader.onload = function(e) { $(target).attr('src', e.target.result).show(); };
  if (this.files[0]) reader.readAsDataURL(this.files[0]);
});

// Auto-generate slug from name
$(document).on('input', '#product_name', function() {
  var slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  $('#product_slug').val(slug);
});
