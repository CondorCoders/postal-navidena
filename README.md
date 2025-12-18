# 🎄 Postales Navideñas

Un proyecto Open Source con fines educativos que permite a los usuarios crear postales navideñas personalizadas para compartir con sus familiares y amigos. Los usuarios pueden personalizar el diseño de la postal, agregar textos, sellos, stickers y exportar su creación para compartirla.

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 16](https://nextjs.org/)** - Framework de React para aplicaciones web con renderizado del lado del servidor y generación de sitios estáticos
- **[React 19](https://react.dev/)** - Biblioteca de JavaScript para construir interfaces de usuario
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset tipado de JavaScript que mejora la calidad del código

### Manejo de Formularios y Validación

- **[React Hook Form 7](https://react-hook-form.com/)** - Biblioteca performante para manejar formularios en React con validación integrada
- **[Zod 4](https://zod.dev/)** - Parser y validador de esquemas TypeScript-first para validación de datos
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integración de validadores externos con React Hook Form

### Canvas y Gráficos

- **[Konva 10](https://konvajs.org/)** - Framework de canvas HTML5 para aplicaciones de escritorio y móviles
- **[react-konva 19](https://konvajs.org/docs/react/)** - Binding de React para Konva, permite trabajar con canvas de forma declarativa
- **[use-image](https://github.com/konvajs/use-image)** - Hook de React para cargar imágenes en aplicaciones Konva

### Herramientas de Desarrollo

- **[ESLint 9](https://eslint.org/)** - Linter de código para identificar y reportar patrones en JavaScript/TypeScript
- **[pnpm](https://pnpm.io/)** - Gestor de paquetes rápido y eficiente en espacio de disco

## 📁 Estructura del Proyecto

```
postal-navidena/
├── src/
│   ├── actions/           # Server actions de Next.js
│   ├── app/               # App router de Next.js
│   │   ├── page.tsx       # Página principal con el editor
│   │   └── postal/[slug]/ # Página de visualización de postales
│   ├── components/
│   │   ├── postal-form/   # Formulario de edición de postal
│   │   ├── postal-front/  # Vista frontal de la postal (canvas)
│   │   ├── postal-back/   # Vista posterior de la postal
│   │   ├── postal-viewer/ # Visualizador de postales compartidas
│   │   ├── snow/          # Efecto de nieve animada
│   │   └── svg-icons/     # Iconos SVG personalizados
│   ├── config/            # Configuraciones (sellos, stickers)
│   ├── context/           # Context API de React
│   └── types/             # Definiciones de tipos TypeScript
├── public/
│   ├── stamps/            # Imágenes de sellos
│   └── stickers/          # Imágenes de stickers
└── package.json
```

## 🚀 Desarrollo en Local

### Prerrequisitos

- Node.js 20 o superior
- pnpm (gestor de paquetes)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/CondorCoders/postal-navidena.git
cd postal-navidena
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Ejecuta el servidor de desarrollo:

```bash
pnpm dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

### Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Crea la build de producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta el linter de código

## 🤝 Contribuciones

Este es un proyecto Open Source con fines educativos. Las contribuciones son bienvenidas. Si deseas contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👩‍💻 Contibuidores

Sofia Grijalva
ElSantana
Zeroexe00

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

Hecho con ❤️ por [CondorCoders](https://github.com/CondorCoders)
