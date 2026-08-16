---
marp: true
theme: default
paginate: true
backgroundColor: #fdfdfd
style: |
  section { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; }
  h1 { color: #1f6feb; }
  h2 { color: #1f6feb; border-bottom: 3px solid #1f6feb; padding-bottom: 5px; }
  table { font-size: 0.75em; }
---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# CI/CD con GitHub Actions

## Introducción a la Integración y Despliegue Continuo

**Desarrollo Web e IA — Primeros pasos**

---

# Agenda

1. ¿Qué es CI/CD?
2. Beneficios de automatizar
3. Conceptos clave de GitHub Actions
4. Anatomía de un Workflow
5. Eventos y disparadores
6. Runners y Actions
7. Secrets y seguridad
8. CI vs CD en la práctica
9. Resumen

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 1. ¿Qué es CI/CD?

---

# Dos prácticas que automatizan el ciclo del software

| | CI | CD |
|---|---|---|
| **Nombre** | Integración Continua | Entrega / Despliegue Continuo |
| **Qué hace** | Integra cambios varias veces al día | Publica el software a un entorno |
| **Enfoque** | Verificar | Entregar |
| **Ejemplo** | Compilar + correr tests | Subir a producción |

**CI =** cada *push* se compila, se testea y se revisa.
**CD =** el código verificado se empaqueta y se publica automáticamente.

---

# Analogía de la fábrica de autos

- **CI** → Línea de ensamblaje que **verifica cada pieza** antes de avanzar.
- **CD** → La grúa que **mueve el auto terminado** al estacionamiento de entrega.

Sin CI/CD: se descubre el error cuando el auto ya está con el cliente. 😱

---

# ¿Por qué te importa como dev?

- Detectas errores **antes** de producción.
- Ahorras horas de tareas repetitivas.
- El equipo siempre tiene una versión **lista para publicar**.
- El feedback llega **en minutos**, no en días.
- Base para **AI pipelines**: entrenar, testear y desplegar modelos también se automatiza.

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 2. Beneficios de automatizar

---

# Beneficios clave

- ⚡ **Velocidad:** feedback inmediato tras cada commit.
- 🛡️ **Calidad:** los tests corren solos, siempre.
- 🤝 **Colaboración:** los conflictos aparecen temprano.
- 🔁 **Repetibilidad:** el pipeline corre igual en cualquier máquina.
- 🎯 **Confianza:** si pasa el pipeline, el código es bueno para merge.

> Regla de oro: **Si el pipeline falla, nadie hace merge.**

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 3. Conceptos clave de GitHub Actions

---

# El vocabulario de GitHub Actions

| Concepto | Definición |
|----------|-----------|
| **Workflow** | Pipeline completo (archivo YAML) |
| **Evento** | Disparador: `push`, `pull_request`... |
| **Job** | Conjunto de pasos en un mismo runner |
| **Step** | Cada comando o acción del job |
| **Action** | Bloque reutilizable (oficial o del marketplace) |
| **Runner** | Máquina que ejecuta el workflow |
| **Secret** | Variable secreta (tokens, claves API) |

---

# ¿Dónde viven los workflows?

```
tu-repositorio/
└── .github/
    └── workflows/
        └── ci.yml        ← aquí se define el pipeline
```

- Formato: **YAML**
- Carpeta obligatoria: `.github/workflows/`
- Un repo puede tener **muchos workflows** (uno por responsabilidad).

---

# Eventos

| Evento | Cuándo se dispara |
|--------|-------------------|
| `push` | Al subir cambios a una rama |
| `pull_request` | Al abrir/actualizar un PR |
| `schedule` | En un horario (cron) |
| `workflow_dispatch` | Manualmente desde la UI |
| `workflow_call` | Llamado por otro workflow |
| `release` | Al crear un release |

---

# Runners

Máquinas donde corre tu código.

**GitHub aloja (hosted):**
- `ubuntu-latest`
- `macos-latest`
- `windows-latest`

**Opciones:**
- Runners **self-hosted**: tu propia máquina o servidor.

> Cada workflow corre en una máquina **limpia** — instala lo que necesites cada vez.

---

# Actions

Bloques de código reutilizables. 🧩

**Las más usadas:**
- `actions/checkout@v4` → copia tu código al runner.
- `actions/setup-node@v4` → instala Node.js.
- `actions/cache@v4` → acelera cacheando dependencias.

Se referencian por: `owner/repo@version`.
**Recomendación:** usa versiones fijas, no `@main`.

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 4. Anatomía de un Workflow

---

# Estructura mínima

```yaml
name: CI Básico
on:
  push:
    branches: [main]
jobs:
  hola-mundo:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener código
        uses: actions/checkout@v4
      - name: Saludar
        run: echo "¡Hola desde Actions!"
```

---

# Las 4 piezas del puzzle

| Pieza | Ejemplo | Función |
|-------|---------|---------|
| `name` | `CI Básico` | Nombre visible del workflow |
| `on` | `push`, `pull_request` | Eventos que lo disparan |
| `jobs` | `hola-mundo` | Trabajos a ejecutar |
| `steps` | `run: echo ...` | Comandos de cada job |

> Un job falla → su paso falla. Un workflow falla → su job falla.

---

# Flujo de ejecución

```
Evento (push)
    │
    ▼
Workflow ──▶ Job ──▶ Step 1 ──▶ Step 2 ──▶ Step 3
                   (runner ubuntu-latest)
                        │
                        ▼
                 ✅ Verde  /  🔴 Rojo
```

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 5. Eventos y disparadores (detalle)

---

# Filtrado de eventos

```yaml
on:
  push:
    branches: [main]          # solo en main
    paths: ["src/**"]         # solo si cambian esos archivos
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 8 * * *"       # todos los días 8:00 UTC
  workflow_dispatch:          # botón manual en la UI
```

**Buenas prácticas:** dispara solo cuando es necesario → ahorra minutos de cómputo.

---

# workflow_dispatch con inputs

```yaml
on:
  workflow_dispatch:
    inputs:
      entorno:
        description: "Entorno de despliegue"
        required: true
        default: "staging"
```

Uso:
```yaml
steps:
  - run: echo "Entorno: ${{ github.event.inputs.entorno }}"
```

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 6. Secrets y seguridad

---

# Secrets — variables secretas

- Se guardan en: **Settings → Secrets and variables → Actions**.
- Se usan así: `${{ secrets.GITHUB_TOKEN }}`.
- `GITHUB_TOKEN` se genera automáticamente en cada run.

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

> 🚫 **Nunca** escribas tokens ni claves en el YAML ni en el código.

---

# Buenas prácticas de seguridad

- 🔒 Separa *secrets* de configuración.
- 📝 Revisa los logs: no imprimas secretos.
- 👥 Limita permisos (`permissions:`) a lo mínimo necesario.
- 🔐 Protege tu rama principal: exige que los checks pasen.

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 7. CI vs CD en la práctica

---

# CI: integrar y verificar

```
push ──▶ checkout ──▶ setup-node ──▶ npm install ──▶ npm test
                                                        │
                                                        ▼
                                                    ✅ / 🔴
```

Ejemplo de pipeline CI real en el siguiente módulo práctico.

---

# CD: desplegar

```
push ──▶ checkout ──▶ build ──▶ publicar a GitHub Pages
                                  │
                                  ▼
                    https://usuario.github.io/mi-proyecto/
```

| Enfoque | Herramienta |
|---------|-------------|
| Sitios estáticos | GitHub Pages |
| Apps / APIs | Vercel, Netlify, AWS, Docker |
| Modelos IA | Hugging Face Spaces, CI/CD ML |

---

# Un solo repo, dos workflows

```
.github/workflows/
├── ci.yml        → tests + lint (integración)
└── deploy.yml    → publicación (despliegue)
```

**Una responsabilidad por workflow.**

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# 8. Resumen

---

# Ideas para llevar

1. **CI/CD automatiza** verificar y publicar el software.
2. **GitHub Actions** = pipelines en YAML dentro de `.github/workflows/`.
3. **Workflow → Job → Step**: jerarquía de ejecución.
4. Los **eventos** (`push`, `pull_request`, cron...) disparan el pipeline.
5. Los **secrets** protegen tus claves; nunca en el código.
6. **CI testea, CD publica.**

---

<!-- _backgroundColor: #1f6feb -->
<!-- _color: #ffffff -->

# Gracias 🙌

## Próximo módulo: manos a la obra

Crearás tu primer workflow real, le agregarás tests y harás un deploy a GitHub Pages.

**¡A practicar!**
