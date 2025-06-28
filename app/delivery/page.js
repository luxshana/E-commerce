"use client";
import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    tableNumber: '',
    date: '',
    time: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    paymentMethod: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-left">Choisissez votre option</h2>
            <div className="flex justify-between mb-6 gap-2">
          <button className="bg-white border-black border-2 text-black px-6 py-4 rounded flex-1">
            <Link href="/takeaway">
              <div className="flex items-center justify-center flex-col">
                <div>
                  <Image width={80} height={40} src="/delivery.png" />
                </div>
                <div> Take away</div>
              </div>
            </Link>
          </button>

          <button className="bg-white border-black border-2 text-black  px-6 py-4 rounded flex-1 ">
            <Link href="/delivery">
              <div className="flex items-center justify-center flex-col">
                <div>
                  <Image width={80} height={40} src="/takeaway.png" />
                </div>
                <div> Delivery</div>
              </div>
            </Link>
          </button>
        </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>NUMÉRO DE TABLE :</label>
          <input
            type="text"
            name="tableNumber"
            value={formData.tableNumber}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>DATE :</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>L’HEURE :</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="error">error</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>EMAIL :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>NOM COMPLET :</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>NUMÉRO DE TÉLÉPHONE :</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>MODE DE PAIEMENT :</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="">Sélectionnez le mode de paiement</option>
          </select>
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Passer commande en tant qu'invité
        </button>
      </form>
    </div>
  );
}