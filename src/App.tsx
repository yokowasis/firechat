import Chat from "./Chat/ChatMUIContainer"
import {common, Firegun, Chat as ChatFG} from "@yokowasis/firegun"
import { useEffect, useState } from "react";
// import {useRef} from "react"

function App() {

  const [initChat, setInitChat] = useState<{fg:Firegun, chat:ChatFG}[]>([])

  useEffect(()=>{
    const fg = new Firegun(["https://gundb.myriad.systems/gun","https://gun-relay.bimasoft.web.id:16902/gun"]);
    const chat = new ChatFG(fg)
    const arr = [{
      fg : fg,
      chat : chat,
    }]
    setInitChat(arr);
  },[])

  return (
    <div className="App">
      {
        initChat.map((val,index)=><Chat common={common} key={index} fg={val.fg} chat={val.chat} />)
      }
      {/* <Test /> */}
    </div>
  );
}

// function Test() {
//   const a = useRef<HTMLInputElement[]>([]);
//   const list = [0,1,2,3,4,5]
//   const click = () => {
//     let i = 3;
//     a.current[i].value = Math.random().toString()
//   }
//   return (
//     <>
//       {
//         list.map((val,index)=>{
//           return (
//             <input type="text" value={val} key={index} ref={el=>{
//               if (el) {
//                 a.current.push(el);
//                 return (a.current[a.current.length])
//               } else {
//                 return null
//               }
//             }} />  
//           )
//         })
//       }
//       <button onClick={click}>Click ME !</button>
//     </>
//   )
// }

export default App;
