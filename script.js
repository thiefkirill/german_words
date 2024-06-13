// Функція для створення елемента слова
function createWordElement(ukrainian, german, color) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.setAttribute('data-original', ukrainian);
    wordElement.setAttribute('data-translation', german);
    wordElement.style.backgroundColor = color;
    wordElement.innerHTML = ukrainian;

    wordElement.addEventListener('dblclick', () => {
        if (wordElement.classList.contains('selected')) {
            wordElement.classList.remove('selected');
            wordElement.style.backgroundColor = color;
        } else {
            wordElement.classList.add('selected');
            wordElement.style.backgroundColor = '#dcdcdc';
        }
    });

    wordElement.addEventListener('click', () => {
        const original = wordElement.getAttribute('data-original');
        const translation = wordElement.getAttribute('data-translation');
        const currentText = wordElement.innerHTML;

        if (currentText === original) {
            wordElement.innerHTML = translation;
        } else {
            wordElement.innerHTML = original;
        }
    });

    return wordElement;
}

// Завантаження слів з LocalStorage
function loadWords() {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    words.forEach(word => {
        const wordElement = createWordElement(word.ukrainian, word.german, word.color);
        document.querySelector('.word-list').appendChild(wordElement);
    });
}

// Збереження слів до LocalStorage
function saveWord(ukrainian, german, color) {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    words.push({ ukrainian, german, color });
    localStorage.setItem('words', JSON.stringify(words));
}

// Видалення обраних слів та оновлення LocalStorage
function deleteSelectedWords() {
    const selectedWords = document.querySelectorAll('.word.selected');
    selectedWords.forEach(word => {
        const ukrainianWord = word.getAttribute('data-original');
        deleteWord(ukrainianWord);
        word.remove();
    });
}

// Видалення слова та оновлення LocalStorage
function deleteWord(ukrainianWord) {
    const words = JSON.parse(localStorage.getItem('words')) || [];
    const updatedWords = words.filter(word => word.ukrainian !== ukrainianWord);
    localStorage.setItem('words', JSON.stringify(updatedWords));
}

// Завантаження фонового зображення з LocalStorage
function loadBackground() {
    const background = localStorage.getItem('background');
    if (background) {
        document.body.style.backgroundImage = `url(${background})`;
    }
}

// Збереження фонового зображення до LocalStorage
function saveBackground(url) {
    localStorage.setItem('background', url);
    document.body.style.backgroundImage = `url(${url})`;
}

// Відображення повідомлення про помилку
function showError(message) {
    const errorBox = document.getElementById('error-box');
    errorBox.innerHTML = message;
    errorBox.style.display = 'block';
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    loadWords();
    loadBackground();

    document.getElementById('add-word-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const ukrainianWord = document.getElementById('ukrainian-word').value;
        const germanWord = document.getElementById('german-word').value;
        const wordColor = document.getElementById('word-color').value;

        // Перевірка введених слів
        if (!/^[А-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(ukrainianWord)) {
            showError('Українське слово має містити тільки українські літери.');
            return;
        }
        
        if (!/^[A-Za-zÄäÖöÜüß\s]+$/.test(germanWord)) {
            showError('Німецьке слово має містити тільки німецькі літери.');
            return;
        }

        const newWordElement = createWordElement(ukrainianWord, germanWord, wordColor);
        document.querySelector('.word-list').appendChild(newWordElement);

        saveWord(ukrainianWord, germanWord, wordColor);

        document.getElementById('ukrainian-word').value = '';
        document.getElementById('german-word').value = '';
        document.getElementById('word-color').value = '#e7e7e7';
    });

    document.getElementById('delete-selected').addEventListener('click', deleteSelectedWords);

    // Обробник події для завантаження фонового зображення
    document.getElementById('background-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveBackground(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});
