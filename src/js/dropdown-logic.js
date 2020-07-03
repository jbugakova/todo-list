const dropdownBtn = document.querySelector('.panel__dropdown-btn');
const dropdownList = document.querySelector('.panel__dropdown-list');
const dropdownOverlay = document.querySelector('.panel__dropdown-overlay');
// const dropdownItem = document.querySelectorAll('.panel__dropdown-list-item');

// document.querySelector('.panel__dropdown-btn .value').innerText = dropdownItem[0].innerText;

dropdownBtn.addEventListener('click', onDropdownClick);
dropdownList.addEventListener('click', ondropdownListClick);

function onDropdownClick() {
    dropdownBtn.classList.toggle('open');
    dropdownList.classList.toggle('active');
    dropdownOverlay.classList.toggle('active');
}

function ondropdownListClick(e) {
    if(e.target.classList.contains('panel__dropdown-list-item')) {
        document.querySelector('.panel__dropdown-btn .value').innerText = e.target.innerText;
        closeDropDown();
    }
}

dropdownOverlay.addEventListener('click', onDropdownOverlayClick);

function onDropdownOverlayClick() {
    closeDropDown();
}

function closeDropDown() {
    dropdownList.classList.remove('active');
    dropdownOverlay.classList.remove('active');
}