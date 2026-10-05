-- Export Cloud: autores (1 registros)
INSERT INTO public.autores (id, nome, foto_url, bio, criado_em) VALUES
  ('1e79060a-b850-4054-ae69-783db846d5fd', 'Redação Dia a Dia Nordeste', NULL, 'Equipe de jornalismo do portal Dia a Dia Nordeste.', '2026-08-01 18:19:42.047123+00')
ON CONFLICT (id) DO NOTHING;
