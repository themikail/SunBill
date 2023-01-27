import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { useSelector } from "react-redux";
import db from "../firebase";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import { showToast } from "../utils/functions";

const SetupProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountSurname, setAccountSurname] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPhone, setAccountPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountVat, setAccountVat] = useState("");
  const [accountVatid, setAccountVatId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankIban, setBankIban] = useState("");
  const [bankSwift, setBankSwift] = useState("");
  const [businessCode, setBusinessCode] = useState("");
  const [businessCountry, setBusinessCountry] = useState("");
  const [logo, setLogo] = useState(
    "https://www.pesmcopt.com/admin-media/images/default-logo.png"
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return navigate("/login");
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", user.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const business = [];
        querySnapshot.forEach((doc) => {
          business.push(doc.data().name);
        });
        setLoading(false);
        if (business.length > 0) {
          navigate("/dashboard");
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [navigate, user.id]);

  const handleFileReader = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setLogo(readerEvent.target.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "businesses"), {
      user_id: user.id,
      businessName,
      businessAddress,
      businessCity,
      accountName,
      accountSurname,
      accountNumber,
      bankName,
      bankIban,
      bankSwift,
      businessCode,
      businessCountry,
      accountEmail,
      accountPhone,
      accountVat,
      accountVatid,
    });
    const imageRef = ref(storage, `businesses/${docRef.id}/image`);
    if (
      logo !== "https://www.pesmcopt.com/admin-media/images/default-logo.png"
    ) {
      await uploadString(imageRef, logo, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "businesses", docRef.id), {
          logo: downloadURL,
        });
        showToast("success", "Your profile has been created!");
      });
      navigate("/dashboard");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Nav />
          <div className="w-full md:p-8 md:w-2/3 md:shadow mx-auto mt-8 rounded p-3 my-8">
            <h3 className="text-center font-bold text-xl mb-6">
              Erstelle deinen Account
            </h3>

            <div className="flex items-center space-x-4 w-full">
              <div className="flex flex-col w-1/2">
                <img src={logo} alt="Logo" className=" w-full max-h-[300px]" />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="logo" className="text-sm mb-1">
                  {logo ===
                    "https://www.pesmcopt.com/admin-media/images/default-logo.png" &&
                    "Upload logo"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full mb-6  rounded"
                  name="logo"
                  onChange={handleFileReader}
                />
              </div>
            </div>
            <form
              className="w-full mx-auto flex flex-col"
              onSubmit={handleSubmit}
            >
              <label htmlFor="businessName" className="text-sm">
                Firmenname
              </label>
              <input
                type="text"
                required
                className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                name="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="businessAddress" className="text-sm">
                    Adresse
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="businessAddress"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="businessCode" className="text-sm">
                    PLZ
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="businessCode"
                    value={businessCode}
                    onChange={(e) => setBusinessCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="businessCity" className="text-sm">
                    Ort
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="businessCity"
                    value={businessCity}
                    onChange={(e) => setBusinessCity(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="businessCountry" className="text-sm">
                    Land
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="businessCountry"
                    value={businessCountry}
                    onChange={(e) => setBusinessCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountName" className="text-sm">
                    Vorname
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountSurname" className="text-sm">
                    Nachname
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="accountSurname"
                    value={accountSurname}
                    onChange={(e) => setAccountSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountEmail" className="text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="accountEmail"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountPhone" className="text-sm">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="accountPhone"
                    value={accountPhone}
                    onChange={(e) => setAccountPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountVat" className="text-sm">
                    Steuernummer
                  </label>
                  <input
                    type="number"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="accountVat"
                    value={accountVat}
                    onChange={(e) => setAccountVat(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="accountVatid" className="text-sm">
                    USt-IdNr.:
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="accountVatid"
                    value={accountVatid}
                    onChange={(e) => setAccountVatId(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <div className="flex flex-col w-1/2">
                  <label htmlFor="bankName" className="text-sm">
                    Bank
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 rounded"
                    name="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label htmlFor="bankSwift" className="text-sm">
                    SWIFT/BIC
                  </label>
                  <input
                    type="text"
                    required
                    className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                    name="bankSwift"
                    value={bankSwift}
                    onChange={(e) => setBankSwift(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="bankIban" className="text-sm">
                IBAN
              </label>
              <input
                type="text"
                required
                className="py-2 px-4 bg-gray-100 w-full mb-6 capitalize rounded"
                name="bankIban"
                value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
              />

              <button className="bg-blue-800 text-gray-100 w-full p-5 rounded my-6">
                COMPLETE PROFILE
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SetupProfile;
