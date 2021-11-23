import { Chat, common, Firegun } from "@yokowasis/firegun";
import React from "react";
import EditGroupChat from "./EditGroupChat";
import InviteButton from "./InviteButton";
import AddAdminButton from "./AddAdminButton";
import Close from "@mui/icons-material/Close";
import { Button, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFile";
import Send from "@mui/icons-material/Send";
import { RefreshRounded, Search } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { chatType } from "@yokowasis/firegun/common";
import ChatBubble from "./ChatBubble";

export default function ChatMUI(
    props : {
        partnerKey : string,
        height : string,
        fg : Firegun,
        chat : Chat,
        show : boolean,
        alias : string,
        isGroup? : boolean,
        groupName? : string,
        updateLastMsg : (key:string,lastMsg:string) => void,
    }) 
{

    // React Ref
    const partner = React.useRef({
        cert : "",
        pub : "",
        epub : "",
        groupOwner : "",
        groupAlias : "", 
    })

    const chatsMessages = React.useRef<chatType[]>([]);
    const chatBubbleRef = React.useRef<{[x:string] : HTMLDivElement | null}>({})
    const chatsMessagesDivRef = React.useRef<JSX.Element>(<></>)


    // REACT STATE -------------------------------------------------
    const [chatsMessagesDiv, setChatsMessagesDiv] = React.useState<JSX.Element>(<></>);
    const [searchString, setSearchString] = React.useState("");
    const [textMsg, setTextMsg] = React.useState("");


    // REACT EFFECT -------------------------------------------------

    // Init First Time
    React.useEffect(()=>{
        (async ()=>{
            if (props.partnerKey.indexOf("&")>=0) {

                let dateNow = common.getDate()
    
                if (props.isGroup) {
                    // Group Chat
                } else {
                    // 1 on 1 Chat
                    let keys:string[];
                    keys = props.partnerKey.split("&");            
                    let cert = await props.chat.getCert(keys[0]);                        
                    partner.current.cert = (typeof cert === "string") ? cert : "";
                    partner.current.pub = keys[0];
                    partner.current.epub = keys[1];
    
                    // Retrieve AvailableChat
    
                    let chats = await props.chat.retrieveMonthly(
                        {pub : partner.current.pub, epub : partner.current.epub},
                        { month : dateNow.month, year : dateNow.year}                        
                    )
                    renderChat(chats);
                    listenChat();
                }
            } else {
                console.log ("Partner Key Incomplete")
            }            
        })()
    },[])

    // END REACT EFFECT -------------------------------------------------

    // REACT FUNCTION -----------------------------------------------------

    const listenChat = () => {
        props.chat.listen(
            { pub : partner.current.pub, epub : partner.current.epub },
            ((b)=>{
                let a:chatType;
                a = b as chatType;
                insertChat(a)
            }) 
        )
    }

    const sendChat = async () => {

        let msg = textMsg;
        setTextMsg("");
        console.log ("Sending Chat...")

        let date = common.getDate();
        let timestamp = `${date.year}/${date.month}/${date.date}T${date.hour}:${date.minutes}:${date.seconds}.${date.miliseconds}`;
        let id = timestamp.replace(/\//g,".");

        // Check apakah group send
        if (props.isGroup) {
        } else {
            await props.chat.send(
                {pub : partner.current.pub, epub: partner.current.epub},
                msg,
                partner.current.cert
            );
        }

        console.log ("Sending Chat... Success")
    
    }

    const deleteChat = () => {

    }

    const unsentChat = () => {

    }

    const Elem = (props:{elem : JSX.Element}) => {
        return <>{props.elem}</>
    }

    const insertChat = (chat:chatType) => {

        chatsMessages.current.push(chat);
        
        let elem =
        <>
            <div key={`${chat.timestamp}-${Math.random()}`} ref={(el)=>{chatBubbleRef.current[chat.id] = el; return chatBubbleRef.current[chat.id]}}>
            {
                (props.isGroup) ?
                    <ChatBubble sender="" status="" deleteChat={console.log} unsentChat={console.log} chatID={chat.id} self={chat._self} text={chat.msg} timestamp={chat.timestamp} />
                :
                    <ChatBubble sender="" status="" deleteChat={deleteChat} unsentChat={unsentChat} chatID={chat.id} self={chat._self} text={chat.msg} timestamp={chat.timestamp} />
            }                                
            </div>    
        </>

        chatsMessagesDivRef.current = <>
            <Elem elem={chatsMessagesDivRef.current} />
            <Elem elem={elem} />
        </>;

        setChatsMessagesDiv(chatsMessagesDivRef.current);
    }

    const renderChat = (chats:chatType[]=[]) => {
        for (const chat of chats) {
            chatsMessages.current.push(chat);
        }

        let elem:JSX.Element;

        elem =
        <>
            {chatsMessages.current.map((chat)=>
                <div key={`${chat.timestamp}-${Math.random()}`} ref={(el)=>{chatBubbleRef.current[chat.id] = el; return chatBubbleRef.current[chat.id]}}>
                {
                    (props.isGroup) ?
                        <ChatBubble sender="" status="" deleteChat={console.log} unsentChat={console.log} chatID={chat.id} self={chat._self} text={chat.msg} timestamp={chat.timestamp} />
                    :
                        <ChatBubble sender="" status="" deleteChat={deleteChat} unsentChat={unsentChat} chatID={chat.id} self={chat._self} text={chat.msg} timestamp={chat.timestamp} />
                }                                
                </div>    
            )}
        </>

        chatsMessagesDivRef.current = elem;

        setChatsMessagesDiv(chatsMessagesDivRef.current);
    }

    // END REACT FUNCTION -------------------------------------------------
    // EVENT HANDLER -------------------------------------------------
    const handleDeleteAll = () => {      

    }

    const handleSendChat = async () => {

    }

    const handleAttachFile = () => {

    }


    // ENDEVENT HANDLER -------------------------------------------------


    return (
        <>
            <Grid
            container
            direction="column"
            height={props.height}
            spacing={2}
            display={props.show ? "block" : "none"}
            >
                <Grid container item textAlign="center" fontWeight="bold"  justifyContent="space-between">
                    <Grid item style={{marginRight : "auto"}}>
                        <TextField
                            onChange={(e)=>{ setSearchString(e.target.value) }} 
                            label="Search" 
                            size="small" 
                            variant="standard" 
                            sx={{paddingBottom : "10px"}} /> 
                                <IconButton color="primary" 
                                    onClick={()=>{ props.chat.searchChat(searchString,partner.current.pub,partner.current.epub,(s)=>{console.log(s)}) }}>
                                    <Search />
                                </IconButton>
                    </Grid>
                    <Grid item xs>
                        <Typography pt={1}>
                            {props.isGroup ? props.groupName : props.alias}
                        </Typography>
                    </Grid>
                    <Grid item>
                        {
                            // Harusnya di sini isGroup dan isAdmin
                            props.isGroup ?
                            <>
                                <EditGroupChat groupowner={partner.current.groupOwner} groupname={partner.current.groupAlias} fg={props.fg} chat={props.chat} common={common} />
                                <AddAdminButton groupowner={partner.current.groupOwner} groupName={partner.current.groupAlias} fg={props.fg} chat={props.chat} />
                                <InviteButton groupowner={partner.current.groupOwner} groupName={partner.current.groupAlias} fg={props.fg} chat={props.chat} />                                
                            </>                            
                            :
                            <></>
                        }                        
                        <IconButton color="primary" onClick={()=>{ props.fg.clearData() }}><RefreshRounded /></IconButton>
                        <IconButton color="error" onClick={handleDeleteAll}><Delete /></IconButton>
                        <IconButton color="error" onClick={()=>{
                            let elem = document.getElementById(`chatmui-${props.partnerKey}`);
                            if ( elem !== null) {
                                elem.style.display = 'none'
                            }
                        }}><Close /></IconButton>
                    </Grid>
                </Grid>
                <Grid>
                    <Divider />
                </Grid>
                <Grid item height={props.height} style={{overflowY : "scroll"}} id={`chatbox-${props.partnerKey.slice(0,8)}`}>
                    <div style={{padding : "5px 20px"}}>
                    {chatsMessagesDiv}
                    </div>
                </Grid>
                <Grid item container justifyContent="space-between">
                    <Grid item xs>
                        <TextField
                            fullWidth
                            label="Chat"
                            variant="standard"
                            value={textMsg}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setTextMsg( e.target.value )}}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>)=>{if (e.code === "Enter") {sendChat()}}}
                        />
                    </Grid>
                    <Grid pt={1.5} item>
                        <input style={{display: "none"}} type="file" id={`file-${props.partnerKey.slice(0,8)}`} onChange={handleAttachFile} />
                        <Button
                            color="primary"
                            variant="text"
                            onClick={()=>{(document.getElementById(`file-${props.partnerKey.slice(0,8)}`) as any).click()}}
                            endIcon={<AttachFile />}
                        ></Button>
                        <Button
                            color="primary"
                            variant="contained"
                            endIcon={<Send />}
                            onClick={handleSendChat}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )

}