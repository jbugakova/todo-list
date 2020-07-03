import './styles.scss';

const dropdownBtn = document.querySelector('.panel__dropdown-btn');

dropdownBtn.addEventListener('click', onDropdownClick);

function onDropdownClick() {
    dropdownBtn.classList.toggle('open');
    document.querySelector('.panel__dropdown-list').classList.toggle('active');
}