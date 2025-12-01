"use client";

import { useEffect, useState } from "react";

import { getAulaPersonal } from "@/app/http/agenda/get-aulas";
import getAluno, { getAlunoResponse } from "@/app/http/aluno/get-aluno";
import { TablePersonal } from "@/components/tablePersonal";
import Modal from "@/components/ui/modal";

const Column = [
  { key: "id", label: "Id", searchable: true },
  { key: "nome", label: "Nome", searchable: true },
  { key: "email", label: "E-mail" },
];

export default function MeusAlunos() {
  const [dados, setDados] = useState<
    { id: string; nome: string; email: string }[]
  >([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alunoDetalhe, setAlunoDetalhe] = useState<getAlunoResponse | null>(
    null,
  );
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);

  useEffect(() => {
    async function getAlunos() {
      const idPersonal = localStorage.getItem("id");
      if (idPersonal !== null) {
        const response = await getAulaPersonal(idPersonal);

        // Filtra apenas as aulas aceitas e mapeia os alunos
        const aulasAceitas =
          response?.AulaAgendas?.filter((dado) => dado.status === "aceita").map(
            (dado) => ({
              id: dado.aluno_id,
              nome: dado.Aluno?.nome ?? "",
              email: dado.Aluno?.email ?? "",
            }),
          ) ?? [];

        // Remove duplicados com base no id do aluno
        const alunosUnicos = Array.from(
          new Map(aulasAceitas.map((aluno) => [aluno.id, aluno])).values(),
        );

        setDados(alunosUnicos);
      }
    }

    getAlunos();
  }, []);

  const abrirModal = async (id: string) => {
    setModalOpen(true);
    setLoadingDetalhe(true);
    try {
      const response = await getAluno(Number(id));
      const aluno_formatado = {
        ...response,
        dateNascimento: response.dateNascimento
          ? new Date(response.dateNascimento).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
      };
      setAlunoDetalhe(aluno_formatado);
    } catch (error) {
      console.error("Erro ao buscar detalhes do aluno:", error);
    } finally {
      setLoadingDetalhe(false);
    }
  };

  const fecharModal = () => {
    setAlunoDetalhe(null);
    setModalOpen(false);
  };

  return (
    <>
      <TablePersonal
        title="Lista de Alunos"
        addLabel="Catálogo de exercícios"
        columns={Column}
        data={dados}
        onAdd={() => (window.location.href = "/admin/catalogo-exercicios")}
        actions={[
          {
            label: "Aulas",
            onClick: (row) => (window.location.href = `meus-alunos/${row.id}`),
          },
          {
            label: "Ver mais informações",
            onClick: (row) => abrirModal(row.id),
          },
        ]}
      />

      {/* ======= Modal ======= */}
      <Modal
        isOpen={modalOpen}
        onClose={fecharModal}
        title={alunoDetalhe ? `${alunoDetalhe.nome}` : "Carregando..."}
      >
        {loadingDetalhe ? (
          <p>Carregando informações do aluno...</p>
        ) : alunoDetalhe ? (
          <div className="space-y-2 text-sm">
            <p>
              <b>Nome:</b> {alunoDetalhe.nome}
            </p>
            {alunoDetalhe.dateNascimento && (
              <p>
                <b>Data de Nascimento:</b> {alunoDetalhe.dateNascimento}
              </p>
            )}
            {alunoDetalhe.genero && (
              <p>
                <b>Gênero:</b> {alunoDetalhe.genero}
              </p>
            )}
            {alunoDetalhe.altura && (
              <p>
                <b>Altura:</b> {alunoDetalhe.altura}
              </p>
            )}
            {alunoDetalhe.peso && (
              <p>
                <b>Peso:</b> {alunoDetalhe.peso}
              </p>
            )}
            {alunoDetalhe.condicaoMedica && (
              <p>
                <b>Condição Médica:</b> {alunoDetalhe.condicaoMedica}
              </p>
            )}
            {alunoDetalhe.historicoLesao && (
              <p>
                <b>Histórico de Lesões:</b> {alunoDetalhe.historicoLesao}
              </p>
            )}
            {alunoDetalhe.nivelAtividade && (
              <p>
                <b>Nível de Atividade:</b> {alunoDetalhe.nivelAtividade}
              </p>
            )}
            {alunoDetalhe.objetivo && (
              <p>
                <b>Objetivo:</b> {alunoDetalhe.objetivo}
              </p>
            )}
            {alunoDetalhe.Endereco && (
              <p>
                <b>Endereço:</b> {alunoDetalhe.Endereco}
              </p>
            )}
          </div>
        ) : (
          <p>Não foi possível carregar os dados do aluno.</p>
        )}
      </Modal>
    </>
  );
}
