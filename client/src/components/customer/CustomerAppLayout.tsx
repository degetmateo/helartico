import React, { useState } from "react";
import { Gift, Sparkles, Ticket, User as UserIcon } from "lucide-react";
import { CatalogView } from "./CatalogView";
import { ProfileView } from "./ProfileView";
import { RedemptionsView } from "./RedemptionsView";
import { useAuth } from "../../context/AuthContext";

type CustomerTab = "CATALOG" | "REDEMPTIONS" | "PROFILE";

export const CustomerAppLayout: React.FC = () => {
  const { user, refreshMe } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerTab>("CATALOG");

  const handleRedeemSuccess = () => {
    refreshMe();
    setActiveTab("REDEMPTIONS");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-badge">
          <img src="/logo.png" alt="Helartico" />
          <div>
            <div className="brand-title">Helartico</div>
            <div className="brand-subtitle">Helados & Café</div>
          </div>
        </div>

        <div className="points-pill" onClick={() => setActiveTab("PROFILE")} style={{ cursor: "pointer" }}>
          <Sparkles size={15} />
          <span>{user?.pointsBalance ?? 0} pts</span>
        </div>
      </header>

      <main className="main-content">
        {activeTab === "CATALOG" && (
          <CatalogView
            userPoints={user?.pointsBalance ?? 0}
            onRedeemSuccess={handleRedeemSuccess}
          />
        )}
        {activeTab === "REDEMPTIONS" && <RedemptionsView />}
        {activeTab === "PROFILE" && <ProfileView />}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === "CATALOG" ? "active" : ""}`}
          onClick={() => setActiveTab("CATALOG")}
        >
          <Gift size={20} />
          <span>Catálogo</span>
        </button>

        <button
          className={`nav-item ${activeTab === "REDEMPTIONS" ? "active" : ""}`}
          onClick={() => setActiveTab("REDEMPTIONS")}
        >
          <Ticket size={20} />
          <span>Mis Canjes</span>
        </button>

        <button
          className={`nav-item ${activeTab === "PROFILE" ? "active" : ""}`}
          onClick={() => setActiveTab("PROFILE")}
        >
          <UserIcon size={20} />
          <span>Mi Perfil</span>
        </button>
      </nav>
    </div>
  );
};
