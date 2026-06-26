import { BrainIcon } from "../icons/BrainIcon";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SidebarItem } from "./Slidebaritem";
import { useContent, type ContentType } from "../../context/ContentContext";
import { useNavigate } from "react-router";

const NAV_ITEMS: { id: ContentType | "all"; label: string; icon: React.ReactElement }[] = [
  { id: "all",     label: "All",          icon: <BrainIcon /> },
  { id: "article", label: "Twitter / X",  icon: <XIcon /> },
  { id: "video",   label: "YouTube",      icon: <YoutubeIcon /> },
  { id: "image",   label: "Images",       icon: <DocumentIcon /> },
  { id: "audio",   label: "Audio",        icon: <DocumentIcon /> },
];

export function Sidebar() {
  const { filter, setFilter } = useContent();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
          <BrainIcon />
        </div>
        <span className="text-base font-semibold text-gray-900 tracking-tight">Second Brain</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
          Library
        </p>
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <SidebarItem
            key={id}
            text={label}
            icon={icon}
            active={filter === id}
            onClick={() => setFilter(id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            U
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-gray-800 truncate">User</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          Log out
        </button>
      </div>

    </aside>
  );
}