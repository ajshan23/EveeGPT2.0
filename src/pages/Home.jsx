import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  where,
} from "firebase/firestore";
import { query } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken, updateUser } from "../app/chatSlice";
import { useNavigate } from "react-router-dom";
import logo from "../image/DIALOGIX.png";
import userLogo from "../image/user.png";
import sendIcon from "../image/Vector.png";
import roboIcon from "../image/robotLogo.png";
import "./Style.css";
import { MdOutlineSaveAlt } from "react-icons/md";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TypingEffect from "../Components/TypingEffecct";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const genAI = new GoogleGenerativeAI(String(import.meta.env.VITE_APIKEY));
  const dbRef = collection(db, "users");
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveButtonOn,setSaveButtonOn]=useState(false)
  const [errLoading, setErrLoading] = useState(false);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [titleInput, setTitleInput] = useState(false);
  const [history, setHistory] = useState([]);
  const [allChats,setAllChatHistory]=useState([])
  const [current, setCurrent] = useState([]);
  const accessToken = useSelector((state) => state.accessToken);
  const currentUseremail = useSelector((state) => state.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setAllChatHistory([])
    getUserPreviousChats()
  if (!currentUseremail) {
    navigate("/login")
  }
  
  }, [saveLoading]);
  const handleLogout = async () => {
    await signOut(auth)
      .then(
        sessionStorage.clear(),
        dispatch(updateUser("")),
        dispatch(updateAccessToken("")),
        console.log("logout successfully"),
        navigate("/login")
      )
      .catch((err) => console.log("error while logout", err));
 
  };



  const saveChatSessionToFirebaseHandler = async () => {
    if (!current) {
      return null;
    }
    try {
      setSaveLoading(true);
      await addDoc(dbRef, {
        title: title,
        email: currentUseremail,
        chats: current,
        time: Date.now(),
      });
      setCurrent([]);
      setHistory([]);
      setSaveLoading(false);
    } catch (error) {
      console.log("Error while adding doc to firebase:", error);
      setSaveLoading(false);
    }
  };

  

  const getUserPreviousChat = async () => {
    try {
      const unsub = await onSnapshot(doc(db, "users", "WO9Yw0OCzh2PZJjDGFuP"), (doc) => {
        console.log("Current data: ", doc.data());
        console.log(doc.data().chats)
        setHistory(doc.data().chats)
        console.log(history);
        setCurrent(doc.data().chats)
    })
      

    } catch (error) {
      console.log(error,"error occured at getUserPreviousChat");
    }
  };


  const getUserPreviousChats = async () => {
    try {
      let res = await getDocs(query(dbRef));
      if (Array.isArray(res.docs)) {
          res.docs.map((item) => {
          if (item.data().email===currentUseremail) {
            setAllChatHistory(prev=>[...prev,item.data()])
          } 
        });
      }
      console.log(allChats);
      
      // const aj=test.filter(ele=>ele.email === "1@gmail.com")
      // aj.map((ele)=>setAllChatHistory((prev)=>[...prev,ele]))
     
    } catch (error) {
      console.log("error occured whiile getting previous chats:", error);
    }
  };
  const getList = async () => {
    let res = await getDocs(query(dbRef));
    if (Array.isArray(res.docs)) {
        res.docs.map((item) => {
        setTest((prev)=>[...prev,{ id: item.id, ...item.data() }])
      });
    }
    test.map((ele)=>console.log(ele))
    const aj=test.filter(ele=>ele.userid === currentUseremail)
    aj.map((ele)=>console.log("second",ele))

    const q = query(dbRef, where("email", "==", currentUseremail));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docu) => {
      console.log(docu.id, "=>", docu.data());
    });
  };

  const run = async () => {
    setLoading(true);
    chatscroll();
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({
        history: history,
      });
      const result = await chat.sendMessage(input);

      const response = result.response;
      const textPre = response.text();
      const text = textPre.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

      console.log(text);

      setHistory((prev) => [...prev, { role: "model", parts: text }]);
      setCurrent((prev) => [...prev, { role: "model", parts: text }]);

      setLoading(false);
      chatscroll();
    } catch (error) {
      setLoading(false);
      setErrLoading(true);
      throw error;
    }
  };

  const handleSubmit = () => {
    if (input.trim() !== "") {
      setHistory((prev) => [...prev, { role: "user", parts: input }]);
      setCurrent((prev) => [...prev, { role: "user", parts: input }]);
      chatscroll();
      run();
      setInput("");
      setSaveButtonOn(true)
    }
  };
  const saveButtonHandler=()=>{
    if (title.trim()==="") {
      console.log("without providing a heading");
      return null
    }
    saveChatSessionToFirebaseHandler()
    titleinputHandler()
  }

  const cancelButtonHandler=()=>{
    titleinputHandler()
    setTitle("")
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const chatscroll = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  const titleinputHandler = () => {
    setTitleInput((prev)=>!prev);
  };
  

  return (
    <div className=" text-white overflow-hidden">
      <div className="bg-[#181818]">
        <div className="px-2  md:px-5 lg:px-24 xl:px-28 w-full h-screen flex flex-col py-3">
          <div className="navbar w-full h-20 sm:h-24 pt-2 flex items-center justify-between">
            <div className="logo">
              <img src={logo} className="h-[21px] w-[120px] flex" />
            </div>
            <div className=" flex gap-3">
              <button
                className="bg-[#212121] px-12 py-[10px]  border-none rounded-full  hover:scale-105 "
                onClick={handleLogout}
              >
                Logout
              </button>
              <img
                src={userLogo}
                alt=""
                className="w-12 rounded-full hover:border-2 hover:border-white hover:scale-110"
              />
            </div>
          </div>
          <div className=" body w-full h-full py-2 flex gap-6">
            <div className="input+chat flex flex-col w-full gap-3">
              <div className="chat scroll-container w-full bg-[#444444] h-[500px] sm:h-[550px] rounded-xl overflow-scroll">
                <div className="w-full h-full px-1 sm:px-2 py-2 flex flex-col">
                  {current.map((item, index) => (
                    <>
                      <div
                        className={`w-full py-4 gap-3 sm:gap-4  items-start ${
                          item.role === "user"
                            ? "pr-2px sm:pr-5 flex flex-row-reverse "
                            : " pl-2px sm:pl-5 flex "
                        }`}
                        key={index}
                      >
                        {item.role === "user" ? (
                          <img src={userLogo} className="w-8" />
                        ) : (
                          <img src={roboIcon} className="w-8" />
                        )}
                        <div>
                          <span className="py-1 typing-text">
                            {item.role === "user" ? (
                              item.parts // For user messages, display immediately
                            ) : (
                              <TypingEffect text={item.parts} /> // For robot messages, use typing effect component
                            )}
                          </span>
                        </div>
                      </div>
                      <div ref={chatContainerRef}></div>
                    </>
                  ))}
                  {loading ? (
                    <div className="pl-1 sm:pl-5 pt-2 sm:pt-4 flex items-center justify-start">
                      <img src={roboIcon} className="w-8" />
                      <div className="loading pl-24 pt-12">
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="relative input-box w-full h-[52px] rounded-full bg-[#212121] flex justify-between items-center">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Type Something..."
                    className="bg-transparent w-full outline-none px-5 sm:px-7 md:px-10 placeholder:font-sans"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {saveButtonOn? <>{titleInput ? (
                  <div className="absolute -top-36 right-0 rounded-lg flex  bg-[#212121] border border-white w-full sm:w-80 h-32 ">
                    <div className="w-full px-3 flex flex-col justify-center">
                      <h1>Do you want to save it?</h1>
                      <div className="border border-white rounded-lg h-10 mt-3">
                        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="px-3 w-full h-full outline-none bg-transparent placeholder:text-sm placeholder:font-thin" placeholder="   Give a proper name to undentify"/>
                      </div>
                      <div className="flex flex-row justify-center space-x-5 mt-3">
                        <div className="border p-1 border-black rounded-lg text-white bg-red-700">
                          <button onClick={cancelButtonHandler}>cancel</button>
                        </div>
                        <div className="border p-1 border-black rounded-lg text-white bg-green-700">
                          <button onClick={saveButtonHandler}>save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {" "}
                    {saveLoading ? (
                      <ClipLoader size={25}></ClipLoader>
                    ) : (
                      <MdOutlineSaveAlt size={25} onClick={titleinputHandler} />
                    )}
                  </div>
                )}</>:<></>}
                <div className="pl-3 pr-5 sm:pr-6 cursor-pointer">
                  <img
                    src={sendIcon}
                    alt=""
                    className="w-5  "
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex history  ">
              <div className="w-[341px] bg-[#444444] h-full pb-4 rounded-xl scroll-container overflow-scroll ">
                <div className="h-full w-full  scroll-container overflow-scroll">
                  <div className="px-5 flex flex-col gap-6">
                    <div className="pt-7 font-semibold">History</div>
                    <div className="history-list-secton  flex flex-col ">
                      <div className="w-full h-full flex flex-col gap-4  ">
                       {allChats && allChats.map((singlechat,index)=>(
                         <div className="flex flex-col gap-1 font-light">
                         <div className="text-sm">Today</div>
                         <div className="w-[297px] h-[56px] bg-[#6d6c6c] rounded-xl flex items-center px-3 ">
                          {singlechat.title}
                         </div>
                       </div>
                       ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
