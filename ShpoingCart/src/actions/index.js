export const ADD_TODO = 'ADD_TODO';
export const DONE_TODO = 'DONE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';



export function addTodo(newItem) {
    return {
        type : ADD_TODO,
        newItem                                // this is same as newItem : newItem in ES6
    }
}

export function removeTodo(changedTodo) {
    return {
        type : REMOVE_TODO,
        changedTodo                                // this is same as newItem : newItem in ES6
    }
}

export function doneTodo(changedTodo) {
    return {
        type : DONE_TODO,
        changedTodo
    }
}


export function removeAll(arr) {
    return arr.reduce((total, obj) => {
        removeTodo(obj);
    });
}

