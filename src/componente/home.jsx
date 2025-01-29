import { useState, useEffect } from "react";
import BotonOpciones from "./botonOpciones";
import { jwtDecode } from "jwt-decode";
import OrdenCompra from "./ordenCompra";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pago, setPago] = useState(""); // Monto pagado por el cliente
  const [cambio, setCambio] = useState(0); // Cambio a devolver
  const [userId, setUserId]=useState("");
  const [nombre, setNombre]=useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("Token:", token);
            
      try {
        // Aquí pasamos el token correctamente a la función jwtDecode
        const decodedToken = jwtDecode(token); 
        console.log("Token decodificado:", decodedToken);
        // Asumimos que el correo electrónico está en el campo "email" del payload del token
        setNombre(decodedToken.name || decodedToken.nombre);
        setUserId(decodedToken.userId)
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
  }, [token]);
  

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/producto");
        if (!response.ok) {
          throw new Error("Error al obtener productos");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const agregarProducto = (producto) => {
    setOrden((prevOrden) => {
      const existe = prevOrden.find((item) => item._id === producto._id);
      if (existe) {
        return prevOrden.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevOrden, { ...producto, cantidad: 1 }];
      }
    });
  };

  const calcularTotal = () => {
    return orden.reduce(
      (total, item) => total + (item.precio + calcularITBIS(item.precio)) * item.cantidad,
      0
    );
  };

  const calcularITBIS = (precio) => {
    return (precio * 18) / 100;
  };
  const handlePagoChange = (e) => {
    const montoPagado = parseFloat(e.target.value) || 0;
    setPago(montoPagado);
    setCambio(montoPagado - calcularTotal());
  };

  const guardarVenta = async () => {
    if (orden.length === 0) {
      alert("No hay productos en la orden.");
      return;
    }
    if (pago < calcularTotal()) {
      alert("El monto pagado no es suficiente.");
      return;
    }

    try {
      const venta = {
        items: orden.map((item) => ({
          quantity: item.cantidad,
          name: item.nombre,
          precio: item.precio,
          itbis: calcularITBIS(item.precio) * item.cantidad, // Guardar ITBIS en la base de datos
          precioConITBIS: (item.precio + calcularITBIS(item.precio)) * item.cantidad, // Precio con ITBIS incluido
        })),
        subtotal: parseFloat(new Intl.NumberFormat().format(calcularTotal() - orden.reduce((total, item) => total + calcularITBIS(item.precio) * item.cantidad, 0))) ,
        total: calcularTotal(),
        itbisTotal: orden.reduce((total, item) => total + calcularITBIS(item.precio) * item.cantidad, 0), // Total ITBIS
        pago: pago, 
        cambio: cambio,
        vendedor:{
          nombre,
          userId
        },
        date: new Date(),
      };

      const response = await fetch("http://localhost:3000/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error al guardar la venta:", errorMessage);
        throw new Error("Error al guardar la venta");
      }

      alert("Venta guardada correctamente");

      // Crear la factura en una nueva ventana
      const printWindow = window.open("", "PRINT", "height=600,width=800");
      printWindow.document.write(`
       <html>
  <head>
    <title>punto de venta</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }

      h4 {
        text-align: center;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th, td {
        padding: 10px;
        text-align: left;
      }

      /* Estilo para el hr con puntos */
      hr.new1 {
        border-top: 1px solid red;
      }

    </style>
  </head>
  <body>
    <h1>punto de venta</h1>
    <table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>ITBIS</th>
          <th>valor</th>
        </tr>
      </thead>
      <tbody>
        ${venta.items
          .map(
            (item) =>
              `<tr>
                <td>${item.quantity}:  ${item.name}</td>
                <td>${new Intl.NumberFormat().format(item.itbis)}</td>
                <td>${new Intl.NumberFormat().format(item.precioConITBIS)}</td>
              </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>subtotal:</th>
          <th>${new Intl.NumberFormat().format(calcularTotal() - orden.reduce((total, item) => total + calcularITBIS(item.precio) * item.cantidad, 0))}</th>
        </tr>
        <tr> 
          <th>totalItbs:</th>
          <th>$${new Intl.NumberFormat().format(venta.itbisTotal)}</th>
        </tr>
        <tr> 
          <th>total a pagar:</th>
          <th> ${new Intl.NumberFormat().format(calcularTotal())}</th>
        </tr>
        <tr> 
          <th>efectivo:</th>
          <th>$${pago}</th>
        </tr>
        <tr> 
          <th>cambio:</th>
          <th>$${cambio}</th>
        </tr>
      </thead>
    </table>

    <!-- Línea de puntos usando el hr estilizado -->
    <hr />

    <p>Le atendió: ${nombre}</p>
    <p>¡Gracias por su compra!</p>
  </body>
</html>

      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

      // Limpiar la orden de compra
      setOrden([]);
      setPago(0);
      setCambio(0);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la venta");
    }
  };

  const eliminarDeOrden = (index) => {
    setOrden((prevOrden) => prevOrden.filter((_, i) => i !== index));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="container">
        {nombre}
        <BotonOpciones />
        <div className="row">
          <div className="col-md-8">
            <h1 className="text-center mt-4 mb-5">Lista de comida</h1>
            <div className="row row-cols-1 row-cols-md-4 g-3">
              {productos.map((item) => (
                <div key={item._id}>
                  <img src={item.image} alt="img" height={150} width="90%" />
                  <h4 className="h4-product">{item.nombre}</h4>
                  <h6>${new Intl.NumberFormat().format(item.precio)}</h6>
                  <button
                    className="btn btn-primary"
                    onClick={() => agregarProducto(item)}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
             <OrdenCompra 
             orden={orden}
             calcularITBIS={calcularITBIS}
             calcularTotal={calcularTotal}
             eliminarDeOrden={eliminarDeOrden}
             pago={pago}
             handlePagoChange={handlePagoChange}
             cambio={cambio}
             guardarVenta={guardarVenta}/>
          </div>
        </div>
      </div>
    </div>
  );
}





