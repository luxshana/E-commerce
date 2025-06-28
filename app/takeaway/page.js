
"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

export default function OrderForm() {
  const [option, setOption] = useState('takeaway');
  const [date, setDate] = useState('2025-06-28');
  const [time, setTime] = useState('18:00');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ option, date, time, email, fullName, phone, paymentMethod });
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
      {/* <div className="flex justify-around mb-6">
        <button
          onClick={() => setOption('takeaway')}
          className={`flex-1 p-4 bg-gray-200 rounded-l ${option === 'takeaway' ? 'bg-gray-300' : ''}`}
        >
          <span className="block text-center">🍽️ À emporter</span>
        </button>
        <button
          onClick={() => setOption('delivery')}
          className={`flex-1 p-4 bg-gray-200 rounded-r ${option === 'delivery' ? 'bg-gray-300' : ''}`}
        >
          <span className="block text-center">🏍️ Livraison</span>
        </button>
      </div> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">DATE :</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">L'HEURE :</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EMAIL :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Votre email"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">NOM COMPLET :</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Votre nom"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">NUMÉRO DE TÉLÉPHONE :</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Votre numéro"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MODE DE PAIEMENT :</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionnez le mode de paiement</option>
            <option value="card">Carte</option>
            <option value="cash">Espèces</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Passer commande en tant qu'invitée
        </button>
      </form>
    </div>
  );
}
