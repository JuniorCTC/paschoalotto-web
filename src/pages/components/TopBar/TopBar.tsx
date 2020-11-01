import React from "react";
import { FiRefreshCcw } from "react-icons/fi";


import "./TopBar.css";

export default function SideBar() {
  function handleRefresh() {
    window.location.reload();
  }
  
  return (
    <aside className="app-topbar">

      <footer>
      <button type="button" onClick={handleRefresh}>
          <FiRefreshCcw size={24} color="#FFF" />
        </button>
      </footer>

      <span>Consulte sua Dívida</span>
    </aside>
  );
}
