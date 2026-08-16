# Guía Paso a Paso: Primeros Pasos en CI/CD con GitHub Actions

**Materia:** Desarrollo Web e IA
**Nivel:** Inicial / Principiantes
**Objetivo:** Comprender qué es CI/CD y configurar tu primer pipeline con GitHub Actions.

---

## Índice

1. [¿Qué es CI/CD?](#1-qué-es-cicd)
2. [Conceptos clave de GitHub Actions](#2-conceptos-clave-de-github-actions)
3. [Requisitos previos](#3-requisitos-previos)
4. [Paso 1: Crear un repositorio en GitHub](#4-paso-1-crear-un-repositorio-en-github)
5. [Paso 2: Crear el archivo del workflow](#5-paso-2-crear-el-archivo-del-workflow)
6. [Paso 3: Escribir tu primer workflow](#6-paso-3-escribir-tu-primer-workflow)
7. [Paso 4: Ver el pipeline en acción](#7-paso-4-ver-el-pipeline-en-acción)
8. [Paso 5: Agregar tests (CI real)](#8-paso-5-agregar-tests-ci-real)
9. [Paso 6: Deploy automático (CD)](#9-paso-6-deploy-automático-cd)
10. [Buenas prácticas](#10-buenas-prácticas)
11. [Ejercicios prácticos](#11-ejercicios-prácticos)
12. [Resolución de problemas comunes](#12-resolución-de-problemas-comunes)

---

## 1. ¿Qué es CI/CD?

CI/CD son dos prácticas de **DevOps** que automatizan el ciclo de vida del software.

| Sigla | Nombre | ¿Qué hace? |
|-------|--------|-----------|
| **CI** | Integración Continua (Continuous Integration) | Integra los cambios de código varias veces al día. Al hacer push, se **compila**, se **ejecutan tests** y se **revisa la calidad** del código de forma automática. |
| **CD** | Entrega/Despliegue Continuo (Continuous Delivery/Deployment) | Automatiza el **empaquetado** y la **publicación** del software a un entorno (desarrollo, staging o producción). |

**Analogía:** Imagina una fábrica de autos.
- CI = Línea de ensamblaje que **verifica cada pieza** antes de que el auto avance.
- CD = La grúa que **mueve el auto terminado** al estacionamiento para entregarlo.

**Beneficios:**
- Detectas errores **antes** de que lleguen a producción.
- Ahorras tiempo al automatizar tareas repetitivas.
- El equipo siempre tiene una versión **lista para publicar**.

---

## 2. Conceptos clave de GitHub Actions

GitHub Actions es el sistema de CI/CD integrado en GitHub. Se configura con archivos YAML dentro de la carpeta `.github/workflows/`.

| Concepto | Descripción |
|----------|-------------|
| **Workflow** | Un pipeline completo (archivo `.yml`). Se activa por *eventos*. |
| **Event (Evento)** | Disparador: `push`, `pull_request`, `schedule`, `workflow_dispatch`, etc. |
| **Job** | Un conjunto de pasos que corren en el mismo runner (máquina). |
| **Step (Paso)** | Cada comando o acción que se ejecuta dentro de un job. |
| **Action (Acción)** | Un bloque de código reutilizable (del marketplace o propio). |
| **Runner** | La máquina donde se ejecuta el workflow (GitHub aloja runners `ubuntu-latest`, `macos-latest`, `windows-latest`). |
| **Secrets** | Variables secretas guardadas en el repositorio (tokens, claves API). |

**Estructura general de un workflow:**
```yaml
name: Nombre del workflow
on: <evento(s) que lo disparan>
jobs:
  <nombre-del-job>:
    runs-on: <runner>
    steps:
      - name: <descripción del paso>
        run: <comando>
```

---

## 3. Requisitos previos

- Cuenta de [GitHub](https://github.com).
- Git instalado en tu máquina (`git --version`).
- Editor de código (VS Code recomendado).
- Proyecto web sencillo (HTML/CSS/JS o Node.js) para practicar.
- Opcional: conoce lo básico de `git add`, `commit` y `push`.

---

## 4. Paso 1: Crear un repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new).
2. Ponle un nombre, por ejemplo: `mi-primer-cicd`.
3. Elige **Public** o **Private**.
4. Marca *"Add a README file"*.
5. Click en **Create repository**.

**Local (opcional):**
```bash
# Clona el repo a tu máquina
git clone https://github.com/TU_USUARIO/mi-primer-cicd.git
cd mi-primer-cicd
```

---

## 5. Paso 2: Crear el archivo del workflow

Los workflows viven en la carpeta `.github/workflows/`.

1. Dentro de tu repositorio, crea la carpeta: `.github/workflows/`.
2. Crea un archivo llamado `ci.yml` (el nombre es libre, pero `.yml` o `.yaml` son obligatorios).

```
mi-primer-cicd/
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 6. Paso 3: Escribir tu primer workflow

Abre `ci.yml` y escribe esto:

```yaml
name: CI Básico

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  hola-mundo:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener el código del repositorio
        uses: actions/checkout@v4

      - name: Ejecutar un comando
        run: echo "¡Hola desde GitHub Actions!"

      - name: Listar archivos
        run: ls -la

      - name: Ver versión de Node
        run: node --version
```

**Explicación línea por línea:**
- `name:` Nombre visible del workflow.
- `on:` Define los eventos. Aquí se activa con `push` o `pull_request` sobre la rama `main`.
- `jobs:` Agrupa los trabajos. Puede haber varios.
- `runs-on:` Indica la máquina virtual (`ubuntu-latest` es la más usada).
- `steps:` Lista ordenada de comandos.
- `uses: actions/checkout@v4`: Una *action* oficial que copia tu código al runner. Sin ella no puedes trabajar con tus archivos.
- `run:` Ejecuta comandos de terminal.

---

## 7. Paso 4: Ver el pipeline en acción

1. Guarda el archivo y haz commit + push:
   ```bash
   git add .
   git commit -m "Agrega primer workflow de CI"
   git push origin main
   ```

2. Ve a la pestaña **Actions** de tu repositorio.

3. Verás tu workflow corriendo:
   - 🟡 **Amarillo/Animado** = En ejecución.
   - 🟢 **Verde** = Pasó correctamente.
   - 🔴 **Rojo** = Falló (click para ver el log y diagnosticar).

4. Click en el job `hola-mundo` para ver la salida de cada paso.

> **💡 Consejo:** Cada workflow corre en una máquina virtual limpia. Cada cambio que hagas en el repo y subas, disparará el pipeline de nuevo.

---

## 8. Paso 5: Agregar tests (CI real)

Ahora daremos un paso real de **Integración Continua**. Creemos un proyecto Node.js mínimo con un test.

### 8.1 Archivos del proyecto

**`package.json`**
```json
{
  "name": "mi-primer-cicd",
  "version": "1.0.0",
  "scripts": {
    "test": "node --test"
  }
}
```

**`suma.js`**
```js
function suma(a, b) {
  return a + b;
}

module.exports = { suma };
```

**`suma.test.js`**
```js
const { test } = require("node:test");
const assert = require("node:assert");
const { suma } = require("./suma");

test("suma 2 + 3 es 5", () => {
  assert.strictEqual(suma(2, 3), 5);
});
```

### 8.2 Actualizar el workflow

Reemplaza el contenido de `ci.yml`:

```yaml
name: CI con Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener el código
        uses: actions/checkout@v4

      - name: Instalar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Instalar dependencias
        run: npm install

      - name: Ejecutar tests
        run: npm test
```

Sube los cambios y observa cómo el pipeline instala, ejecuta y valida los tests automáticamente.

> **💡 Prueba el fallo:** Cambia el test para que espere `6` en lugar de `5`, sube el cambio y verás el pipeline en 🔴 rojo. Luego corrígelo.

---

## 9. Paso 6: Deploy automático (CD)

Para *Despliegue Continuo* usaremos **GitHub Pages**, un hosting gratuito de GitHub para sitios estáticos.

### 9.1 Crear un sitio estático

Crea un `index.html` simple:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi sitio CI/CD</title>
</head>
<body>
  <h1>¡Desplegado con GitHub Actions! 🎉</h1>
</body>
</html>
```

### 9.2 Agregar un segundo workflow de deploy

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy a GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener el código
        uses: actions/checkout@v4

      - name: Publicar sitio estático
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

### 9.3 Habilitar GitHub Pages

1. En el repo: **Settings → Pages**.
2. En *Build and deployment* selecciona la rama `gh-pages`.
3. En pocos minutos tu sitio estará en: `https://TU_USUARIO.github.io/mi-primer-cicd/`.

> **🔒 Nota de seguridad:** `secrets.GITHUB_TOKEN` es generado automáticamente por GitHub. Nunca escribas tokens o contraseñas directamente en el workflow; guárdalos en **Settings → Secrets and variables → Actions**.

---

## 10. Buenas prácticas

- **Un workflow = una responsabilidad:** separa CI (tests) de CD (deploy).
- **Dispara solo cuando sea necesario:** usa `paths` para correr el pipeline únicamente si cambian archivos relevantes:
  ```yaml
  on:
    push:
      paths: ["src/**", "package.json"]
  ```
- **Usa acciones oficiales y con versión:** `actions/checkout@v4` en lugar de `@main`.
- **Ejecuta tests rápido:** cachea dependencias con `actions/cache`.
- **Protege tu rama principal:** Requiere que los checks pasen antes de hacer merge (Settings → Branches → Add rule).
- **Nunca expongas secretos en los logs.**
- **Reutiliza código:** los workflows pueden llamar a otros con `workflow_call`.

---

## 11. Ejercicios prácticos

1. **Nivel 1:** Agrega un job que imprima la fecha (`date`) y el runner (`uname -a`).
2. **Nivel 2:** Agrega otro test (por ejemplo, resta) y un job separado de lint con la acción `actions/setup-python` o `eslint`.
3. **Nivel 3:** Usa `on: workflow_dispatch` y agrega un *input* para elegir el entorno:
   ```yaml
   on:
     workflow_dispatch:
       inputs:
         entorno:
           description: "Entorno de despliegue"
           required: true
           default: "staging"
   ```
   Luego úsalo: `echo "Entorno: ${{ github.event.inputs.entorno }}"`.
4. **Nivel 4:** Configura un `cron` para ejecutar el workflow cada día:
   ```yaml
   on:
     schedule:
       - cron: "0 8 * * *"   # Todos los días a las 8:00 UTC
   ```

---

## 12. Resolución de problemas comunes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| El workflow no se ejecuta | Está mal la ruta o el nombre de rama | Verifica `.github/workflows/` y la rama en `on`. |
| Error: `npm not found` | No se instaló Node.js | Agrega el paso `actions/setup-node`. |
| El deploy no sale en Pages | Página mal configurada | Configura la rama `gh-pages` en Settings → Pages. |
| Fallo en `actions/checkout` | Push vacío o repo inexistente | Haz un commit con cambios reales. |
| Secretos no disponibles | No están definidos | Revisa Settings → Secrets and variables. |
| El pipeline tarda mucho | Se descargan dependencias cada vez | Usa `actions/cache`. |

---

## Resumen

- **CI/CD** automatiza la verificación y publicación del software.
- **GitHub Actions** usa archivos YAML en `.github/workflows/`.
- Un workflow se compone de **jobs** y **steps**, corre en un **runner** y se dispara por **eventos**.
- Con `push` y `pull_request` tienes CI; con GitHub Pages u otros servicios tienes CD.

¡Sigue practicando! La automatización es una habilidad que se domina con repetición.
