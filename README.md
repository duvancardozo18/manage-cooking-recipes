# Aplicación de Gestión de Recetas
## Estructura del Proyecto (clean architecture)

```
src/app/
├── domain/                # Capa de Dominio (Entidad y reglas nego.)
│   ├── entities/                   # Entidades
│   │   ├── recipe.entity.ts       
│   │   └── recipe.entity.spec.ts
│   ├── repositories/
│   │   └── recipe.repository.ts    # Interfaz del repositorio (Port)
│   └── use-cases/                  # Reglas del negocio       
│       ├── create-recipe.use-case.ts
│       ├── create-recipe.use-case.spec.ts
│       ├── update-recipe.use-case.ts
│       ├── update-recipe.use-case.spec.ts
│       ├── delete-recipe.use-case.ts
│       ├── delete-recipe.use-case.spec.ts
│       ├── get-all-recipes.use-case.ts
│       ├── get-recipe-by-id.use-case.ts
│       ├── search-recipes.use-case.ts
│       └── query-use-cases.spec.ts
│
├── application/           # Capa de Aplicación 
│   └── services/
│       ├── recipe-application.service.ts     # Servicio que orquesta casos de uso
│       └── recipe-application.service.spec.ts
│
├── infrastructure/        # Capa de Infraestructura (Adapters)
│   └── repositories/
│       ├── local-storage-recipe.repository.ts  # Impl. localstorage
│       ├── local-storage-recipe.repository.spec.ts
│       └── api-recipe.repository.ts            # Impl. con API REST
│
├── presentation/          # Capa de Presentación (UI)
│   └── view-models/
│       ├── recipe.view-model.ts    # ViewModels para la vista
│       └── recipe.view-model.spec.ts
│
├── components/             # Componentes Angular (UI)
│   ├── recipe-list/
│   │   ├── recipe-list.component.ts
│   │   ├── recipe-list.component.html
│   │   ├── recipe-list.component.css
│   │   └── recipe-list.component.spec.ts
│   ├── recipe-detail/
│   │   ├── recipe-detail.component.ts
│   │   ├── recipe-detail.component.html
│   │   ├── recipe-detail.component.css
│   │   └── recipe-detail.component.spec.ts
│   └── recipe-form/
│       ├── recipe-form.component.ts
│       ├── recipe-form.component.html
│       ├── recipe-form.component.css
│       └── recipe-form.component.spec.ts
│
├── pipes/                 # Pipes de Angular
│   ├── cooking-time.pipe.ts       
│   ├── cooking-time.pipe.spec.ts
│   ├── difficulty.pipe.ts          
│   └── difficulty.pipe.spec.ts
│
├── models/                 # Modelos, trasf. de datos
│   └── recipe.model.ts            
│
└── core/                   # Configuración y tokens
    └── tokens/
        └── repository.tokens.ts    # InjectionTokens para DI
```


## 🔄 Flujo de Datos

### Caso de uso: Crear una receta

```
1. Usuario completa formulario
   ↓
2. RecipeFormComponent valida datos
   ↓
3. Llama a RecipeApplicationService.createRecipe()
   ↓
4. Application Service ejecuta CreateRecipeUseCase
   ↓
5. Use Case valida reglas de negocio
   ↓
6. Use Case crea entidad Recipe
   ↓
7. Use Case persiste via RecipeRepository (interfaz)
   ↓
8. LocalStorageRecipeRepository guarda en localStorage
   ↓
9. Entidad Recipe retorna al componente
   ↓
10. Componente navega a la vista de detalle
```


## 🐳 Docker

### Construir y Ejecutar con Docker Compose

```bash
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:8080`