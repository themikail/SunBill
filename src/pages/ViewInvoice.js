import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { query, collection, where, doc, onSnapshot } from "@firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import db from "../firebase";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import { findGrandTotal, convertTimestamp } from "../utils/functions";
import Loading from "../components/Loading";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  let params = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return navigate("/login");
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", user.id)
      );
      onSnapshot(q, (querySnapshot) => {
        const firebaseBusinesses = [];
        querySnapshot.forEach((doc) => {
          firebaseBusinesses.push({ data: doc.data(), id: doc.id });
        });
        setBusinessDetails(firebaseBusinesses);
      });
      if (params.id) {
        const unsub = onSnapshot(doc(db, "invoices", params.id), (doc) => {
          setInvoiceDetails({ data: doc.data(), id: doc.id });
        });
        setLoading(false);
        return () => unsub();
      }
    } catch (error) {
      console.error(error);
    }
  }, [params.id, navigate, user.id]);

  // VAT
  // function calculateTax(itemCost) {
  //   return (Number(itemCost) * 0.19).toFixed(2).toLocaleString("de-DE");
  // }

  // const tax = calculateTax(invoiceDetails.data.itemList[0].itemCost);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:w-2/3 mx-auto mt-8 rounded" ref={ref}>
          <div className="w-full  flex items-center">
            <div className="w-1/2 h-[100%]  p-8 ">
              <img
                src={businessDetails ? businessDetails[0].data.logo : ""}
                alt="Logo"
                className="w-[80px]"
              />
            </div>
            <div className="w-1/2  px-40 py-4">
              <h3 className="text-black text-xl mb-6">Rechnung</h3>
              <p className="text-black text-xs mb-1">
                <strong>Rechnungsnummer</strong>
              </p>

              {invoiceDetails && (
                <p className="text-black mb-5 text-xs">
                  {invoiceDetails.data.invoiceNumber}
                </p>
              )}

              <p className="text-black text-xs mb-1">
                <strong>Rechnungsdatum:</strong>
              </p>

              {invoiceDetails && (
                <p className="text-black text-xs">
                  {new Date(invoiceDetails.data.invoiceDate)
                    .toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\./g, ".")}{" "}
                </p>
              )}

              <p className="text-black text-sm mb-1">
                <strong>Lieferdatum:</strong>
              </p>

              {invoiceDetails && (
                <p className="text-black text-xs">
                  {new Date(invoiceDetails.data.invoiceDateDate)
                    .toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\./g, ".")}{" "}
                </p>
              )}

              <p className="text-black text-xs mb-1">
                <strong>Zahlunsdatum:</strong>
              </p>

              {invoiceDetails && (
                <p className="text-black text-xs">
                  {new Date(invoiceDetails.data.invoicePayment)
                    .toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\./g, ".")}{" "}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex items-center">
            {invoiceDetails && (
              <div className="w-1/2 p-8">
                <h3 className="font-medium mb-2"></h3>
                <p className="text-sm mb-1">
                  <strong>{invoiceDetails.data.customerName}</strong>
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerAddress}
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerCity}
                </p>
                <p className="text-sm mb-1">
                  {invoiceDetails.data.customerEmail}
                </p>
              </div>
            )}

            {businessDetails && (
              <div className="w-1/2  p-8">
                <h3 className="font-medium mb-2"></h3>
                <p className="text-sm mb-1">
                  <strong>{businessDetails[0].data.businessName}</strong>
                </p>
                <p className="text-sm mb-1">
                  {businessDetails[0].data.businessAddress},
                </p>
                <p className="text-sm mb-1">
                  {businessDetails[0].data.businessCity}
                </p>
              </div>
            )}
          </div>
          <div className=" p-8">
            {businessDetails && (
              <p className="text-xs">
                Sehr geehrte(r) {invoiceDetails.data.customerName}, <br></br>{" "}
                <br></br>
                vielen Dank für Ihren Auftrag. Vereinbarungsgemäß berechnen wir
                Ihnen hiermit folgende Leistungen:
              </p>
            )}

            <table>
              <thead>
                <th>Beschreibung</th>
                <th className="text-right text-sm">Einzelpreis</th>
                <th className="text-right text-sm">Menge</th>
                <th className="text-right text-sm">Betrag</th>
              </thead>
              <tbody>
                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td className="text-xs capitalize">{item.itemName}</td>
                      <td className="text-xs text-right">
                        {Number(item.itemCost)
                          .toFixed(2)
                          .toLocaleString("de-DE")}
                        {invoiceDetails.data.currency}
                      </td>
                      <td className="text-xs text-right">
                        {Number(item.itemQuantity).toLocaleString("de-DE")}
                      </td>
                      <td className="text-xs text-right">
                        {(Number(item.itemQuantity) * Number(item.itemCost))
                          .toFixed(2)
                          .toLocaleString("de-DE")}
                        {invoiceDetails.data.currency}
                      </td>
                    </tr>
                  ))}

                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        Nettobetrag
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
                        {(Number(item.itemQuantity) * Number(item.itemCost))
                          .toFixed(2)
                          .toLocaleString("de-DE")}
                        {invoiceDetails.data.currency}
                      </td>
                    </tr>
                  ))}
                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        Zzgl. 19% USt.
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
                        {(
                          Number(item.itemQuantity) *
                          Number(item.itemCost) *
                          0.19
                        )
                          .toFixed(2)
                          .toLocaleString("de-DE")}
                        {invoiceDetails.data.currency}{" "}
                      </td>
                    </tr>
                  ))}

                {invoiceDetails &&
                  invoiceDetails.data.itemList.map((item) => (
                    <tr key={item.itemName}>
                      <td colSpan="3" className="text-right font-bold text-sm">
                        Rechnungsbetrag
                      </td>
                      <td className="font-bold text-right uppercase text-sm">
                        {(
                          Number(item.itemQuantity) *
                          Number(item.itemCost) *
                          1.19
                        )
                          .toFixed(2)
                          .toLocaleString("de-DE")}
                        {invoiceDetails.data.currency}{" "}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <br></br>
            <br></br>
            <p className="text-xs">
              Bitte überweisen Sie den Rechnungsbetrag wie oben beim
              Zahlungsdatum angegeben auf unser unten genanntes Konto. <br></br>
              Für weitere Fragen stehen wir Ihnen sehr gerne zur Verfügung.{" "}
              <br></br>
              <br></br>
              Mit freundlichen Grüßen, <br></br>
              Mikail Gökce
            </p>
          </div>
          {/* {businessDetails && (
            <div className="w-full p-8">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <p className="text-sm mb-1 capitalize">
                <span className="font-semibold">Account Name: </span>
                {businessDetails[0].data.accountName}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Account Number: </span>
                {businessDetails[0].data.accountNumber}
              </p>
              <p className="text-sm mb-1 capitalize">
                <span className="font-semibold">Bank Name: </span>{' '}
                {businessDetails[0].data.bankName}
              </p>
            </div>
          )} */}
          <footer
            className="bg-white-200
          text-center
          fixed
          inset-x-0
          bottom-0
          p-4"
          >
            <hr></hr>
            <br></br>
            {businessDetails && (
              <p className="text-sm text-center">
                <strong>Adresse</strong>{" "}
                {businessDetails[0].data.businessAddress} •{" "}
                {businessDetails[0].data.businessCode} •{" "}
                {businessDetails[0].data.businessCity} &nbsp;&nbsp;&nbsp;&nbsp;
                <strong>E-Mail</strong> {businessDetails[0].data.accountEmail}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Website</strong>{" "}
                {businessDetails[0].data.businessWebsite}
              </p>
            )}
            {businessDetails && (
              <p className="text-sm text-center">
                <strong>Bank</strong> {businessDetails[0].data.bankName}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;<strong>SWIFT/BIC</strong>{" "}
                {businessDetails[0].data.bankSwift} &nbsp;&nbsp;&nbsp;&nbsp;
                <strong>IBAN</strong> {businessDetails[0].data.bankIban}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;<strong>Kontoinhaber</strong>{" "}
                {businessDetails[0].data.businessName}
              </p>
            )}
          </footer>{" "}
        </div>
      )}
    </>
  );
});

export const ViewInvoice = () => {
  const ComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentRef.current,
  });
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full flex items-center md:justify-start justify-center relative">
        <Tooltip title="Ausdrucken">
          <IconButton
            onClick={handlePrint}
            style={{
              position: "fixed",
              top: "10px",
              right: "30px",
              zIndex: "1000px",
              color: "#F7CCAC",
            }}
          >
            <LocalPrintshopIcon style={{ fontSize: "50px" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Dashboard">
          <IconButton
            onClick={() => navigate("/dashboard")}
            style={{
              position: "fixed",
              top: "100px",
              right: "30px",
              zIndex: "1000px",
            }}
          >
            <HomeIcon style={{ fontSize: "50px" }} />
          </IconButton>
        </Tooltip>

        <ComponentToPrint ref={ComponentRef} />
      </div>
    </>
  );
};
