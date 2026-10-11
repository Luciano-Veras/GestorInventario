# 📦 Gestor de Inventario & Análisis de Abastecimiento (Supply Chain Dashboard)

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **Aplicación web analítica para optimización de inventarios, prevención de quiebres de stock y auditoría de compras ERP en tiempo real.**

---

## 🎯 Caso de Estudio: Problema vs. Solución

### 🔴 El Problema
En la gestión diaria de suministros y retail, los sistemas ERP suelen exportar reportes de stock planos y masivos (decenas de columnas y miles de filas en `.xlsx` o `.csv`). 
* Los analistas de compras y depósitos pierden horas filtrando manualmente en Excel.
* Resulta complejo diferenciar a simple vista una **rotura de stock inminente** de un artículo que tiene **órdenes de compra emitidas en camino**.
* Se generan pedidos duplicados a proveedores o demoras evitables en reclamos de entrega.

### 🟢 La Solución
Esta aplicación permite arrastrar cualquier archivo Excel o CSV y, mediante reglas de negocio automatizadas y heurística de cabeceras, clasifica el inventario en cuatro cuadrantes operativos inmediatos:

1. **🚨 URGENCIA CRÍTICA (`Disponible < 0`):** Rotura de stock total. Los pedidos comprometidos superan el stock físico y las órdenes en tránsito. Requiere compra inmediata.
2. **🚚 RECLAMAR PROVEEDOR (`Disponible > 0 && Necesidad < 0`):** El stock físico en depósito no cubre la demanda, pero ya existen **órdenes de compra (OC) en camino**. En lugar de emitir un duplicado de pedido, el analista debe agilizar la entrega con el proveedor.
3. **🛒 SUGERIDO A PEDIR (`Sugeridos > 0`):** Reposición recomendada para mantener niveles de rotación óptimos.
4. **✅ NORMAL:** Niveles de inventario balanceados sin riesgo de quiebre.

---

## ✨ Características Principales

* 📊 **Parser Inteligente de Planillas (SheetJS):** Detección heurística de cabeceras y alias ERP comunes (`ARTICU_ID`, `TEXTO`, `CANT_STOCK`, `PENDIENTE_NP`, `CANT_DISPONIBLE`, `CANT_OC`, etc.), limpiando formatos numéricos con separadores de miles y monedas internacionales.
* 📈 **Métricas Visuales Interactivas (Recharts):** 
  * Gráfico de dona con distribución porcentual del estado de la mercadería.
  * Gráfico de barras con el **Top 5 productos con mayor urgencia de compra**.
* 🔍 **Tabla Interactiva con Alta Usabilidad:**
  * Búsqueda reactiva por ID o nombre del producto.
  * Ordenamiento multidireccional (ascendente/descendente) en todas las columnas clave.
  * Paginación ágil y selector de cantidad de filas por página.
* 🔎 **Modal de Detalle Operativo:** Inspección en profundidad de cada producto con costo unitario, cálculo de inversión total requerida, ventas del período y desglose de la regla aplicada.
* 📥 **Exportación y Plantillas con 1 Clic:**
  * Exporta los datos filtrados y ordenados a un nuevo archivo Excel `.xlsx`.
  * Botón para descargar una plantilla modelo (`plantilla_ejemplo_inventario.xlsx`) para pruebas inmediatas de reclutadores.
* 💾 **Persistencia Local Segura:** Guarda el estado en `localStorage` evitando pérdida de datos ante recargas accidentales, con aislamiento de datos confidenciales.
* 🚀 **Despliegue Automatizado (Zero-Config CI/CD):** Configuración con GitHub Actions lista para publicar a **GitHub Pages** con cada push a la rama principal.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19, TypeScript
* **Estilos y UI:** Tailwind CSS v4, Lucide React (iconografía)
* **Visualización de Datos:** Recharts
* **Motor de Hojas de Cálculo:** SheetJS (`xlsx`)
* **Bundler & Build Tool:** Vite 6

---

## 🚀 Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Luciano-Veras/GestorInventario.git
   cd GestorInventario
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera la carpeta optimizada y minificada `/dist`.

---

## 🌐 Despliegue en GitHub Pages

El repositorio incluye el archivo `.github/workflows/deploy.yml`. Para activarlo en tu GitHub:

1. Ve a tu repositorio en GitHub: **Settings** > **Pages**.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. ¡Listo! Cada vez que hagas `git push origin main`, tu sitio se compilará y publicará automáticamente.

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
