export default class AutoComplete {
    constructor() {
        this.autoCompleteFields = document.querySelectorAll('.auto-complete');
        this.events();
    }

    events() {
        let forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('keydown', e => {
                if (form.querySelector('.results-container.active')) {
                    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                    }
                }
            });
        });

        this.autoCompleteFields.forEach(field => {
            field.addEventListener('keyup', e => this.autoComplete(e, field.classList.contains('tags')));

            field.addEventListener('focus', () => {
                let data = JSON.parse(field.dataset.autoCompleteData);
                let resultsContainer = document.querySelector(`#${data.resultsContainer}`);
                resultsContainer.classList.add('active');
            });

            field.addEventListener('blur', () => {
                if (document.querySelector('.results-container.active:hover')) return;
                let data = JSON.parse(field.dataset.autoCompleteData);
                let resultsContainer = document.querySelector(`#${data.resultsContainer}`);
                resultsContainer.classList.remove('active');
            })
        });
    }

    autoComplete(e, isTags) {
        let elem = e.target;
        let data = elem.dataset.autoCompleteData;
        
        if (!data && JSON.parse(data).length == 0) return;

        data = JSON.parse(data);
        
        let value = elem.value;
        let results = [];
        let resultsContainer = document.querySelector(`#${data.resultsContainer}`);
        let resultsList = resultsContainer.querySelector('.results-list');
        let resultsListItems = resultsList.querySelectorAll('li');

        resultsListItems.forEach(item => {
            item.remove();
        });

        if (value.length > 0) {
            resultsContainer.classList.add('active');
        } else {
            resultsContainer.classList.remove('active');
        }

        data.data.forEach(item => {
            if (item.toLowerCase().includes(value.toLowerCase())) {
                results.push(item);
            }
        });

        results.forEach(result => {
            if (isTags) {
                let currentTags = elem.parentElement.parentElement.querySelectorAll('.tag');
                currentTags = Array.from(currentTags).map(tag => tag.innerText.slice(0, -2));
                if (currentTags.includes(result)) return;
            }
            let li = document.createElement('li');
            li.textContent = result;
            li.addEventListener('click', () => {
                elem.value = result;
                resultsContainer.classList.remove('active');
                if (isTags) { elem.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '})); }
            });
            resultsList.appendChild(li);
        });

        if (results.length === 0) {
            if (isTags) { 
                resultsContainer.classList.remove('active'); 
                return;
            }
            
            let li = document.createElement('li');
            li.textContent = 'No results found.';
            resultsList.appendChild(li);
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (results.length > 0) {
                elem.value = results[0];
                resultsContainer.classList.remove('active');
                if (isTags) { elem.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '})); }
            }
        }

        if (e.key === 'Escape') {
            resultsContainer.classList.remove('active');
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            let active = resultsList.querySelector('.active');
            if (active) {
                active.classList.remove('active');
                if (active.previousElementSibling) {
                    active.previousElementSibling.classList.add('active');
                } else {
                    resultsList.lastElementChild.classList.add('active');
                }
            } else {
                resultsList.lastElementChild.classList.add('active');
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let active = resultsList.querySelector('.active');
            if (active) {
                active.classList.remove('active');
                if (active.nextElementSibling) {
                    active.nextElementSibling.classList.add('active');
                } else {
                    resultsList.firstElementChild.classList.add('active');
                }
            } else {
                resultsList.firstElementChild.classList.add('active');
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            let active = resultsList.querySelector('.active');
            if (active) {
                elem.value = active.textContent;
                resultsContainer.classList.remove('active');
                if (isTags) { elem.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '})); }
            }
        }
    }
}