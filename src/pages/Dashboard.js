import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Table from "../components/Table";
import { Link } from "react-router-dom";
import {
  AppBar,
  Typography,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { query, collection, where, onSnapshot } from "@firebase/firestore";
import db from "../firebase";
import Loading from "../components/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return navigate("/login");
    try {
      const q = query(
        collection(db, "invoices"),
        where("user_id", "==", user.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const firebaseInvoices = [];
        querySnapshot.forEach((doc) => {
          firebaseInvoices.push({ data: doc.data(), id: doc.id });
        });
        setInvoices(firebaseInvoices);
        setLoading(false);
        return () => unsubscribe();
      });
    } catch (error) {
      console.log(error);
    }
  }, [navigate, user.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full">
          <Nav />

          <div className="sm:p-6 flex items-center flex-col p-3 justify-center">
            <h3 className="p-12 text-slate-800">
              Merhaba, <span className="text-blue-800">{user.email}</span>
            </h3>

            <div className="flex flex-row justify-between">
                <button
                  className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                  onClick={() => navigate("/edit/profile")}
                >
                  <p>Profil bearbeiten</p>
                </button>
              <button
                className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                onClick={() => navigate("/customer")}
              >
                <p>Kunden</p>
              </button>
              <button
                className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                onClick={() => navigate("/products")}
              >
                <p>Produkte</p>
              </button>
              <button
                className=" h-36 py-6 px-12 border-t-8 border-blue-800 shadow-md rounded hover:bg-slate-200 hover:border-red-500 bg-slate-50 cursor-pointer mb-[100px] mt-[50px] text-blue-700"
                onClick={() => navigate("/new/invoice")}
              >
                <p>Ertselle deine Rechnung</p>
              </button>
            </div>
            {invoices.length !== 0 && <Table invoices={invoices} />}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
