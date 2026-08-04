import { useMemo, useState } from "react";
import { ImagePlus, Paperclip, Phone, Search, Send, UserRound, Video } from "lucide-react";
import { demoProperties } from "../../../data/demoProperties.js";
import "./MessagesPage.css";

const initialConversations = [
  { id: 1, name: "Danial Doe", role: "Agent", online: true, unread: 2, property: demoProperties[0], messages: [{ from: "them", text: "Hi, are you interested in scheduling a viewing?", time: "10:24" }, { from: "me", text: "Yes, tomorrow morning works for me.", time: "10:26" }] },
  { id: 2, name: "Nimali Perera", role: "Seller", online: false, unread: 0, property: demoProperties[1], messages: [{ from: "them", text: "The apartment is still available.", time: "Yesterday" }] },
  { id: 3, name: "Gewal.lk Support", role: "Support", online: true, unread: 1, property: null, messages: [{ from: "them", text: "Your listing is under review. We will notify you soon.", time: "09:10" }] },
];

function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(1);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const filtered = useMemo(() => conversations.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.role.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const activeConversation = conversations.find((item) => item.id === activeId) || conversations[0];

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim() && !attachment) return;
    const newMessage = { from: "me", text: message.trim() || `Attachment: ${attachment.name}`, time: "Now", attachment: attachment?.preview };
    setConversations((current) => current.map((item) => item.id === activeId ? { ...item, messages: [...item.messages, newMessage], unread: 0 } : item));
    setMessage("");
    setAttachment(null);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setConversations((current) => current.map((item) => item.id === activeId ? { ...item, messages: [...item.messages, { from: "them", text: "Thanks, I will get back to you shortly.", time: "Now" }] } : item));
    }, 900);
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachment({ name: file.name, preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null });
  };

  return (
    <main className="messages-page">
      <section className="container messages-hero">
        <span>Messaging Center</span>
        <h1>Conversations with agents, sellers and support</h1>
        <p>Manage property inquiries, appointments and follow-ups in one clean chat workspace.</p>
      </section>

      <section className="container messages-shell">
        <aside className="messages-list">
          <label className="messages-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations" /></label>
          {filtered.map((conversation) => (
            <button key={conversation.id} className={activeId === conversation.id ? "is-active" : ""} onClick={() => setActiveId(conversation.id)}>
              <span className={conversation.online ? "avatar is-online" : "avatar"}><UserRound size={20} /></span>
              <div><strong>{conversation.name}</strong><small>{conversation.role} · {conversation.messages.at(-1)?.text}</small></div>
              {conversation.unread > 0 && <i>{conversation.unread}</i>}
            </button>
          ))}
        </aside>

        <div className="chat-panel">
          <header className="chat-header">
            <div><span className={activeConversation.online ? "avatar is-online" : "avatar"}><UserRound size={20} /></span><div><strong>{activeConversation.name}</strong><small>{activeConversation.online ? "Online now" : "Offline"}</small></div></div>
            <nav><button><Phone size={18} /></button><button><Video size={18} /></button></nav>
          </header>

          {activeConversation.property && (
            <article className="chat-property-card">
              <img src={activeConversation.property.image} alt={activeConversation.property.title} />
              <div><strong>{activeConversation.property.title}</strong><span>{activeConversation.property.price}</span><small>{activeConversation.property.location}</small></div>
              <a href={`/properties/${activeConversation.property.id}`}>View</a>
            </article>
          )}

          <div className="chat-window">
            {activeConversation.messages.map((item, index) => (
              <div key={`${item.time}-${index}`} className={item.from === "me" ? "chat-message chat-message--me" : "chat-message"}>
                {item.attachment && <img src={item.attachment} alt="Attachment" />}
                <p>{item.text}</p><span>{item.time} · {item.from === "me" ? "Seen" : ""}</span>
              </div>
            ))}
            {typing && <div className="chat-typing"><i /><i /><i /> typing...</div>}
          </div>

          <form className="chat-composer" onSubmit={sendMessage}>
            {attachment && <div className="chat-attachment">{attachment.preview ? <img src={attachment.preview} alt="Preview" /> : <Paperclip size={16} />}<span>{attachment.name}</span><button type="button" onClick={() => setAttachment(null)}>×</button></div>}
            <label><ImagePlus size={20} /><input type="file" onChange={handleAttachment} /></label>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
            <button><Send size={18} /> Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default MessagesPage;
