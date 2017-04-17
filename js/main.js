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
  }
  
  return map[word] || word;
}

function Word(props) {
  const safeLabel = makeSafeLabel(props.leaf.label);
  const displayWord = getDisplayWord(props.leaf.word);
  return (
    <span className={ 'word label-' + safeLabel }>
      { displayWord }
    </span>
  );
}

function Phrase(props) {
  const children = props.tree.children.map((child, index) => {
    if (isWord(child)) {
      return <Word key={index} leaf={child} />;
    } else if (isPhrase(child)) {
      return <Phrase key={index} tree={child}/>
    } else {
      throw new Error('Unexpected child');
    }
  });

  return (
    <span className={ 'phrase label-' + props.tree.label }>
      { children }
    </span>
  );
}

class FormattedText extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let sentences;
    
    if (isSentence(this.props.tree)) {
      sentences = <Phrase tree={this.props.tree} />;
    } else {
      sentences = this.props.tree.map((sentence, index) => {
        return <Phrase key={index} tree={sentence} />;
      });
    }
    
    return (
      <div className="formattedText">
        {sentences}
      </div>
    );
  }
};

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

jQuery(function($){
  // Load text from JSON
  const query = getQueryMap(window.location.search.substring(1));

  const text = query['text'];

  $.getJSON(`texts/${text}.json`)
    .done(function(data) {
      ReactDOM.render(
        <FormattedText tree={ data } />,
        document.getElementById('root')
      );
    })
    .fail(function() {
      console.error('could not load json');
    });

  // Load formatting dynamically
  const formatting = query['formatting'];

  $('head').append(`<link rel="stylesheet" type="text/css" href="css/formatting/${formatting}.css">`);
});