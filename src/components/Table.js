import React from "react";
import DashboardActionsSvg from "./DashboardActionsSvg";
import { convertTimestamp } from "../utils/functions";

const Table = ({ invoices }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl text-blue-700 font-semibold">Erfasste Rechnungen </h3>
      <table>
        <thead>
          <tr>
            <th className="text-blue-600">Erstellung</th>
            <th className="text-blue-600">Kunde</th>
            <th className="text-blue-600">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="text-sm text-gray-400">
                {convertTimestamp(invoice.data.timestamp)}
              
                    
              </td>
              <td className="text-sm">{invoice.data.customerName}</td>
              <td>
                <DashboardActionsSvg invoiceId={invoice.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
