const TODOS_URL = 'https://5eecb0734cbc3400163308c9.mockapi.io/todos';

export default {
    getTodos,
    addTodo,
    deleteTodo,
    editTodo
};

function getTodos() {
    return fetch(TODOS_URL)
            .then(response => response.json());
}

function addTodo(todo) {
    return fetch(TODOS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            }).then(response => response.json());
}

function deleteTodo(id) {
    return fetch(TODOS_URL + '/' + id, {
                method: 'DELETE'
            }).then(response => response.json());
}

function editTodo(todo) {
    return fetch(TODOS_URL + '/' + todo.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    });
}