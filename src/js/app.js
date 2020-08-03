import api from './api';

const LIST_ITEM_DONE_CLASS = 'list__item-done';
const dropdownBtn = document.querySelector('.panel__dropdown-btn');
const dropdownList = document.querySelector('.panel__dropdown-list');
const dropdownOverlay = document.querySelector('.panel__dropdown-overlay');
const addTaskForm = document.querySelector('#addTaskForm');
const todoListItemTemplate = document.querySelector('#todoListItemTemplate').innerHTML;
const todoList = document.querySelector('#todoList');
const todoInput = document.querySelector('.add-task-form__input');
let todos = [];

init();

window.onload = function() { document.body.classList.add('loaded') };
document.querySelector('.panel_propdown-conatiner').addEventListener('click', onDropdownClick);
addTaskForm.addEventListener('submit', onAddTaskFormSubmit);
todoList.addEventListener('click', onListClick);

function init() {
    getTodos();
}

function onDropdownClick(e) {
    const target = e.target;
    switch(true) {
        case(target.classList.contains('panel__dropdown-btn') || target.classList.contains('arrow') || target.classList.contains('value')):
            onDropdownBtnClick();
            break;
        case(target.classList.contains('panel__dropdown-list-item')):
            ondropdownListClick(target.innerText, target.dataset.value);
            break;
        case(target.classList.contains('panel__dropdown-overlay')):
            onDropdownOverlayClick();
            break;
    }
}

function onListClick(e) {
    const target = e.target;

    if(target.closest('.list__btn')) {
        const id = target.closest('.list__item').dataset.id;

        if(target.closest('.list__btn-delete')) {
            deleteTodo(id);
        } else if(target.closest('.list__btn-done')) {
            toggleCompletedProperty(id);
        }
    }
}

function onAddTaskFormSubmit(e) {
    e.preventDefault();
    const input = getInputValue();

    if(input) {
        const todo = {
            title: input
        };

        api.addTodo(todo)
            .then(addTodoToArray)
            .then(renderTodoElement)
            .then(displayActiveTasksQuantity);

        addTaskForm.reset();
    }
}

function deleteTodo(id) {
    api.deleteTodo(id)
        .then(deleteTodoFromArray)
        .then(displayActiveTasksQuantity);

    deleteElemFromPage(id);
}

function deleteTodoFromArray(elem) {
    todos = todos.filter(todo => todo.id != elem.id);
}

function deleteElemFromPage(id) {
    const el = getDOMElementByDataId(id);
    el.remove();
}

function renderTodoElement(todo) {
    if(todoList.dataset.show !== 'completed') {
        renderTodo(todo);
    }
}

function getDOMElementByDataId(id) {
    return document.querySelector(`.list__item[data-id='${id}']`);
}

function getInputValue() {
    return todoInput.value.trim();
}

function addTodoToArray(todo) {
    todos.push(todo);

    return todo;
}

function getTodos() {
    api.getTodos()
        .then(setTodos)
        .then(renderTodos)
        .then(displayActiveTasksQuantity);
}

function setTodos(data) {
    console.log(data);
    return (todos = data);
}

function renderTodos(todos) {
    todos.map(renderTodo);
}

function renderTodo(todo) {
    const html = todoListItemTemplate.replace('{{id}}', todo.id)
                                        .replace('{{todo}}', todo.title);

    const todoElement = htmlToElement(html);
    if(todo.completed) {
        todoElement.classList.add(LIST_ITEM_DONE_CLASS);
    }

    todoList.append(todoElement);
}

function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    return template.content.firstChild;
}

function displayActiveTasksQuantity() {
    const incompletedQuantity = todos.filter(todo => todo.completed == false).length;
    document.getElementById('activeTasksQuantity').innerText = incompletedQuantity;
}

function onDropdownBtnClick() {
    toggleDropDownBtnOpenClass();
    dropdownList.classList.toggle('active');
    dropdownOverlay.classList.toggle('active');
}

function ondropdownListClick(text, value) {
    switchBtnText(text);
    closeDropDown();
    showSortedList(value);
    toggleDropDownBtnOpenClass();
}

function toggleDropDownBtnOpenClass() {
    dropdownBtn.classList.toggle('open');
}

function showSortedList(value) {
    todoList.innerHTML = '';
    let currList;

    if(value === 'all') {
        todoList.dataset.show = 'all';
        currList = todos;
    } else if(value === 'completed') {
        todoList.dataset.show = 'completed';
        currList = todos.filter(item => item.completed === true);
    } else if(value === 'incompleted') {
        todoList.dataset.show = 'incompleted';
        currList = todos.filter(item => item.completed === false);
    }

    renderTodos(currList);
}

function switchBtnText(text) {
    document.querySelector('.panel__dropdown-btn .value').innerText = text;
}

function onDropdownOverlayClick() {
    closeDropDown();
    toggleDropDownBtnOpenClass();
}

function closeDropDown() {
    dropdownList.classList.remove('active');
    dropdownOverlay.classList.remove('active');
}

function toggleCompletedProperty(id) {
    const currTodo = todos.find(todo => todo.id === id);
    currTodo.completed = !currTodo.completed;

    api.editTodo(currTodo)
        .then(displayActiveTasksQuantity);

    const currElem = getDOMElementByDataId(id);

    if((todoList.dataset.show === 'incompleted' && currTodo.completed) || (todoList.dataset.show === 'completed' && !currTodo.completed)) {
        currElem.remove();
    } else if(todoList.dataset.show === 'all') {
        currElem.classList.toggle(LIST_ITEM_DONE_CLASS);
    }
}