

export default function OrdenCompra({
  orden,calcularITBIS,calcularTotal,eliminarDeOrden,
  pago,handlePagoChange,cambio,guardarVenta,
}) {
  return (
    <div className="orden-compra">
      <div className="card card-body mt-5">
        <h3 className="text-center">Orden de compra</h3>
        <div className="row">
          <div className="col-md-5">
            <h6>Descripción</h6>
          </div>
          <div className="col-md-3">
            <h6>ITBIS</h6>
          </div>
          <div className="col-md-4">
            <h6>Valor</h6>
          </div>
          <hr />
        </div>
        {orden.map((item, index) => (
          <div className="row" key={index} >
            <div className="col-md-5 text-item">
              <p className="p-decri">{item.cantidad}:</p>
              <p className="p-decri">{item.nombre}</p>
            </div>
            <div className="col-md-3 text-item">
              ${new Intl.NumberFormat().format(calcularITBIS(item.precio) * item.cantidad)}
            </div>
            <div className="col-md-4 text-item">
              ${new Intl.NumberFormat().format((item.precio + calcularITBIS(item.precio)) * item.cantidad)}
              <button
                className="btn-eliminar"
                onClick={() => eliminarDeOrden(index)}
              >
                x
              </button>
            </div>
          </div>
        ))}
        <hr />
        <div className="row">
          <div className="col-md-12 total ">
           <p> Subtotal: </p>
           <p>${new Intl.NumberFormat().format(
              calcularTotal() -
                orden.reduce((total, item) => total + calcularITBIS(item.precio) * item.cantidad, 0)
              )}
            </p>
            
          </div>
          <div className="col-md-12 total ">
            <p>totalItb: </p>
            <p>${new Intl.NumberFormat().format(
              orden.reduce((total, item) => total + calcularITBIS(item.precio) * item.cantidad, 0)
              )}
            </p>
            
          </div>
          <div className="col-md-12 total ">
            <p>total a pagar:</p>
            <p>${new Intl.NumberFormat().format(calcularTotal())}</p>
          </div>
        </div>
        <div className="row mt-3">
          <label htmlFor="pago">Pago:</label>
          <input
            type="number"
            id="pago"
            value={pago}
            onChange={handlePagoChange}
            className="form-control"
            placeholder="000.0"
          />
          <p className="mt-2">Cambio: ${cambio >= 0 ? cambio : 0}</p>
        </div>
        <button className="btn btn-success mt-3" onClick={guardarVenta}>
          Guardar venta
        </button>
      </div>
    </div>
  );
}
