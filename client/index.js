const CodeMirror = require('codemirror');
const $ = require('jquery');
const markdownit = require('markdown-it');


require('codemirror/addon/mode/overlay');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/gfm/gfm');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');


global.jQuery = $;
require('bootstrap/js/modal');


/**
 * Storage keys
 */
const SK_TOKEN = 'ge_token';
const SK_EDITOR_WIDTH = 'ge_width';

$(() => {
  /**
   * ==================================================
   * Editor
   * ==================================================
   */
  const editor = CodeMirror.fromTextArea($('.editor')[0], {
    mode: 'gfm',
    lineNumbers: true,
    matchBrackets: true,
    theme: 'base16-light',
    extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
  });

  const md = markdownit({
    html: true
  });

  editor.on('change', () => {
    $('.preview').html(md.render(editor.doc.getValue()));
  });

  /**
   * ==================================================
   * Resize
   * ==================================================
   */
  const LEFT_OFFSET = parseInt($('.tools').width(), 10);
  let moving = false;

  $('.editor-container, .CodeMirror').width(localStorage.getItem(SK_EDITOR_WIDTH) || 400);

  $(document)
    .on('mousedown', '.resize', () => {
      moving = true;
    })
    .on('mousemove', event => {
      if (moving) {
        $('.editor-container, .CodeMirror').width(event.pageX - LEFT_OFFSET);
      }
    })
    .on('mouseup', () => {
      if (moving) {
        localStorage.setItem(SK_EDITOR_WIDTH, parseInt($('.editor-container').width(), 10));
      }
      moving = false;
    });

  /**
   * ==================================================
   * Settings
   * ==================================================
   */
  $(document)
    .on('show.bs.modal', '.settings-dlg', () => {
      $('.settings-dlg-token').val(localStorage.getItem(SK_TOKEN) || '');
    })
    .on('click', '.settings-dlg-save', () => {
      localStorage.setItem(SK_TOKEN, $('.settings-dlg-token').val());
    });

  /**
   * ==================================================
   * Load gist
   * ==================================================
   */
  $.urlParam = name => {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  };

  const id = $.urlParam('id');
  const name = $.urlParam('name');

  if (id && name) {
    $.get(`/gists/${id}`, response => {

      if (response.files && response.files[name]) {
        editor.doc.setValue(response.files[name].content);
        editor.refresh();
        editor.focus();

        if (response && response.owner && response.owner.login) {
          $('.open').attr('href', `https://gist.github.com/${response.owner.login}/${id}`);
        }
      }
    });
  }

  $('.save').click(() => {
    $.ajax({
      url: `/gists/${id}?access_token=${localStorage.getItem(SK_TOKEN)}`,
      data: JSON.stringify({
        files: {
          [name]: {
            content: editor.doc.getValue()
          }
        }
      }),
      type: 'PATCH',
      contentType: 'application/json'
    });
  });
});
