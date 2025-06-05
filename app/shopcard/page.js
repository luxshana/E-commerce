"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Card display component
function MyCardInfo({ user }) {
  const { username, user_id, user_points = 0, user_level = 1 } = user;

  const tierClass =
    user_level === 3 ? "black" : user_level === 2 ? "blue" : "normal";
  const tierName =
    user_level === 3 ? "Pro +" : user_level === 2 ? "Pro" : "Normal";
  const discount = user_level === 3 ? "-20%" : user_level === 2 ? "-10%" : null;

  return (
    <div className={`shopcard ${tierClass}`}>
      <div className="chead">
        <img src="/mycard.png" alt="Logo" />
        <div className="vdate">
          Exclusivement
          <br />
          <span>sur internet</span>
        </div>
      </div>

      <div className="codebar">{user_points} pts</div>

      <div className="ndetails">
        <h4>{username || "Utilisateur"}</h4>
        <p>{user_id || "Non fourni"}</p>
      </div>

      <div className="cFoot">
        <div className="proplus">{tierName}</div>
        {discount && (
          <p className="off">
            {discount}
            <br />
            <span>Tous les produits</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function MyCardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" && sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("user");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="loading">
        <div className="gen_preloader1"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "10px", color: "red" }}>
        Redirection vers la page de connexion...
      </div>
    );
  }

  return (
    <div>
      <MyCardInfo user={user} />
    </div>
  );
}
