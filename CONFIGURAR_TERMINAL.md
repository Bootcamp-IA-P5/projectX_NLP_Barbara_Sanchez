# ⚙️ Configurar Terminal para Abrir Links Externamente

## Problema
Cuando haces clic en un link (como `http://localhost:8000`) en la terminal, se abre dentro de Cursor en lugar del navegador externo.

## Solución para macOS (zsh)

### Opción 1: Configurar zsh (Recomendado)

Añade esto a tu archivo `~/.zshrc`:

```bash
# Abrir URLs en el navegador predeterminado
openurl() {
    if [[ "$1" =~ ^https?:// ]]; then
        open "$1"
    else
        echo "No es una URL válida"
    fi
}

# Alias para abrir URLs
alias openurl='openurl'
```

Luego ejecuta:
```bash
source ~/.zshrc
```

### Opción 2: Usar `open` directamente

En lugar de hacer clic, puedes copiar la URL y ejecutar:
```bash
open http://localhost:8000
```

### Opción 3: Configurar Cursor/VSCode

1. Abre la configuración de Cursor (Cmd + ,)
2. Busca: "terminal.integrated.enableMultiLinePasteWarning"
3. O busca: "terminal.integrated.openLinks"
4. Configura para que los links se abran externamente

### Opción 4: Script Helper

Crea un script `open-browser.sh`:

```bash
#!/bin/bash
# Abrir URL en navegador externo
open "$1"
```

Luego úsalo:
```bash
chmod +x open-browser.sh
./open-browser.sh http://localhost:8000
```

## Verificar que Funciona

1. Ejecuta el backend
2. Copia la URL `http://localhost:8000`
3. Ejecuta: `open http://localhost:8000`
4. Debería abrirse en tu navegador predeterminado

