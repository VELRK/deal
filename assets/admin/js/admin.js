/* ShopKart Admin - Global JS */

// Confirm delete — name can be a display name OR a row element ID prefixed with '#'/'row-'
function skConfirmDelete(url, nameOrRowId) {
  var label = (nameOrRowId && nameOrRowId.startsWith('row-')) ? 'this item' : nameOrRowId;
  if (confirm('Delete "' + label + '"? This cannot be undone.')) {
    $.post(url, {}, function(res) {
      if (res.success) {
        if (nameOrRowId && nameOrRowId.startsWith('row-')) {
          $('#' + nameOrRowId).fadeOut(300, function() { $(this).remove(); });
        } else {
          location.reload();
        }
      } else {
        alert('Delete failed.');
      }
    }, 'json');
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
