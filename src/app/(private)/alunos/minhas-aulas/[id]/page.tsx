"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  dadosPlano,
  getAllPlano,
} from "@/app/http/planos-treino/get-all-planos";

export default function PlanoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const planoId = Number(params.id);

  const [plano, setPlano] = useState<dadosPlano | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlano = async () => {
      try {
        const planos = await getAllPlano(4); // id do aluno logado
        const encontrado = planos.find((p) => p.id === planoId);
        setPlano(encontrado || null);
      } catch (error) {
        console.error("Erro ao carregar plano:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlano();
  }, [planoId]);

  if (isLoading) {
    return <div className="mt-10 text-center text-white">Carregando...</div>;
  }

  if (!plano) {
    return (
      <div className="mt-10 text-center text-white">Plano não encontrado.</div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupExercisesByMuscle = (sessao: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sessao.itemExercicios.reduce((groups: any, item: any) => {
      const muscleGroup = item.ExercicioPersonal.grupo_muscular;
      if (!groups[muscleGroup]) {
        groups[muscleGroup] = [];
      }
      groups[muscleGroup].push(item);
      return groups;
    }, {});
  };

  return (
    <div className="min-h-scree text-white">
      {/* Header */}
      <header className="mb-4 flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-orange-400"
        >
          <ChevronLeft className="size-6" />
          <h1 className="text-lg font-semibold text-white">Treinos</h1>
        </button>
      </header>

      {/* Dias da semana */}
      {/* <div className="flex justify-between text-center mb-6">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, index) => (
          <div key={index} onClick={() => setSelectedDay(index)} className="flex flex-col items-center cursor-pointer">
            <span className="text-xs">{dia}</span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                selectedDay === index ? "bg-orange-400 text-purple-900 font-bold" : "bg-purple-800"
              }`}
            >
              {10 + index}
            </div>
          </div>
        ))}
      </div> */}

      {/* Grupo muscular e exercícios */}
      {/* Sessões de treino */}
      <div className="min-h-screen space-y-8 rounded-b-none rounded-t-3xl bg-purple-900 p-4">
        {plano.SessaoTreinos.length > 0 ? (
          plano.SessaoTreinos.map((sessao) => (
            <div key={sessao.id} className="space-y-4">
              {/* Título da sessão (Dia da semana OU identificador) */}
              <h2 className="text-lg font-semibold text-white">
                {sessao.identificador}
              </h2>

              <div className="grid gap-4">
                {sessao.itemExercicios.map((item) => (
                  <div
                    key={item.id}
                    className="grid cursor-pointer grid-cols-[1fr_auto] items-center rounded-2xl bg-yellow-900 p-3 text-purple-900 transition hover:opacity-90"
                    onClick={() =>
                      router.push(`exercicio/${item.ExercicioPersonal.id}`)
                    }
                  >
                    <div>
                      {/* Título da sessão antes do nome */}
                      <p className="mb-1 text-[11px] font-semibold text-purple-700">
                        {sessao.titulo}
                      </p>

                      <h3 className="text-sm font-semibold">
                        {item.ExercicioPersonal.nome}
                      </h3>

                      <p className="text-xs">Séries: {item.series}</p>
                      <p className="text-xs">Repetições: {item.repeticoes}</p>
                      <p className="text-xs">
                        Descanso: {item.tempo_descanso_segundos} seg
                      </p>
                    </div>

                    <div className="row-span-2 flex justify-center text-orange-500">
                      <ChevronLeft className="size-6 rotate-180 sm:size-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">Nenhum exercício encontrado.</p>
        )}
      </div>
    </div>
  );
}
