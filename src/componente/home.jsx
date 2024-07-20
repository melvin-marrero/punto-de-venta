import { useContext } from "react"
import data from "../data/data"
import { Store } from "../utility/stores"
import appFirebase from "../credenciales";
import { getFirestore,collection,addDoc } from "firebase/firestore";

const db=getFirestore(appFirebase);

export default function Home() {
  const {state,dispatch}=useContext(Store);
  const {cart:{cartItems}}=state;

  function addToCart(id){

    const product = data.products.find(x => x.id === id)
    const existItem = state.cart.cartItems.find(x => x.id === product.id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    dispatch({type: 'ADD_TO_CART', payload: { ...product, quantity}})
  }

  function delToCart(id){
    dispatch({type: 'CART_REMOVE_ITEM', payload: id})
  }
  async function guardarVenta (){
     try {
      await addDoc(collection(db,"ventas"),{
        ...arreglo,subtotal
      })
     } catch (error) {
      alert("ocurio un error");
      console.log(error);
     }
     dispatch({type: 'REMOVE_CART'})
     alert('guardado con exito')
  }
  const subtotal = cartItems.reduce((a,c)=> a+c.quantity*c.precio,0);
  const arreglo = cartItems;
  return (
    <div>
      <div className="container">
        <div className="row">
            <div className="col-md-8">
              <h1 className="text-center mt-4 mb-5">lista de comida</h1>
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {data.products.map((item)=>{
                    return (
                      <div key={item.id}>
                        <img src={item.image} alt="img"height={200} width="100%"/>
                        <h4>{item.name}</h4>
                        <h6>${new Intl.NumberFormat().format(item.precio)}</h6>
                        <button className="btn btn-primary"
                        onClick={()=>addToCart(item.id)}>agregar</button>
                      </div>
                    )
                 })
                }
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-body mt-5">
                <h3 className="text-center">Orden de compra</h3>
                <div className="row">
                  <div className="col-md-6">
                    <h6>descripcion</h6>
                  </div>
                  <div className="col-md-3">
                    <h6>ITBIS</h6>
                  </div>
                  <div className="col-md-3">
                    <h6>valor</h6>
                  </div>
                  <hr />
                </div>
                {cartItems.map((item)=>(
                  <div key={item.id}>
                    <div className="row">
                      <div className="col-md-6">
                        <h6>{item.quantity}: {item.name}</h6>
                      </div>
                      <div className="col-md-3">
                       <h6>0.00</h6> 
                      </div>
                      <div className="col-md-3">
                        <div className="content">
                          <h6>${item.precio}</h6> <button onClick={()=>delToCart(item)}>x</button>
                        </div>
                      </div>
                    </div>

                  </div>
                 ))
                }
                <div className="total">subTotal: ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.precio, 0)}
                </div>
                {cartItems.length ?(<button className="btn btn-success" 
                onClick={guardarVenta}>
                  guardar venta
                 </button>):
                 (<button className="btn btn-secondary">
                   guardar venta
                 </button>)
                }
              </div>
            </div>
        </div>
      </div>
      <footer className="bg-dark p-3 mt-5">
        <p className="text-center text-white">todo los derechos reservados 2024.&#169;</p>
      </footer>
    </div>
  )
}
