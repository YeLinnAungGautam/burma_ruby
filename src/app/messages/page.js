"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import FooterBar from "@/components/Layout/FooterBar";

function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const router = useRouter();
  const [conversations, setConversations] = useState([
    {
      id: 1,
      productName: "Natural Ruby 2",
      productImage:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      ownerName: "Ruby Collections",
      ownerAvatar:
        "https://ui-avatars.com/api/?name=Ruby+Collections&background=DC2626&color=fff",
      lastMessage: "This is a beautiful piece! Is it still available?",
      lastMessageTime: "2:30 PM",
      unread: 2,
      sku: "RBY-423139-488",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Hello! I'm interested in this ruby. Can you tell me more about it?",
          time: "2:15 PM",
          date: "Today",
        },
        {
          id: 2,
          sender: "owner",
          text: "Hello! Thank you for your interest. This is a stunning natural ruby from Myanmar with pigeon blood color.",
          time: "2:20 PM",
          date: "Today",
        },
        {
          id: 3,
          sender: "me",
          text: "This is a beautiful piece! Is it still available?",
          time: "2:30 PM",
          date: "Today",
        },
      ],
    },
    {
      id: 2,
      productName: "Blue Sapphire",
      productImage:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400",
      ownerName: "Gem Palace",
      ownerAvatar:
        "https://ui-avatars.com/api/?name=Gem+Palace&background=2563EB&color=fff",
      lastMessage: "Yes, we can arrange a viewing for you.",
      lastMessageTime: "Yesterday",
      unread: 0,
      sku: "SPH-789456-123",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "I'd like to see this sapphire in person.",
          time: "4:30 PM",
          date: "Yesterday",
        },
        {
          id: 2,
          sender: "owner",
          text: "Yes, we can arrange a viewing for you.",
          time: "5:15 PM",
          date: "Yesterday",
        },
      ],
    },
    {
      id: 3,
      productName: "Emerald Ring Set",
      productImage:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
      ownerName: "Emerald Dreams",
      ownerAvatar:
        "https://ui-avatars.com/api/?name=Emerald+Dreams&background=059669&color=fff",
      lastMessage: "The certification is from GIA.",
      lastMessageTime: "Nov 6",
      unread: 0,
      sku: "EMR-654321-789",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "What certification does this emerald have?",
          time: "10:00 AM",
          date: "Nov 6",
        },
        {
          id: 2,
          sender: "owner",
          text: "The certification is from GIA.",
          time: "10:30 AM",
          date: "Nov 6",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: "Just now",
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
    });
    setMessageInput("");
  };

  return (
    <div className="h-screen bg-white relative flex overflow-hidden">
      {/* header */}

      {/* footer */}
      {!selectedConversation && <FooterBar />}

      {/* Sidebar - Conversations List */}
      <div
        className={`w-full md:w-96 relative border-r border-gray-200 flex flex-col ${
          selectedConversation ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Burma Rubies Messages
          </h1>
          <button className="text-red-600 hover:text-red-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto pt-2">
          <div className="p-4">
            <div className="w-full flex justify-between items-center">
              <div className="relative bg-white/50 backdrop-blur-lg rounded-full shadow-lg border border-black/20 flex items-center justify-center gap-2 py-2 w-2xl">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full  rounded-lg pl-16 pr-4 py-1.5 text-lg focus:outline-none "
                />
                <Search className="w-6 h-6 absolute left-4 top-4 text-black" />
              </div>
            </div>
          </div>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id
                  ? "bg-gray-100"
                  : ""
              }`}
            >
              {/* Product Image */}
              <div className="relative shrink-0">
                <Image
                  src={conversation.productImage}
                  alt={conversation.productName}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                {conversation.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {conversation.unread}
                    </span>
                  </div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {conversation.productName}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2 shrink-0">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {conversation.ownerName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          selectedConversation ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                {/* Back Button for Mobile */}
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden text-red-600 hover:text-red-700 mr-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <Image
                  src={selectedConversation.productImage}
                  alt={selectedConversation.productName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 text-base truncate">
                    {selectedConversation.productName}
                  </h2>
                  <p className="text-xs text-gray-600 truncate">
                    {selectedConversation.ownerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  href={`/products/${selectedConversation.sku}`}
                  className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium"
                >
                  View
                </Link>
                <button className="text-gray-600 hover:text-gray-900">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white">
              {/* Product Card */}
              <div className="mb-6 flex justify-center">
                <Link
                  href={`/products/${selectedConversation.sku}`}
                  className="bg-gray-50 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-gray-100 transition-colors max-w-md w-full"
                >
                  <Image
                    src={selectedConversation.productImage}
                    alt={selectedConversation.productName}
                    width={80}
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base truncate">
                      {selectedConversation.productName}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      SKU: {selectedConversation.sku}
                    </p>
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      View Details →
                    </p>
                  </div>
                </Link>
              </div>

              {/* Messages */}
              <div className="space-y-3 md:space-y-4">
                {selectedConversation.messages.map((message, index) => {
                  const showDate =
                    index === 0 ||
                    selectedConversation.messages[index - 1].date !==
                      message.date;

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center mb-3 md:mb-4">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {message.date}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${
                          message.sender === "me"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-xs md:max-w-md lg:max-w-lg ${
                            message.sender === "me"
                              ? "bg-white/50 backdrop-blur-2xl text-gray-900"
                              : "bg-gray-100 text-gray-900"
                          } rounded-3xl px-3.5 md:px-4 py-2 md:py-2.5 shadow-sm`}
                        >
                          <p className="text-base leading-relaxed wrap-break-word">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "me"
                                ? "text-gray-500"
                                : "text-gray-500"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 px-3 md:px-6 py-3 md:py-4 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-2 md:gap-3"
              >
                <button
                  type="button"
                  className="hidden sm:block shrink-0 text-gray-400 hover:text-gray-600 mb-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <div className="flex-1 bg-gray-100 rounded-3xl px-3 md:px-4 py-2 flex items-end gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="iMessage"
                    rows="1"
                    className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32"
                  />
                  <button
                    type="button"
                    className="hidden sm:block shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="shrink-0 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-2 mb-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Conversation Selected
              </h3>
              <p className="text-gray-600">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
