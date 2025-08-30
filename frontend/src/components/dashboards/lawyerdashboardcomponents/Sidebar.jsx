import React from "react";
import {
  AddCircleOutline,
  Assignment,
  TrackChanges,
  HelpOutline,
  Balance,
  Logout,
} from "@mui/icons-material";

const Sidebar = ({
  user,
  selectedItem,
  setSelectedItem,
  isSidebarVisible,
  handleLogout,
}) => {
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const menuItems = [
    { text: "Add Case", icon: <AddCircleOutline /> },
    { text: "Ongoing Cases", icon: <Assignment /> },
    { text: "Track Bail Status", icon: <TrackChanges /> },
    { text: "Decided Cases", icon: <Balance /> },
    { text: "FAQs", icon: <HelpOutline /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col justify-between shadow-lg transition-all duration-300 z-50 ${
        isSidebarVisible ? "w-72 p-6" : "w-0 p-0 overflow-hidden"
      }`}
    >
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Balance className="text-orange-500" style={{ fontSize: 32 }} />
          <h1 className="text-2xl font-bold">JurisDict</h1>
        </div>

        <ul>
          {menuItems.map((item) => (
            <li
              key={item.text}
              onClick={() => setSelectedItem(item.text)}
              className={`flex items-center gap-4 p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${
                selectedItem === item.text
                  ? "bg-white text-gray-900"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white">
          {getInitials(user?.name)}
        </div>
        <div className="flex-grow">
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm text-gray-400">@{user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <Logout />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;