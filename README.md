# Gestión Escolar – Frontend

Aplicación web moderna desarrollada en Angular para la gestión integral de estudiantes, profesores, administrativos, cursos e inscripciones.


## Descripción

Este frontend implementa una interfaz de usuario completa y responsiva para el sistema de gestión escolar, con operaciones CRUD para todas las entidades, autenticación JWT, paginación, filtros y navegación intuitiva mediante sidebar organizados por módulos.

## Tecnologías & dependencias clave

- Angular 16
- TypeScript
- Angular Material
- Angular Router
- Angular Forms (Formularios reactivos)
- Angular HTTP Client
- Angular CDK (Layout responsivo)


## Requisitos previos

| Requisito    | Versión mínima |
|--------------|---------------|
| Node.js      | 18            |
| npm          | 9             |
| Angular CLI  | 16            |



## Instalación

1. *Clona el repositorio y entra al proyecto:*
   ```bash
   git clone https://github.com/ange2310/prueba-frontend.git
   cd gestion-escolar-frontend
   ```

2. *Instala las dependencias:*
   ```bash
   npm install
   ```

3. *Configura la conexión con el Backend:*
   - El proyecto está configurado para conectarse al backend en `http://localhost:8080`
   - Si necesitas cambiar esta configuración, edita el archivo `proxy.conf.json`:
     ```json
     {
       "/api/*": {
         "target": "http://localhost:8080",
         "secure": false,
         "changeOrigin": true,
         "logLevel": "debug"
       }
     }
     ```

4. *Ejecuta la aplicación:*
   ```bash
   npm start
   ```
   
   o bien:
   ```bash
   ng serve
   ```

   También puedes usar un IDE como VS Code y ejecutar directamente desde la terminal integrada.

## Ejecución y entorno

- El frontend se ejecuta por defecto en [http://localhost:4200]
- Asegúrate de tener el backend ejecutándose en [http://localhost:8080]
- La aplicación es completamente responsiva y funciona en dispositivos móviles


## Módulos principales

> Todas las rutas están protegidas por autenticación JWT

### Autenticación

| Ruta     | Componente      | Descripción                    |
|----------|-----------------|--------------------------------|
| /login   | LoginComponent  | Inicio de sesión con JWT       |

### Dashboard

| Ruta        | Componente         | Descripción                    |
|-------------|--------------------|--------------------------------|
| /dashboard  | DashboardComponent | Panel principal con estadísticas |

### Gestión de Personas

| Ruta              | Componente              | Descripción                    |
|-------------------|-------------------------|--------------------------------|
| /personas         | PersonasListComponent   | Lista paginada de personas     |
| /personas/edit/:id| PersonaFormComponent    | Editar información personal    |

### Gestión de Estudiantes

| Ruta                 | Componente                | Descripción                    |
|----------------------|---------------------------|--------------------------------|
| /estudiantes         | EstudiantesListComponent  | Lista paginada de estudiantes  |
| /estudiantes/new     | EstudianteFormComponent   | Crear nuevo estudiante         |
| /estudiantes/edit/:id| EstudianteFormComponent   | Editar estudiante              |

### Gestión de Profesores

| Ruta                | Componente               | Descripción                    |
|---------------------|--------------------------|--------------------------------|
| /profesores         | ProfesoresListComponent  | Lista paginada de profesores   |
| /profesores/new     | ProfesorFormComponent    | Crear nuevo profesor           |
| /profesores/edit/:id| ProfesorFormComponent    | Editar profesor                |

### Gestión de Administrativos

| Ruta                      | Componente                   | Descripción                    |
|---------------------------|------------------------------|--------------------------------|
| /administrativos          | AdministrativosListComponent | Lista paginada de administrativos |
| /administrativos/new      | AdministrativoFormComponent  | Crear nuevo administrativo     |
| /administrativos/edit/:id | AdministrativoFormComponent  | Editar administrativo          |

### Gestión de Cursos

| Ruta             | Componente          | Descripción                    |
|------------------|---------------------|--------------------------------|
| /cursos          | CursosListComponent | Lista paginada de cursos       |
| /cursos/new      | CursoFormComponent  | Crear nuevo curso              |
| /cursos/edit/:id | CursoFormComponent  | Editar curso                   |

### Gestión de Inscripciones

| Ruta                    | Componente                 | Descripción                    |
|-------------------------|----------------------------|--------------------------------|
| /inscripciones          | InscripcionesListComponent | Lista paginada de inscripciones |
| /inscripciones/new      | InscripcionFormComponent   | Crear nueva inscripción        |
| /inscripciones/edit/:id | InscripcionFormComponent   | Editar inscripción             |


## Ejemplo de uso y autenticación

1. *Inicia la aplicación:*
   ```bash
   npm start
   ```

2. *Accede a la aplicación:*
   - Abre tu navegador en [http://localhost:4200]
   - Serás redirigido automáticamente a `/login`

3. *Credenciales de prueba:*
   ```json
   {
     "username": "patricia.salazar",
     "password": "patricia123"
   }
   ```

4. *Flujo de autenticación:*
   - El token JWT se almacena automáticamente en localStorage
   - Se incluye en todas las peticiones HTTP mediante interceptor
   - Las rutas están protegidas por guards de autenticación

---

## Características destacadas

### Validaciones
- Formularios reactivos con validación en tiempo real
- Validator personalizado para fechas no futuras
- Validación de formato de matrícula (EST2024001)
- Validación de email y teléfono

### Interfaz de Usuario
- Diseño responsivo con Angular Material
- Sidebar colapsable en dispositivos móviles
- Paginación y filtros en todas las listas
- Diálogos de confirmación para eliminaciones
- Notificaciones toast para feedback del usuario

---

## Estructura de carpetas

```
gestion-escolar-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── estudiantes/
│   │   │   ├── profesores/
│   │   │   ├── administrativos/
│   │   │   ├── cursos/
│   │   │   ├── inscripciones/
│   │   │   └── personas/
│   │   ├── layout/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   ├── validators/
│   │   │   └── styles/
│   │   └── environments/
│   ├── assets/
│   └── environments/
├── proxy.conf.json
├── angular.json
├── package.json
└── README.md
```

## Backend relacionado

Este frontend está diseñado para trabajar con el backend de gestión escolar desarrollado en Spring Boot:  
[https://github.com/ange2310/prueba-backend.git](https://github.com/ange2310/prueba-backend.git)

## Autor

**Autor:** Angelica Maria Marcillo Alba