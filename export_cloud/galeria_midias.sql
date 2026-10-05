-- Export Cloud: galeria_midias (9 registros)
INSERT INTO public.galeria_midias (id, titulo, url, criado_em) VALUES
  ('18abbe67-ea5c-4a2e-979e-7d4997f79c4d', 'logo_radio', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1785882703082_p3mt7t1.png', '2026-08-04 22:31:43.144026+00'),
  ('e5e8148f-d134-45ac-b012-7b5ef0036a4e', 'Logo Rádio horizontal', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1785937045886_wk0pcqz.webp', '2026-08-05 13:37:26.665317+00'),
  ('1a5eacf5-dec8-4b8d-8024-d1f9e5e360fa', 'logo radio black', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786059035334_uzrk66y.webp', '2026-08-06 23:30:35.845052+00'),
  ('eb659510-8424-46a8-b9ba-faa545603f9c', 'ddn favicon', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786114821585_dzoi8p5.webp', '2026-08-07 15:00:22.933085+00'),
  ('ec423c41-781e-434d-b5df-87b0ad06f9ac', 'radio feliz', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786134258461_ugx71b1.webp', '2026-08-07 20:24:19.010177+00'),
  ('8765a23a-5682-4a7c-ad2d-e0501c6c66d2', 'radio feliz gif', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1786134294175_tb09ma1.gif', '2026-08-07 20:24:55.756783+00'),
  ('de8fa658-0773-4561-8ea0-e5eb343b554f', 'Mito ou verdade', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1787343616696_grnyaim.webp', '2026-08-21 20:20:15.678446+00'),
  ('c3f0677e-83d0-4ca6-a31f-227a5d6089ec', 'Cuidar Feliz aniversario', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1788452556604_i33a5gp.webp', '2026-09-03 16:22:35.394211+00'),
  ('ad826904-0d24-4629-9274-ec7fdac1148a', 'Minuto saude', 'https://mkbnqyhvaozqfpmcyoyw.supabase.co/storage/v1/object/public/imagens/galeria/1788470122243_a4qej3h.webp', '2026-09-03 21:15:23.207726+00')
ON CONFLICT (id) DO NOTHING;
