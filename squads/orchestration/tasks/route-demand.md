# Route Demand

## Descricao
Receber uma demanda de negocio, analisar contexto, classificar por dominio
e rotear para o squad head correto utilizando o routing_matrix.

## Input
- Descricao da demanda (texto livre ou briefing estruturado)
- Contexto adicional: urgencia, squad de origem (se houver), stakeholder

## Output
- Squad destino identificado
- Agent destino (entry_agent do squad)
- Justificativa do routing (1-2 linhas)
- Prioridade atribuida (P0-P3)

## Passos
1. Ler a demanda e extrair palavras-chave
2. Consultar routing_matrix para match de dominio
3. Se match ambiguo (2+ squads), verificar cross-squad-overlaps.md
4. Rotear para entry_agent do squad destino
5. Registrar decisao de routing para auditoria

## Quality Gate
- Threshold: >70%
- Match de dominio justificado com evidencia do routing_matrix
- Prioridade atribuida com criterio (urgencia + impacto)
- Nenhuma demanda descartada sem justificativa

## O que NAO faz
- NAO executa a demanda (apenas roteia)
- NAO cria tasks nos squads destino
- NAO altera prioridades existentes de outros squads
