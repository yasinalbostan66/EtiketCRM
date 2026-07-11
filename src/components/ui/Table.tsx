import React from "react";
import { Filter } from "lucide-react";
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = "", ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
      <table className={`w-full text-sm text-left text-slate-700 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = "", ...props }) => (
  <thead className={`text-xs text-slate-600 uppercase bg-slate-50 border-b border-slate-100 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = "", ...props }) => (
  <tr className={`bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => (
  <th scope="col" className={`px-6 py-4 font-bold text-slate-700 whitespace-nowrap ${className}`} {...props}>
    <div className="flex items-center gap-2">
      {children}
      {children !== "İşlem" && children !== "" && (
        <button className="text-slate-300 hover:text-blue-500 transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
          <Filter className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => (
  <td className={`px-6 py-4 align-middle ${className}`} {...props}>
    {children}
  </td>
);
