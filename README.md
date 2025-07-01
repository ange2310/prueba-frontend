# Sistema de Gestión Escolar - Frontend

Frontend desarrollado en Angular para el sistema integral de gestión escolar. Interfaz moderna y responsiva que permite administrar estudiantes, profesores, administrativos, cursos e inscripciones de manera eficiente.
Características Principales

Gestión Completa: Estudiantes, profesores, administrativos, cursos e inscripciones
Autenticación JWT: Sistema de login seguro con guards de ruta
Interfaz Moderna: Diseño responsivo con Angular Material
Operaciones CRUD: Crear, leer, actualizar y eliminar registros
Paginación y Filtros: Manejo eficiente de grandes volúmenes de datos
Validación de Formularios: Validación reactiva en tiempo real
Navegación Intuitiva: Sidebar con menús organizados por módulos

# Tecnologías Utilizadas

Angular 16: Framework principal
TypeScript: Lenguaje de programación
Angular Material: Componentes UI
RxJS: Programación reactiva
Angular Router: Navegación entre rutas
Angular Forms: Formularios reactivos
Angular HTTP Client: Comunicación con API

Requisitos Previos

Node.js 18+
npm 9+
Angular CLI 16+

Instalación y Configuración
1. Clonar el repositorio
bashgit clone <https://github.com/ange2310/prueba-frontend.git>
cd gestion-escolar-frontend
2. Instalar dependencias
bashnpm install
3. Configurar conexión con Backend
El proyecto está configurado para conectarse al backend en http://localhost:8080. Si necesitas cambiar esta configuración, edita el archivo proxy.conf.json:
json{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
4. Ejecutar la aplicación
bashnpm start
La aplicación estará disponible en http://localhost:4200
Estructura del Proyecto
src/app/
├── core/                     # Servicios principales y configuración
│   ├── guards/              # Guards de autenticación
│   ├── interceptors/        # Interceptor JWT
│   └── services/            # Servicios de API
├── features/                # Módulos funcionales
│   ├── auth/               # Autenticación
│   ├── dashboard/          # Panel principal
│   ├── estudiantes/        # Gestión de estudiantes
│   ├── profesores/         # Gestión de profesores
│   ├── administrativos/    # Gestión de administrativos
│   ├── cursos/            # Gestión de cursos
│   ├── inscripciones/     # Gestión de inscripciones
│   └── personas/          # Gestión de personas
├── layout/                 # Layout principal
├── shared/                 # Componentes y servicios compartidos
│   ├── components/        # Componentes reutilizables
│   ├── models/           # Interfaces TypeScript
│   ├── pipes/            # Pipes personalizados
│   └── styles/           # Estilos compartidos
└── environments/          # Configuraciones de entorno
# Funcionalidades por Módulo
# Dashboard

Resumen estadístico del sistema
Accesos rápidos a funciones principales
Información del usuario logueado

# Gestión de Personas

Lista paginada de todas las personas
Edición de información personal
Filtros de búsqueda

# Gestión de Estudiantes

CRUD completo de estudiantes
Generación automática de número de matrícula
Asignación de grados académicos
Validaciones específicas (formato de matrícula)

# Gestión de Profesores

Registro de profesores con especialidades
Fechas de contratación
Asignación a cursos

# Gestión de Administrativos

Control de personal administrativo
Asignación de cargos y departamentos
Organigrama funcional

# Gestión de Cursos

Creación y edición de materias
Asignación de créditos académicos
Vinculación con profesores
Control de capacidad

# Gestión de Inscripciones

Matriculación de estudiantes en cursos
Control de fechas de inscripción
Validación de duplicados
Historial académico

# Autenticación
El sistema utiliza autenticación JWT con las siguientes credenciales predeterminadas:

# Flujo de Autenticación

Login con credenciales
Recepción de token JWT
Almacenamiento seguro en localStorage
Inclusión automática en headers (interceptor)
Validación en cada ruta protegida (guards)

# Comandos Útiles
Desarrollo
bash# Ejecutar en modo desarrollo
npm start

# Ejecutar con recarga automática
ng serve --open

# Ejecutar en puerto específico
ng serve --port 4300
Construcción
bash# Build para producción
npm run build

# Build para desarrollo
npm run build:dev

# Configuración de Proxy
El proyecto incluye configuración de proxy para desarrollo que redirige las peticiones /api/* al backend:
json{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
Despliegue
Producción
bash# Build optimizado para producción
ng build --configuration production

# Los archivos se generan en /dist/gestion-escolar-frontend
Consideraciones para Producción

Configurar variables de entorno en environment.prod.ts
Ajustar URL del backend según servidor de producción
Configurar servidor web para servir archivos estáticos
Implementar redirección para rutas de Angular (fallback a index.html)

Backend Relacionado
Este frontend está diseñado para trabajar con el backend de gestión escolar desarrollado en Spring Boot. Asegúrate de tener el backend ejecutándose en http://localhost:8080 antes de iniciar el frontend.
Repositorio del Backend: https://github.com/ange2310/prueba-backend.git
Problemas Comunes
# Error de CORS
Si encuentras problemas de CORS, verifica que el backend tenga configurado correctamente el origen del frontend.
# Error 404 en Rutas
En producción, configura el servidor web para redirigir todas las rutas no encontradas a index.html.
Token Expirado
Los tokens JWT expiran en 24 horas. Si recibes errores 401, realiza login nuevamente.

Contribución

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/nueva-funcionalidad)
Commit tus cambios (git commit -am 'Agregar nueva funcionalidad')
Push a la rama (git push origin feature/nueva-funcionalidad)
Abre un Pull Request


Autor: Angelica Maria Marcillo Alba

Repositorio: https://github.com/ange2310/prueba-frontend.git