import {ADD_TODO, DONE_TODO,REMOVE_TODO} from "../actions/index";

// https://github.com/reactjs/react-redux/blob/d5bf492ee35ad1be8ffd5fa6be689cd74df3b41e/src/components/createConnect.js#L91
const initialState = {
        "Pasta Carbonara" :{
            price:'12',
            quantity:'0',
            status:'done'
        } ,
        "ABC" :{
            price:'17',
            quantity:'0',
            status:'active',
    } ,
        "DEF" :{
            price:'23',
            quantity:'0',
            status:'active',
    } ,
        "XYZ" :{
            price:'20',
            quantity:'0',
            status:'active',
    } ,
        "LMN" :{
            price:'10',
            quantity:'0',
            status:'active',
    } ,
};



const todos = (state = initialState, action) => {


    switch (action.type) {
        case ADD_TODO :
           return {
               ...state,
               [action.newItem] : 'active'
           };

        case DONE_TODO :
            return {
                ...state,
                [action.changedTodo.todo] : {price:action.changedTodo.price, quantity: parseInt(action.changedTodo.quantity)+1,
                    status:'done'}
            };
        case REMOVE_TODO :
            return {
                ...state,
                [action.changedTodo.todo] : {price:action.changedTodo.price,quantity:parseInt(action.changedTodo.quantity)-1,
                    status:'active'}
            };

        default :
            return state;

    }
};

export default todos;