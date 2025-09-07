// Header.jsx
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const headerData = [
  {
    items: [
      { label: "Fact Checker", path: "/fact-check" },
      { label: "Bias Detection", path: "/bias-detection" },
      { label: "Summarizer", path: "/summarizer" },
      { label: "Translator", path: "/translate" },
      { label: "Relate News", path: "/fetch-new" },
    ],
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Journalist Agent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {headerData[0].items.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
                {/* Active indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-600"
                      : "bg-transparent"
                  }`}
                />
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out opacity-100 visibility-visible transform translate-y-0">
            <nav className="px-4 py-4 space-y-2">
              {headerData[0].items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
