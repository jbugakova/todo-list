import '../scss/styles.scss';

import api from './api';

const dropdownBtn = document.querySelector('.panel__dropdown-btn');
const dropdownList = document.querySelector('.panel__dropdown-list');
const dropdownOverlay = document.querySelector('.panel__dropdown-overlay');
const addTaskForm = document.querySelector('#addTaskForm');
const todoListItemTemplate = document.querySelector('#todoListItemTemplate').innerHTML;
const todoList = document.querySelector('#todoList');
const todoInput = document.querySelector('.add-task-form__input');

let todos = [];

init();

document.querySelector('.panel_propdown-conatiner').addEventListener('click', onDropdownClick);
addTaskForm.addEventListener('submit', onAddTaskFormSubmit);
todoList.addEventListener('click', onListClick);

function onDropdownClick(e) {
    var target = e.target;
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
            .then(renderTodo)
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

function init() {
    getTodos();
}

function getTodos() {
    api.getTodos()
        .then(setTodos)
        .then(renderTodos)
        .then(displayActiveTasksQuantity);
}

function setTodos(data) {
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
        todoElement.classList.add('list__item-done');
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
    dropdownBtn.classList.toggle('open');
    dropdownList.classList.toggle('active');
    dropdownOverlay.classList.toggle('active');
}

function ondropdownListClick(text, value) {
    switchBtnText(text);
    closeDropDown();
    showSortedList(value);
}

function showSortedList(value) {
    todoList.innerHTML = '';
    if(value === 'all') {
        renderTodos(todos);
    } else if(value === 'completed') {
        renderTodos(todos.filter(item => item.completed === true));
    } else if(value === 'incompleted') {
        renderTodos(todos.filter(item => item.completed === false));
    }
}

function switchBtnText(text) {
    document.querySelector('.panel__dropdown-btn .value').innerText = text;
}

function onDropdownOverlayClick() {
    closeDropDown();
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
    currElem.classList.toggle('list__item-done');
} 