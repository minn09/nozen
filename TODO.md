## 🚀 Próximas Funcionalidades (Backlog)

### ⌨️ Navegación y Atajos

- [ ] **Atajos de Teclado (Desktop):**
- [ ] Implementar navegación entre días con flechas de dirección (`←` / `→`).
- [ ] Implementar `Ctrl + K` (Paleta de comandos o buscador rápido).

- [ ] **Gestos (Mobile):**
- [ ] Implementar _swipe_ (desplazamiento lateral) para cambiar entre fechas.

### 🖼️ Multimedia

- [ ] Sistema de subida de imágenes (definir si es almacenamiento local o en la nube).

---

## 🏗️ En Desarrollo / Alta Prioridad

### 📄 Exportación Optimizada (TXT Format)

_Transformar el sistema de persistencia de JSON a un formato legible y compacto._

**Criterios de Aceptación:**

- [ ] Generación de metadata global (`@v=1.0`, `@export`).
- [ ] Agrupación por día usando `# YYYY-MM-DD`.
- [ ] Parseo determinista (Bidireccional: TXT ⇄ JSON).
- [ ] Soporte para notas principales (`>`), estados (`~`) y tags.

**Estado de la Tarea:**

- [ ] Definir Parser/Serializer.
- [ ] Implementar lógica de exportación manual.
- [ ] **Refactor de Almacenamiento:** Mover de un solo archivo JSON a estructura de carpetas: `journal/YYYY/MM/DD.txt`.

---

## 🛠️ Especificaciones Técnicas (Referencia)

### Estándar del Formato TXT

Para asegurar la legibilidad humana y el control de versiones (Git), se utiliza la siguiente sintaxis:

| Símbolo | Significado     | Ejemplo              |
| ------- | --------------- | -------------------- | -------- | ----------- |
| `@`     | Metadata global | `@v=1.0`             |
| `#`     | Cabecera de día | `# 2026-01-01`       |
| `>`     | Nota principal  | `> Texto de la nota` |
| `~`     | Check-in (hora) | `~ 17:24 igual`      |
| `       | `               | Nota opcional        | `~ 17:27 | comentario` |
| `-`     | Valor nulo      | `energy: -`          |

### Arquitectura de Archivos Propuesta

```text
journal/
 └─ YYYY/
     └─ MM/
         └─ DD.txt

```

---

## ✅ Completado

- [x] Definición inicial del formato TXT.
- [x] Identificación de ineficiencias del formato JSON para backups.
