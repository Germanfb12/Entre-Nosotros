# Entre Nosotros

Juego de cartas para dos personas. Es una app web (PWA): se abre en Safari, se agrega a la pantalla de inicio del iPhone y después funciona sin conexión. Gratis, sin cuentas, sin servidores propios, sin publicidad.

## Archivos

```
index.html              Estructura de la app
manifest.webmanifest    Nombre, colores e ícono para "Agregar a inicio"
sw.js                   Guarda la app en el iPhone para usarla sin internet
css/styles.css          Diseño
js/questions.js         Catálogo de 203 preguntas (acá se agregan nuevas)
js/logic.js             Reglas: turnos, historial por jugador, filtros, estadísticas
js/app.js               Pantallas y botones
icons/                  Íconos de la app
```

## Publicarlo gratis en GitHub Pages (una sola vez, ~10 minutos)

Es más cómodo desde una computadora.

1. Creá una cuenta gratis en https://github.com (si no tenés).
2. Arriba a la derecha: **+ › New repository**. Nombre: `entre-nosotros`. Dejalo en **Public** (GitHub Pages gratis requiere repositorio público). Tocá **Create repository**.
3. En la página del repositorio tocá **uploading an existing file**. Descomprimí el ZIP y arrastrá **el contenido** de la carpeta `entre-nosotros` (index.html, sw.js, las carpetas css, js, icons, etc.), no la carpeta en sí. Tocá **Commit changes**.
4. Andá a **Settings › Pages**. En *Branch* elegí `main` y carpeta `/ (root)`. **Save**.
5. Esperá 1–2 minutos. Arriba aparece la dirección, del estilo `https://TU-USUARIO.github.io/entre-nosotros/`.

## Instalarlo en el iPhone

1. Abrí esa dirección en **Safari** (no en Chrome ni dentro de otra app), con internet.
2. Esperá a que cargue la pantalla de inicio del juego.
3. Tocá el botón **Compartir** (cuadrado con flecha) › **Agregar a pantalla de inicio** › **Agregar**.
4. Abrí el juego siempre desde ese ícono. La primera vez que se abre con internet queda guardado; desde ahí funciona en modo avión.

Importante: Safari y el ícono de inicio guardan el progreso por separado. Jueguen siempre desde el ícono.

## Agregar preguntas o cambios después

- **Desde el iPhone, sin tocar código:** *Personalizar preguntas › Agregar pregunta*. Se guardan en el teléfono y sobreviven a una nueva partida.
- **En el catálogo original:** abrí `js/questions.js` en GitHub (ícono del lápiz), agregá una línea al final de la lista, por ejemplo:
  `['n135','amor',2,'¿Tu nueva pregunta?'],`
  Usá siempre un id nuevo (n135, n136…) y nunca cambies los existentes. Para género: `{querido|querida}` se adapta a quien responde; `{o:enojado|enojada}` a la otra persona.
- **Siempre que cambies un archivo**, abrí `sw.js` y subí `VERSION = 'v1'` a `'v2'` (después `'v3'`, etc.). Si no, el iPhone sigue mostrando la versión guardada.
- El iPhone toma la versión nueva la próxima vez que se abre el juego con internet (a veces hay que cerrarlo y abrirlo dos veces). El progreso no se pierde.

## Qué se guarda y dónde

Solo en el iPhone (localStorage): nombres, qué carta respondió o pasó cada jugador, filtros, preguntas propias y desactivadas. No se guarda nada de lo que se conversa, no se usa el micrófono y no se envía nada a terceros. *Privacidad y datos › Borrar todos los datos* elimina todo. Borrar los datos de Safari o eliminar el ícono también borra el progreso y las preguntas propias; el catálogo original siempre vuelve.

## Probarlo en una computadora

En la carpeta del proyecto: `python3 -m http.server 8000` y abrí http://localhost:8000.
