import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export default function BotonOpciones() {
    const [ventas, setVentas] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId]=useState("");
    const [nombre, setNombre]=useState("");
    const token = localStorage.getItem("token");
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
      };

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

      const generarReporte = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/ventas/reporteVentas/${userId}`);
            const data = await response.json();
            console.log("Datos recibidos del backend:", data); // Verificar datos
    
            setVentas(data.ventas);
            setTotal(data.total);
    
            // Mostrar el reporte en una nueva ventana para impresión
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head><title>Reporte de Ventas</title></head>
                    <body>
                        <h6>Reporte de Ventas</h6>
                        <h2>Vendedor: ${nombre}</h2>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ventas.map((venta) => {
                                    // Acceder a los items dentro de cada venta
                                    return venta.items.map((item, index) => {  
                                        return `
                                        <tr key=${venta._id + '-' + index}>
                                            <td>${new Date(venta.date).toLocaleString()}</td>  
                                            <td>${item.name || 'Producto no disponible'}</td>  
                                            <td>${item.quantity || 'N/A'}</td>  
                                            <td>${item.precioConItebis || 'N/A'}</td> 
                                        </tr>`;
                                    }).join('');
                                }).join('')}
                            </tbody>
                        </table>
                        <h3>Total de ventas del día: $${total}</h3>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        } catch (error) {
            console.error('Error al generar el reporte:', error);
        }
    };
    
    return (
    <>
        <button class="btn-user  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <iconify-icon icon="mdi:account-circle" width="24" height="24"></iconify-icon>
        </button>
        <ul class="dropdown-menu">
           <li><p class="dropdown-item" onClick={generarReporte}>reporte de venta</p></li>
           <li><p class="dropdown-item" onClick={logout}>serrar seccion</p></li>
        </ul>
    </>
    )
}