import React, { useState, useEffect } from "react";
import logo from "./assets/ISO_Mesa de trabajo 1.png";

const BACKEND_URL = "https://comprobante-backend-production.up.railway.app"; // Cambia esto por tu URL real

export default function App() {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    tipoCambio: "",
    montoCLP: "",
    montoFinal: "",
    monedaDestino: "COP"
  });
  const [showComprobante, setShowComprobante] = useState(false);
  const [ultimosEnvios, setUltimosEnvios] = useState([]);
  const [loadingEnvios, setLoadingEnvios] = useState(true);

  const monedas = [
    { label: "Pesos Colombianos (COP)", value: "COP", simbolo: "$" },
    { label: "Pesos Argentinos (ARS)", value: "ARS", simbolo: "$" },
    { label: "Soles Peruanos (PEN)", value: "PEN", simbolo: "S/" },
    { label: "Bolívares (VES)", value: "VES", simbolo: "Bs." },
    { label: "Dólares Americanos (USD)", value: "USD", simbolo: "US$" },
  ];

  // Trae los últimos 10 envíos al cargar el componente o cuando se genera un comprobante nuevo
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/envios`)
      .then((res) => res.json())
      .then((data) => {
        setUltimosEnvios(data.slice(0, 10));
        setLoadingEnvios(false);
      })
      .catch(() => setLoadingEnvios(false));
  }, [showComprobante]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Guarda en backend
      const res = await fetch(`${BACKEND_URL}/api/envios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowComprobante(true);
      } else {
        alert("Hubo un problema al guardar. Intenta de nuevo.");
      }
    } catch (err) {
      alert("Error al guardar en la base de datos.");
      console.error(err);
    }
  };

  const handleEdit = () => setShowComprobante(false);

  const printComprobante = () => window.print();

  const montoFinal =
    form.montoCLP && form.tipoCambio && !isNaN(form.montoCLP) && !isNaN(form.tipoCambio)
      ? (parseFloat(form.montoCLP) / parseFloat(form.tipoCambio))
      : "";

  const simboloDestino = monedas.find(m => m.value === form.monedaDestino)?.simbolo || "";

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Generar Comprobante de Envío</h2>
      <div className="row">
        {/* Columna formulario */}
        <div className="col-md-6">
          {!showComprobante ? (
            <form className="p-4 border rounded shadow mx-auto" style={{ maxWidth: 500 }} onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre completo beneficiario</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cédula/ID/Pasaporte</label>
                <input
                  type="text"
                  className="form-control"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Banco Destino</label>
                <input
                  type="text"
                  className="form-control"
                  name="banco"
                  value={form.banco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de cuenta</label>
                <select
                  className="form-select"
                  name="tipoCuenta"
                  value={form.tipoCuenta}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona...</option>
                  <option>Corriente</option>
                  <option>Ahorros</option>
                  <option>Digital</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Número de Cuenta</label>
                <input
                  type="text"
                  className="form-control"
                  name="numeroCuenta"
                  value={form.numeroCuenta}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Monto a enviar (Pesos chilenos - CLP)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  name="montoCLP"
                  value={form.montoCLP}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de cambio (CLP a destino)</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  className="form-control"
                  name="tipoCambio"
                  value={form.tipoCambio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Moneda de destino</label>
                <select
                  className="form-select"
                  name="monedaDestino"
                  value={form.monedaDestino}
                  onChange={handleChange}
                  required
                >
                  {monedas.map(mon => (
                    <option key={mon.value} value={mon.value}>{mon.label}</option>
                  ))}
                </select>
              </div>
              {/* Previsualización del cálculo */}
              {form.montoCLP && form.tipoCambio && !isNaN(montoFinal) && (
                <div className="alert alert-info py-2">
                  Monto a recibir aprox: <strong>{simboloDestino} {montoFinal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              )}
              <button type="submit" className="btn btn-primary w-100">
                Generar Comprobante
              </button>
            </form>
          ) : (
            <div className="p-4 border rounded shadow mx-auto" style={{ maxWidth: 500, background: "white" }}>
              <div className="text-center mb-4">
                {/* Logo en la parte superior */}
                <img
                  src={logo}
                  alt="AV Finance logo"
                  style={{ width: "70%", maxWidth: 320, marginBottom: 12 }}
                />
                <h4 className="mb-1">Comprobante de Envío</h4>
                <small>{new Date().toLocaleString()}</small>
              </div>
              <hr />
              <div>
                <p><strong>Beneficiario:</strong> {form.nombre}</p>
                <p><strong>Cédula/ID:</strong> {form.cedula}</p>
                <p><strong>Banco Destino:</strong> {form.banco}</p>
                <p><strong>Tipo de Cuenta:</strong> {form.tipoCuenta}</p>
                <p><strong>Número de Cuenta:</strong> {form.numeroCuenta}</p>
                <p><strong>Monto enviado (CLP):</strong> ${parseFloat(form.montoCLP).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Tipo de cambio aplicado:</strong> {parseFloat(form.tipoCambio).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
                <p><strong>Monto a recibir ({form.monedaDestino}):</strong> {simboloDestino} {parseFloat(montoFinal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={handleEdit}>Editar</button>
                <button className="btn btn-success" onClick={printComprobante}>
                  Imprimir Comprobante
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna tabla de últimos envíos */}
        {/* Columna tabla de últimos envíos */}
        <div className="col-md-6">
          <div className="p-3 border rounded shadow" style={{ minHeight: 600, borderColor: "#ee8888" }}>
            <h5 className="mb-3">Últimos 10 comprobantes</h5>
            {loadingEnvios ? (
              <div>Cargando...</div>
            ) : ultimosEnvios.length === 0 ? (
              <div>No hay comprobantes registrados aún.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Beneficiario</th>
                      <th>Banco</th>
                      <th>Monto (CLP)</th>
                      <th>Tipo cambio</th>
                      <th>Final</th>
                      <th>Moneda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosEnvios.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontSize: "0.9em" }}>{item.fecha ? new Date(item.fecha).toLocaleString() : ""}</td>
                        <td>{item.nombre}</td>
                        <td>{item.banco}</td>
                        <td>
                          {item.montoCLP !== undefined && item.montoCLP !== null
                            ? "$" + parseFloat(item.montoCLP).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : ""}
                        </td>
                        <td>
                          {item.tipoCambio !== undefined && item.tipoCambio !== null
                            ? parseFloat(item.tipoCambio).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                            : ""}
                        </td>
                        <td>
                          {item.montoFinal !== undefined && item.montoFinal !== null
                            ? parseFloat(item.montoFinal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : ""}
                        </td>
                        <td>{item.monedaDestino}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Esconde todo menos el comprobante al imprimir */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .p-4.border.rounded.shadow.mx-auto { 
            visibility: visible; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100vw;
            margin: 0;
            box-shadow: none !important;
          }
          .btn, .d-flex, .row > .col-md-6:not(:first-child) { display: none !important; }
        }
      `}</style>
    </div>
  );
}
