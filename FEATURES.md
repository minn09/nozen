# Nozen — Roadmap de Features

## 🎯 Visión

Nozen como ecosistema personal: web (Vercel) + desktop (Tauri) + CLI + MCP Server, con un **core Rust compartido** que maneja el modelo de datos, validación, almacenamiento local y sincronización.

```
                    ┌──────────────────────┐
                    │       AI / LLM       │
                    │  (Claude, OpenCode)   │
                    └──────────┬───────────┘
                               │ MCP Protocol
                    ┌──────────▼───────────┐
                    │    MCP Server        │
                    │  consulta + sync     │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐   ┌──────────▼──────────┐   ┌──────▼──────┐
│    CLI        │   │   Desktop (Tauri)    │   │  Web        │
│  tareas sync  │   │   app nativa         │   │  (Vercel)   │
└───────┬───────┘   └──────────┬──────────┘   └──────┬──────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │     Core (Rust)      │
                    │  modelo de datos,    │
                    │  validación, sync    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Data Layer          │
                    │  Local: SQLite       │
                    │  Remote: API REST    │
                    └──────────────────────┘
```

---

## ✅ Estado actual

App web 100% cliente con Next.js 16, React 19, Zustand + localStorage. Corre en Vercel. Datos persistentes solo en el navegador.

---

## 🚀 Fase 1 — Desktop con Tauri (próximo)

Empaquetar la app actual como aplicación de escritorio usando Tauri v2.

### Setup
- Instalar Tauri CLI y dependencias
- Generar `src-tauri/` con `tauri init`
- Configurar `tauri.conf.json` (ventana, título, iconos)
- El frontend se sirve desde el build estático de Next.js

### Consideraciones
- La web en Vercel sigue funcionando sin cambios
- localStorage se mantiene dentro del perfil del webview de Tauri

### Dependencias técnicas
- Rust toolchain
- Tauri v2
- WebKitGTK (Linux) / WebView2 (Windows)

---

## 🔮 Fase 2 — Core Rust + SQLite

Capa de datos compartida en Rust que unifica el modelo para todas las superficies.

- Crate `nozen-core` con modelo de datos (Task, Note, DiaryEntry, etc.)
- Validación con tipos estrictos
- SQLite como almacenamiento local via `tauri-plugin-sql` / `rusqlite`
- Migración desde localStorage existente
- Exportable como librería para CLI, Tauri, MCP

---

## 🔮 Fase 3 — CLI

Interfaz de terminal para consultar y manipular datos sin abrir la app.

- CLI con `clap` para comandos como `nozen tasks list`, `nozen tasks add`, `nozen diary today`
- Consume `nozen-core` directamente
- Ideal para scripting y automatización

---

## 🔮 Fase 4 — MCP Server

Servidor MCP (Model Context Protocol) para que asistentes AI (Claude, OpenCode, etc.) lean y escriban datos de Nozen.

- Implementado con el SDK de MCP para Rust
- Herramientas expuestas: `list_tasks`, `create_task`, `get_diary`, `search_notes`, etc.
- Permite al AI consultar el estado real de las tareas y crear entradas
- Corre como proceso independiente o integrado en el CLI

---

## 🔮 Fase 5 — SSR y API routes

Agregar funcionalidad server-side a la app web.

- API routes en Next.js para persistencia remota
- La versión desktop consume las mismas APIs desde Tauri
- La app web puede usar SSR donde tenga sentido

---

## 🔮 Fase 6 — Offline-first con sincronización

Arquitectura donde la app funciona sin conexión y sincroniza cuando hay internet.

### Opciones consideradas

| Opción | Almacenamiento local | Sincronización | Complejidad |
|--------|---------------------|----------------|-------------|
| SQLite + API (recomendada) | SQLite via Rust | Bidireccional, engine custom | Media |
| Automerge / CRDTs | Navegador / archivos | Automática (resolución de conflictos) | Alta |

### Stack recomendado
- **Desktop / CLI / MCP**: SQLite via Rust (ya implementado en Fase 2)
- **Web**: localStorage + IndexedDB como capa local
- **Sync engine**: Rust crate compartido que detecta cambios, resuelve conflictos y sincroniza contra la API remota

---

## 📐 Principios de arquitectura

1. **Mismo código base** — la web y el desktop comparten componentes, stores y lógica
2. **Core Rust compartido** — CLI, MCP, y Tauri comparten el mismo crate `nozen-core` con modelo, validación y persistencia
3. **Offline-first** — la app siempre funciona sin conexión; la sincronización es un detalle de implementación
4. **Agregativo** — cada fase se suma sin romper lo anterior
5. **Backwards compatible** — los datos locales nunca se pierden al migrar de fase
