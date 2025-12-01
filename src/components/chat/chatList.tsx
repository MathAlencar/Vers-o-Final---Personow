import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type chatUsuario = {
  id_chat: number;
  ultimaMensagem: {
    id: number;
    tipo_remetente: string;
    conteudo: string;
    created_at: string;
  };
  usuario: {
    usuarioFotos: [{ url: string; filename: string }];
    nome: string;
  };
  aluno_id: number;
  personal_id: number;
  updated_at: string;
  created_at: string;
};

type ChatListProps = {
  chats: chatUsuario[];
  url: string;
};

export function ChatList({ chats, url }: ChatListProps) {
  console.log(chats);
  return chats.map((chat) => (
    <div
      key={chat.id_chat}
      className="grid h-20 grid-flow-col grid-rows-1 items-center rounded-[15px] bg-purple-800 text-gray-200 md:m-1 md:w-1/3 md:grid-rows-2 md:justify-items-center md:bg-purple-900"
    >
      <div className="row-span-2 mr-2 flex justify-center text-sm text-orange-500">
        <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full border-2 border-orange-500">
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
      <div className="row-span-2 flex w-28 max-w-[240px] flex-col items-start pt-2 sm:w-60">
        <h2 className="line-clamp-1 break-words text-base text-gray-200 md:w-60">
          {chat.usuario.nome}
        </h2>
        <span className="line-clamp-1 break-words pb-3 text-sm text-gray-400 md:w-60">
          {chat.ultimaMensagem === undefined
            ? "Sem mensagens"
            : chat.ultimaMensagem.conteudo.length > 15
              ? chat.ultimaMensagem.conteudo.slice(0, 15) + "..."
              : chat.ultimaMensagem.conteudo}
        </span>
      </div>
      <Link
        href={`${url}${chat.aluno_id}-${chat.personal_id}`}
        className="row-span-2 flex justify-center text-orange-500"
        aria-label="Abrir chat"
      >
        <ChevronRightIcon className="size-10" />
      </Link>
    </div>
  ));
}
