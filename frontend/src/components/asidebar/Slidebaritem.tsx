// import type { ReactElement } from "react";

// export function Sidebaritem({text,icon}: {text:string,icon:ReactElement }){
//     return (
//         <div className="flex text-primary py-2 items-center">
//             <div className="pr-2">
//                 {icon}
//             </div>
//             <div className="pl-2">
//                 {text}
//             </div>
//         </div>
//     )
// }

import type { ReactElement } from "react";
import { cn } from "../../libs/utils";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ text, icon, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
        "transition-all duration-150 outline-none group",
        "focus-visible:ring-2 focus-visible:ring-purple-500/40",
        active
          ? "bg-purple-50 text-primary"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className={cn(
        "shrink-0 transition-colors duration-150",
        active ? "primary" : "text-gray-400 group-hover:text-gray-600"
      )}>
        {icon}
      </span>
      <span className="truncate">{text}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}
    </button>
  );
}