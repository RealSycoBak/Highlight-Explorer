function debounce(fn, delay) {
    let timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

async function fetchDefinition(word) {
    try {
        const response = await fetch(`${API_URL}${word}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        return data[0].meanings[0].definitions[0].definition; 
    } catch (error) {
        console.error('Error fetching definition:', error);
        return null;
    }
}

const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '4px';
tooltip.style.zIndex = '1000';
tooltip.style.display = 'none';
tooltip.style.userSelect = 'none'; 
tooltip.style.pointerEvents = 'none'; 
document.body.appendChild(tooltip);

let isTooltipVisible = false;

document.addEventListener("selectionchange", debounce(async function () {
    const selection = document.getSelection().toString();
    if (selection) {
        const definition = await fetchDefinition(selection);
        if (definition) {
            tooltip.innerText = `Definition of "${selection}": ${definition}`;
            const range = document.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + 25}px`; 
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5 - 25}px`;
            tooltip.style.display = 'block';
            isTooltipVisible = true;
        }
    } else {
        if (isTooltipVisible) {
            tooltip.style.display = 'none'; 
            isTooltipVisible = false;
        }
    }
}));

document.addEventListener('click', (event) => {
    if (!tooltip.contains(event.target) && !document.getSelection().toString()) {
        tooltip.style.display = 'none';
        isTooltipVisible = false;
    }
});
