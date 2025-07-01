import React, { useState } from "react";
import logo from "./assets/ISO_Mesa de trabajo 1.png";

export default function App() {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    tipoCambio: "",
    montoCLP: "",
    monedaDestino: "COP"
  });
  const [showComprobante, setShowComprobante] = useState(false);

  // Opciones de monedas destino
  const monedas = [
    { label: "Pesos Colombianos (COP)", value: "COP", simbolo: "$" },
    { label: "Pesos Argentinos (ARS)", value: "ARS", simbolo: "$" },
    { label: "Soles Peruanos (PEN)", value: "PEN", simbolo: "S/" },
    { label: "Bolívares (VES)", value: "VES", simbolo: "Bs." },
    { label: "Dólares Americanos (USD)", value: "USD", simbolo: "US$" },
    // Puedes agregar más aquí si lo necesitas
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowComprobante(true);
  };

  const handleEdit = () => setShowComprobante(false);

  const printComprobante = () => window.print();

  // Calcula el monto final
  const montoFinal =
    form.montoCLP && form.tipoCambio && !isNaN(form.montoCLP) && !isNaN(form.tipoCambio)
      ? (parseFloat(form.montoCLP) * parseFloat(form.tipoCambio))
      : "";

  // Simbolo moneda destino
  const simboloDestino = monedas.find(m => m.value === form.monedaDestino)?.simbolo || "";

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Generar Comprobante de Envío</h2>
      {!showComprobante ? (
        <form className="p-4 border rounded shadow mx-auto" style={{maxWidth: 500}} onSubmit={handleSubmit}>
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
          {/* MONTO Y TIPO DE CAMBIO */}
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
              Monto a recibir aprox: <strong>{simboloDestino} {montoFinal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Generar Comprobante
          </button>
        </form>
      ) : (
        <div className="p-4 border rounded shadow mx-auto" style={{maxWidth: 500, background:"white"}}>
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
            <p><strong>Monto enviado (CLP):</strong> ${parseFloat(form.montoCLP).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
            <p><strong>Tipo de cambio aplicado:</strong> {parseFloat(form.tipoCambio).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:4})}</p>
            <p><strong>Monto a recibir ({form.monedaDestino}):</strong> {simboloDestino} {parseFloat(montoFinal).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
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
          .btn, .d-flex { display: none !important; }
        }
      `}</style>
    </div>
  );
}
