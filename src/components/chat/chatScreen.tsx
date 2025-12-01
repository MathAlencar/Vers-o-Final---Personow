"use client";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRef, useState } from "react";

import createMessage from "@/app/http/chat/create-message";
import { connectSocket, socket } from "@/lib/socket";

import { Mensagem } from "./mensagem";

export type mensagensChat = {
  id_chat: number;
  mensagens: {
    id: number;
    tipo_remetente: string;
    conteudo: string;
    created_at: string;
  }[];
  usuario: {
    id: number;
    nome: string;
    usuarioFotos: [{ url: string; filename: string }];
  };
  remetende_id: number;
  tipo_rementente: string;
  backUrl: string;
  updated_at: string;
  created_at: string;
};

type ChatScreenProps = {
  chat: mensagensChat;
};

export function ChatScreen({ chat }: ChatScreenProps) {
  // Ordena o vetor pela data, da mais antiga para a mais recente
  const messages = chat.mensagens;
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const [mensagens, setmensagens] = useState(sortedMessages);
  const messageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    connectSocket();

    // entrar automaticamente na sala da conversa (se seu backend usa sala)
    socket.emit("join_conversation", chat.id_chat);

    // receber mensagem
    socket.on("nova_mensagem", (msg) => {
      setmensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("nova_mensagem");
    };
  }, [chat.id_chat]);

  // Função que envia uma nova mensagem
  async function handleCreateMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (messageInput.current === null) return;
    const NewMessage = {
      conversa_id: chat.id_chat,
      remetente_id: chat.remetende_id,
      tipo_remetente: chat.tipo_rementente,
      conteudo: messageInput.current.value,
    };

    try {
      await createMessage(NewMessage);
      if (messageInput.current) messageInput.current.value = "";
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }
  return (
    <div className="flex h-full flex-col justify-between rounded-t-[20px] bg-purple-900 text-white">
      <div className="flex flex-col items-center justify-center text-white">
        <div className="text-center text-xs">
          <div className="relative h-[70px] w-[70px] -translate-y-10 overflow-hidden rounded-full border-2 border-orange-500">
            <Image
              src={
                Array.isArray(chat.usuario.usuarioFotos) &&
                chat.usuario.usuarioFotos.length > 0
                  ? `/api/proxy/images/${chat.usuario.usuarioFotos.at(-1)?.filename}`
                  : "/perfil-sem-foto.png"
              }
              alt="Foto"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 items-center text-center md:text-2xl">
          <Link href={chat.backUrl}>
            <ChevronLeft className="size-5 text-orange-500" />
          </Link>
          <div>
            <h1 className="font-bold">{chat.usuario.nome}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {mensagens.map((msg) => {
          const tipo =
            msg.tipo_remetente === chat.tipo_rementente
              ? "enviada"
              : "recebida";
          return (
            <Mensagem
              key={msg.id}
              conteudo={msg.conteudo}
              data={msg.created_at}
              tipo={tipo}
            />
          );
        })}
      </div>

      <div className="rounded-[10px] p-3">
        <form onSubmit={handleCreateMessage}>
          <input
            type="text"
            className="w-full rounded-[8px] border border-secondary-web p-2 text-black focus:outline-none"
            placeholder="Escreva uma mensagem"
            ref={messageInput}
          ></input>
        </form>
      </div>
    </div>
  );
}
