import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  where,
} from "firebase/firestore";
import { query } from "firebase/database";

const Test = () => {
  const [data, setData] = useState("");
  const [data2, setData2] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [section, setSection] = useState([]);
  const [thisuserdata, setthisuserdata] = useState([]);

  const collectionRef = collection(db, "users");
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  const handleAdd = async () => {
    try {
      const docRef = await addDoc(collectionRef, {
        first: data,
        last: data2,
        born: 1815,
        userid: auth.currentUser.email,
      });
      setData("");
      setData2("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleRetrieve = async () => {
    const fetch = await getDocs(collectionRef);
    fetch.docs.map((doc) => {
      const sample = { id: doc.id, ...doc.data() };
      setSection((perv) => [...perv, sample]);
      
    });
  };

  const handleDelete = async (id) => {
    const delRef = doc(collectionRef, id);
    await deleteDoc(delRef)
      .then(alert("deleted successfully"))
      .catch((e) => console.log(e));
  };
  const handleRetrievethisuser = async () => {
    const q=query(collection(db,"users"),where("email","==",user.email))
    const fetch=await getDocs(q);
    
    const datas=fetch.docs.map((doc)=>{
      const sample = { id: doc.id, ...doc.data() };
      console.log(sample);
      setthisuserdata((perv) => [...perv, sample]);
    })
    console.log(thisuserdata);
    
  };

  return (
    <div className="flex flex-col">
      <h1>welocme to home {user && user.email}</h1>
      <div>
        section:
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <div>
        classname:
        <input
          type="text"
          value={data2}
          onChange={(e) => setData2(e.target.value)}
        />
      </div>
      <button onClick={handleAdd}>add data</button>
      <button onClick={handleLogout} className="p-2 border border-black">
        logout
      </button>
      <button onClick={handleRetrieve}>show</button>
      <div>show datas</div>
      <div>
        <ul>
          {/* Iterate over the data and create li elements */}
          {section &&
            section.map((item, index) => (
              <li key={index}>
                {/* Display desired information from each object */}
                {item.first} {item.last} - {item.userid} ({item.born})
                <button
                  className="ml-3 p-2 border rounded bg-slate-500"
                  onClick={() => handleDelete(item.id)}
                >
                  delete
                </button>
              </li>
            ))}
        </ul>
      </div>
      
      <div>
      <h1 onClick={handleRetrievethisuser}> thiss user data</h1>
      <button className="ml-3 p-2 border rounded bg-slate-500" onClick={handleRetrievethisuser}>show</button>
      <ul>
          {/* Iterate over the data and create li elements */}
          {thisuserdata &&
            thisuserdata.map((item, index) => (
              <li key={index}>
                {/* Display desired information from each object */}
                {item.first} {item.last} - {item.userid} ({item.born})
                <button
                  className="ml-3 p-2 border rounded bg-slate-500"
                  onClick={() => handleDelete(item.id)}
                >
                  delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Test;

