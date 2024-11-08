CREATE TABLE Funcionarios (
    id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_admissao DATE NOT NULL
);

CREATE TABLE Gerentes (
    id_gerente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_admissao DATE NOT NULL
);

CREATE TABLE Tarefas (
    id_tarefa INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    data_criacao DATE NOT NULL,
    prazo DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Em andamento', 'Concluída', 'Pendente')),
    id_funcionario INT NOT NULL,
    id_gerente INT NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionarios(id_funcionario),
    FOREIGN KEY (id_gerente) REFERENCES Gerentes(id_gerente)
);

CREATE VIEW TarefasFuncionarios AS
SELECT t.id_tarefa, t.descricao, t.data_criacao, t.prazo, t.status, f.nome AS nome_funcionario, g.nome AS nome_gerente
FROM Tarefas t
JOIN Funcionarios f ON t.id_funcionario = f.id_funcionario
JOIN Gerentes g ON t.id_gerente = g.id_gerente;

SELECT * FROM TarefasFuncionarios;
