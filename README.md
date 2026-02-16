# Aplicación de Gestión de Recetas
## Estructura del Proyecto (clean architecture)

```
src/app/
├── domain/                          # Capa de Dominio (Entities & 
Business Rules)
│   ├── entities/
│   │   └── recipe.entity.ts        # Entidad Recipe como clase con lógica de negocio
│   ├── repositories/
│   │   └── recipe.repository.ts    # Interfaz del repositorio (Port)
│   └── use-cases/                   # Casos de uso (Application Business Rules)
│       ├── create-recipe.use-case.ts
│       ├── update-recipe.use-case.ts
│       ├── delete-recipe.use-case.ts
│       ├── get-all-recipes.use-case.ts
│       ├── get-recipe-by-id.use-case.ts
│       └── search-recipes.use-case.ts
│
├── application/                     # Capa de Aplicación (Application Services)
│   └── services/
│       └── recipe-application.service.ts  # Servicio que orquesta casos de uso
│
├── infrastructure/                  # Capa de Infraestructura (Adapters)
│   └── repositories/
│       └── local-storage-recipe.repository.ts  # Implementación concreta (Adapter)
│
├── presentation/                    # Capa de Presentación (UI)
│   └── view-models/
│       └── recipe.view-model.ts    # ViewModels para la vista
│
├── components/                      # Componentes Angular (UI)
│   ├── recipe-list/
│   ├── recipe-detail/
│   └── recipe-form/
│
└── core/                           # Configuración y tokens
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