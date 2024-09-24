function debounce(fn, delay) {
    let timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };
  
  const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  
  async function fetchDefinition(word) {
    try {
        const response = await fetch(`${API_URL}${word}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        return data[0].meanings[0].definitions[0].definition; // Adjust according to the API response structure
    } catch (error) {
        console.error('Error fetching definition:', error);
        return null;
    }
}

document.addEventListener("selectionchange", debounce(async function () {
    let selection = document.getSelection ? document.getSelection().toString() : document.selection.createRange().toString();
    if (selection!="") {
        const definition = await fetchDefinition(selection);
        if (definition) {
            alert(`Definition of "${selection}": ${definition}`);
        } else {
            alert(`No definition found for "${selection}"`);
        }
    }
}, 250));