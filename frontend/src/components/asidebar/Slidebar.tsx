// import { BrainIcon } from "../icons/BrainIcon";
// import { XIcon } from "../icons/XIcon";
// import { YoutubeIcon } from "../icons/YoutubeIcon";
// import { Sidebaritem } from "./Slidebaritem";

// export function Sidebar(){
//     return (
//         <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 fixe d">  
//             <div className="flex text-3xl pt-4 items-center ml-2">
//                 <div className="pr-2 primary ">
//                     <BrainIcon/>
//                 </div>
//                 Second Brain
//             </div>
//             <div className="pt-4 ml-2 pl-4">
//                 <Sidebaritem icon={<XIcon/>} text="X" />
//                 <Sidebaritem icon={<YoutubeIcon/>} text="Youtube" />
//             </div>
            
//         </div>
//     )
// }    

import { useState } from "react";
import { BrainIcon } from "../icons/BrainIcon";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { SidebarItem } from "./Slidebaritem";

const NAV_ITEMS = [
  { id: "twitter", label: "Twitter / X", icon: <XIcon /> },
  { id: "youtube", label: "YouTube",     icon: <YoutubeIcon /> },
  { id: "articles", label: "Articles",  icon: <DocumentIcon /> },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

export function Sidebar() {
  const [active, setActive] = useState<NavId>("twitter");

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
          <BrainIcon />
        </div>
        <span className="text-base font-semibold text-gray-900 tracking-tight">
          Second Brain
        </span>
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
            active={active === id}
            onClick={() => setActive(id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            U
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-gray-800 truncate">User</span>
            <span className="text-xs text-gray-400 truncate">user@email.com</span>
          </div>
        </div>
      </div>

    </aside>
  );
}