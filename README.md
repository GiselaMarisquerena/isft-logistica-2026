# Mapa de entregas en Buenos Aires — ISFT Logística

PoC educativa con 50 registros ficticios. **No contiene datos reales de entregas.**

## 1. Crear base de datos
1. Crear un proyecto en https://supabase.com/.
2. En SQL Editor, ejecutar `supabase.sql`.
3. En Table Editor, abrir `puntos` e importar `dataset_entregas.csv` (encabezados incluidos).
4. Verificar que existan 50 filas. La política SQL habilita solo lectura anónima; no agregar datos privados.

## 2. Ejecutar en la computadora
1. Instalar Node.js 20.19+ o 22.12+.
2. En la carpeta del proyecto ejecutar `npm install`.
3. Copiar `.env.example` a `.env.local`.
4. En Supabase > Project Settings / API Keys, copiar Project URL y la clave pública (anon/publishable). **Nunca usar service_role ni secret key en Vite.**
5. Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`.
6. Ejecutar `npm run dev` y abrir la dirección indicada.
7. Revisar la consola del navegador: `Datos recibidos desde Supabase:` debe mostrar 50 registros.

## 3. Publicar en Vercel
1. Subir la carpeta del proyecto a un repositorio de GitHub (no subir `.env.local`).
2. En https://vercel.com/ elegir Add New > Project, importar el repositorio.
3. Framework: Vite. Build command: `npm run build`; Output directory: `dist`.
4. En Environment Variables agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos valores.
5. Deploy. Abrir la URL pública desde otro dispositivo y verificar que aparezcan los 50 puntos.
6. Sacar una captura del tablero para entregar.

## Entrega
- URL pública de Vercel: **completar después del despliegue**.
- Captura de pantalla: **tomar después del despliegue**.
- Código: esta carpeta.
- Dataset: `dataset_entregas.csv`.
- Descripción: `descripcion_entrega.txt`.

## Criterios
- Tres indicadores calculados desde datos de Supabase.
- ScatterplotLayer de deck.gl sobre mapa MapLibre.
- Zoom, desplazamiento, hover y selección por clic.
- Estados por color y filtro simple.
- El campo `valor` representa minutos estimados o registrados; el indicador de demora cuenta valores mayores a 60 minutos como criterio de esta PoC.
