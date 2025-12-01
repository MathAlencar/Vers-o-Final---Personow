"use client";

import { Calendar, ChevronLeft, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PersonalAgenda from "@/app/(private)/alunos/personal/agenda";
import createChat from "@/app/http/chat/create-chat";
import getAllPlanoPagamento, {
  GetAllPlanoResponse,
} from "@/app/http/pagamentos/get-all-planos";
import { getPersonalResponse } from "@/app/http/personal/get-personal";
import { useAlunoContext } from "@/context/AlunoContext";

import { PlanoIcon } from "../plano-svg";

type ProfileDetailsProps = {
  personal: getPersonalResponse;
};

export function ProfileDetails({ personal }: ProfileDetailsProps) {
  const router = useRouter();
  const { state } = useAlunoContext();

  const [openAgenda, setOpenAgenda] = useState(false);

  // PLANOS
  const [planos, setPlanos] = useState<GetAllPlanoResponse[]>([]);
  const [planoAtivo, setPlanoAtivo] = useState<string>("");

  async function carregarPlanos() {
    try {
      const res = await getAllPlanoPagamento(String(personal.id));
      setPlanos(res);

      if (res.length > 0) {
        setPlanoAtivo(res[0].tipo_plano); // primeira aba ativa
      }
    } catch (e) {
      console.log("Erro ao carregar planos", e);
    }
  }

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function onSubmit() {
    const NewChat = {
      usuario1_id: Number(state.id),
      tipo_usuario1: "aluno",
      usuario2_id: personal.id,
      tipo_usuario2: "personal",
    };

    try {
      await createChat(NewChat);
      router.push(`/alunos/mensagens/${state.id}-${personal.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg = error?.errors?.[0] || "";
      if (
        errorMsg.includes(
          "Já existe uma conversa iniciada entre este aluno e o Personal",
        )
      ) {
        router.push(`/alunos/mensagens/${state.id}-${personal.id}`);
      }
    }
  }

  return (
    <div className="flex h-full flex-col justify-between">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center text-white">
        <div className="text-center text-xs">
          <Image
            src={
              Array.isArray(personal.PersonalFotos) &&
              personal.PersonalFotos.length > 0
                ? `/api/proxy/images/${personal.PersonalFotos.at(-1)?.filename}`
                : "/perfil-sem-foto.png"
            }
            alt={`Foto de ${personal.nome}`}
            width={120}
            height={120}
            priority
            className="-translate-y-10 rounded-full border-4 border-orange-500 object-cover"
          />
        </div>

        <div className="grid grid-cols-3 items-center text-center text-xs">
          <a href="/alunos/home">
            <ChevronLeft className="h-5 w-5 text-white" />
          </a>
          <div>
            <h1 className="font-bold">{personal.nome}</h1>
            <h2 className="font-semibold text-gray-300">
              {personal.profissao}
            </h2>
            <span>{personal.cidade}</span>
          </div>
        </div>
      </div>

      {/* SOBRE MIM */}
      <div className="mx-auto flex-1 px-4 py-6 text-white md:max-w-md">
        <div className="flex-1 overflow-auto">
          <h1 className="text-sm">Sobre mim</h1>
          <span className="break-words">{personal.descricao}</span>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm">Formação</h2>
              <span>{personal.formacao}</span>
            </div>

            <div>
              <h2 className="text-sm">Experiência</h2>
              <span>{personal.experiencia}</span>
            </div>

            <div>
              <h2 className="text-sm">Área de atuação</h2>
              <span>{personal.areaAtuacao}</span>
            </div>

            <div>
              <h2 className="text-sm">Modelo de atendimento</h2>
              <span>{personal.modeloAtendimento}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PLANOS DINÂMICOS */}
      {planos.length > 0 && (
        <div className="mx-auto mt-2 flex w-full flex-col gap-4 md:w-1/3">
          <div className="flex flex-row gap-4">
            <PlanoIcon />
            <h1 className="mb-3 font-semibold text-white">Planos</h1>
          </div>
          <div className="rounded-xl border border-white/40 p-2 text-white">
            {/* ABAS */}
            <div className="text-s grid grid-cols-4 text-center">
              {["Avulsa", "Experimental", "Mensal", "Bimestral", "Trimestral"]
                .filter((tipo) => planos.some((p) => p.tipo_plano === tipo))
                .map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setPlanoAtivo(tipo)}
                    className={`py-2 transition ${
                      planoAtivo === tipo
                        ? "border-b-2 border-orange-500 font-semibold"
                        : "border-b border-white/30"
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
            </div>

            {/* CONTEÚDO DO PLANO */}
            <div className="mt-4 text-center">
              {(() => {
                const plano = planos.find((p) => p.tipo_plano === planoAtivo);
                if (!plano) return null;

                return (
                  <>
                    <p className="text-sm">
                      Plano {plano.tipo_plano} -{" "}
                      {plano.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>

                    <button
                      className="mt-5 w-full rounded-lg bg-[#1A131C] py-2 font-semibold text-white"
                      onClick={() => console.log("Selecionado:", plano)}
                    >
                      Continuar
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* BOTÕES */}
      <div className="mx-auto mt-6 flex w-full flex-col gap-4 md:w-1/3">
        <button
          onClick={onSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-orange-500 p-2 text-orange-500 transition hover:bg-orange-500 hover:text-white"
        >
          <MessageCircleMore size={20} />
          Enviar mensagem
        </button>

        <button
          onClick={() => setOpenAgenda(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 p-2 text-white transition hover:bg-orange-600"
        >
          <Calendar size={20} />
          Marcar Reunião
        </button>
      </div>

      {openAgenda && (
        <PersonalAgenda setAgenda={setOpenAgenda} personalId={personal.id} />
      )}
    </div>
  );
}
