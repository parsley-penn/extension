'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isWord(syntaxTree) {
  return syntaxTree && syntaxTree.hasOwnProperty('word') && !syntaxTree.hasOwnProperty('children');
}

function isSentence(syntaxTree) {
  return syntaxTree && syntaxTree.label === 'S' && syntaxTree.hasOwnProperty('children');
}

function isPhrase(syntaxTree) {
  return syntaxTree && syntaxTree.label !== 'ROOT' && syntaxTree.hasOwnProperty('children');
}

function makeSafeLabel(label) {
  if (label === '``') {
    return 'left-double-quote';
  } else if (label === '\'\'') {
    return 'right-double-quote';
  } else if (label === '.') {
    return 'period';
  } else if (label === ',') {
    return 'comma';
  } else {
    return label;
  }
}

function getDisplayWord(word) {
  var map = {
    '-LRB-': '(',
    '-RRB-': ')',
    '``': '“',
    '\'\'': '”'
  };

  return map[word] || word;
}

function Word(props) {
  var safeLabel = makeSafeLabel(props.leaf.label);
  var displayWord = getDisplayWord(props.leaf.word);
  return React.createElement(
    'span',
    { className: 'word label-' + safeLabel },
    displayWord
  );
}

function Phrase(props) {
  var children = props.tree.children.map(function (child, index) {
    if (isWord(child)) {
      return React.createElement(Word, { key: index, leaf: child });
    } else if (isPhrase(child)) {
      return React.createElement(Phrase, { key: index, tree: child });
    } else {
      throw new Error('Unexpected child');
    }
  });

  return React.createElement(
    'span',
    { className: 'phrase label-' + props.tree.label },
    children
  );
}

var FormattedText = function (_React$Component) {
  _inherits(FormattedText, _React$Component);

  function FormattedText(props) {
    _classCallCheck(this, FormattedText);

    return _possibleConstructorReturn(this, (FormattedText.__proto__ || Object.getPrototypeOf(FormattedText)).call(this, props));
  }

  _createClass(FormattedText, [{
    key: 'render',
    value: function render() {
      var sentences = void 0;

      if (isSentence(this.props.tree)) {
        sentences = React.createElement(Phrase, { tree: this.props.tree });
      } else {
        sentences = this.props.tree.map(function (sentence, index) {
          return React.createElement(Phrase, { key: index, tree: sentence });
        });
      }

      return React.createElement(
        'div',
        { className: 'formattedText' },
        sentences
      );
    }
  }]);

  return FormattedText;
}(React.Component);

;

// Function for getting parts of query variable
// Source: http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryMap(query) {
  var vars = query.split('&');
  var map = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    map[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return map;
}

jQuery(function ($) {
  // Load text from JSON
  var query = getQueryMap(window.location.search.substring(1));

  var text = query['text'];

  $.getJSON('texts/' + text + '.json').done(function (data) {
    ReactDOM.render(React.createElement(FormattedText, { tree: data }), document.getElementById('root'));
  }).fail(function () {
    console.error('could not load json');
  });

  // Load formatting dynamically
  var formatting = query['formatting'];

  $('head').append('<link rel="stylesheet" type="text/css" href="css/formatting/' + formatting + '.css">');
});
//# sourceMappingURL=main.es6.js.map
