<script>
(function () {
  if (typeof Quill === 'undefined') return;
  window.blogQuill = new Quill('#quill-blog-content', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ]
    }
  });
})();
</script>
