-- Ejecutar en SQL Editor de Supabase.
create table if not exists public.puntos (
 id integer primary key,
 nombre text not null,
 categoria text not null,
 latitud double precision not null,
 longitud double precision not null,
 valor integer not null,
 fecha date,
 descripcion text
);
alter table public.puntos enable row level security;
-- Solo lectura pública de estos datos ficticios.
create policy "Lectura publica de puntos" on public.puntos for select to anon using (true);
-- Importar dataset_entregas.csv desde Table Editor > puntos > Import data from CSV.
