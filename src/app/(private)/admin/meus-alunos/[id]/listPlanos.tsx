import { ChevronRight, Trash2 } from "lucide-react";

import {
  dadosPlano,
  dadosSessao,
} from "@/app/http/planos-treino/get-all-planos";
import { Label } from "@/components/ui/label";

type PlanoListProps = {
  planos: dadosPlano[];
  onExcluirPlano: (id: number) => void;
  onExcluirSessao: (planoId: number, sessaoId: number) => void;
  onOpenModal: (
    type: "VerExercicios" | "CriarPlano" | "CriarSessao",
    sessao?: dadosSessao,
  ) => void;
};

export default function PlanoList({
  planos,
  onExcluirPlano,
  onExcluirSessao,
  onOpenModal,
}: PlanoListProps) {
  return (
    <div className="max-h-[75vh] w-full overflow-y-auto rounded-lg bg-purple-800">
      <div className="flex items-center p-5 text-white">
        <Label>Lista dos planos</Label>
      </div>

      <div className="flex flex-col gap-4 px-5">
        {planos.length > 0 ? (
          planos.map((plano) => (
            <div
              key={`plano-${plano.id}-${plano.nome}`}
              className="flex flex-col gap-2 rounded-lg bg-[#FFEE58] p-3 text-gray-700 shadow-xl"
            >
              <div className="flex justify-between md:text-base">
                <span className="text-md font-medium">{plano.nome}</span>
                <span className="text-md">{plano.status}</span>
              </div>
              <div className="flex items-center justify-between">
                {" "}
                <span className="text-xs">
                  {new Date(plano.data_inicio).toLocaleDateString("pt-BR")} →{" "}
                  {new Date(plano.data_fim).toLocaleDateString("pt-BR")}
                </span>
                <button onClick={() => onExcluirPlano(plano.id)}>
                  <Trash2 size={18} />
                </button>
              </div>

              {/* ======= Sessões ======= */}
              <div className="mt-2 rounded p-1 text-sm">
                {plano.SessaoTreinos.length > 0 ? (
                  plano.SessaoTreinos.map((sessao) => (
                    <div
                      key={`sessao-${sessao.id}-${sessao.titulo}`}
                      className="flex items-center justify-between rounded-sm border-gray-700 bg-orange-500 p-1 py-1"
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => onExcluirSessao(plano.id, sessao.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span className="text-xs">
                        <b>{sessao.titulo}:</b> {sessao.identificador}
                      </span>
                      <ChevronRight
                        onClick={() => onOpenModal("VerExercicios", sessao)}
                        className="cursor-pointer text-black hover:text-orange-700"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-gray-700">
                    Ainda não há sessões criadas.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-white opacity-80">
            Nenhum plano de treino cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
