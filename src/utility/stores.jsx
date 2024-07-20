import {useReducer, createContext} from 'react'


export const Store = createContext();

// el estado inicial de nuestra aplicacion o variable de estado
 const initialState = {
    cart:{
        cartItems: [],
    }
    
}
//funcion reductora donde se crea la logica funcional
function reducer(state, action){
    switch (action.type) {
        case 'ADD_TO_CART': {
            const newItem = action.payload 
            const existItem = state.cart.cartItems.find(item => item.id ===  newItem.id)

            const cartItems = existItem ? state.cart.cartItems.map((item)=> item.name === existItem.name ? newItem: item )
            : [...state.cart.cartItems, newItem]

            return {...state, cart:{...state.cart,cartItems}}

        }

        case 'CART_REMOVE_ITEM' :{
            const cartItems = state.cart.cartItems.filter(
                (item => item.id !== action.payload.id)
            )

            return {...state , cart:{...state.cart, cartItems}}
        }

        case 'REMOVE_CART' :{
            const cartItems = []
            return {...state, cart:{...state.cart, cartItems}}
        }

    
        default:
            return state;
    }
}

//funcion para crear el store y envolver a los componentes hijos
export function StoreProvider({children}){
    const [state, dispatch] = useReducer(reducer, initialState)
    
    return <Store.Provider value={{state,dispatch}}>{children}</Store.Provider>
}