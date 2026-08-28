# Rediseño UX/UI — Aula Virtual IESTV Tucumán

Extensión de navegador (Manifest V3, compatible con Chrome, Edge y Brave) que
renueva la apariencia del Aula Virtual en `iestv-tuc.infd.edu.ar` sin tocar
el sistema original del lado del servidor: solo aplica una nueva capa visual
en tu navegador.

## Qué cambia

- Tipografía, colores, espaciados y botones modernos.
- El formulario de acceso se envuelve en una tarjeta centrada con sombra.
- Campos de contraseña con botón "Ver/Ocultar".
- Barra superior con el nombre de la página.
- Modo claro, oscuro o automático (según el sistema operativo).
- Control de tamaño de texto.
- Botón flotante para alternar entre el diseño nuevo y el original en un clic.
- Todo se puede desactivar por completo desde el ícono de la extensión.

No modifica formularios, envíos de datos ni lógica del sitio: solo CSS y
mejoras visuales del DOM en el navegador del usuario.

## Instalación (modo desarrollador)

1. Abrí `chrome://extensions` (o `edge://extensions`).
2. Activá "Modo de desarrollador" (esquina superior derecha).
3. Hacé clic en "Cargar descomprimida" y seleccioná la carpeta de este
   proyecto.
4. Entrá a `https://iestv-tuc.infd.edu.ar/aula/acceso.cgi` — el rediseño se
   aplica automáticamente.
5. Usá el ícono de la extensión (o el botón flotante en la esquina inferior
   derecha de la página) para activar/desactivar el rediseño, cambiar el
   tema o ajustar el tamaño de texto.

## Estructura del proyecto

```
manifest.json          Configuración de la extensión (MV3)
content/theme.css       Estilos inyectados en el sitio
content/content.js      Lógica de mejora del DOM y ajustes en vivo
popup/                  Interfaz del ícono de la extensión (ajustes)
icons/                  Íconos de la extensión
scripts/gen_icons.py    Script usado para generar los íconos
```

## Extender a otros institutos INFD

Muchos institutos de INFD usan la misma plataforma (e-ducativa). Para que la
extensión también funcione en otro dominio, agregá su URL a `matches` en
`manifest.json`:

```json
"matches": [
  "https://iestv-tuc.infd.edu.ar/*",
  "https://otro-instituto.infd.edu.ar/*"
]
```

## Notas

- Es una extensión no oficial, sin relación con INFD ni con el instituto.
- Al no tener acceso directo al HTML en vivo de la página durante el
  desarrollo, los selectores de `content.js` se escribieron de forma
  genérica (primer `<form>`, campos `input[type="password"]`, etc.) para
  funcionar de forma robusta frente a distintas pantallas del aula. Si algo
  no se ve bien en una pantalla puntual, avisá qué sección para ajustar el
  selector correspondiente.
