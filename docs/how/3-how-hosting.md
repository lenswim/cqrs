# How is the application hosted?

The application is hosted on [Render](https://render.com/).

We have a free account on render that points to a github repo and contains a run command and some Supabase environment variables.

Here is a diagram, because diagrams are cool.

<details>
    <summary>
        Click here to see a diagram
    </summary>

    ```mermaid
        graph TD
    subgraph GitHub_Repo[GitHub Repository]
        Code[React + Supabase Code]
        Docs[ADR + Documentation]
        Pages[Github Pages <br> https://lenswim.github.io/cqrs/]
        Workflow[Github Action]
    end

    subgraph Render_Platform[Render Hosting]
        ReactApp[React Frontend App]
        EnvVars[Env: SUBABASE_SECRETS]
    end

    subgraph Supabase_Cloud[Supabase Backend]
        subgraph Edge_Runtime[Edge Functions]
            ValidationFunc[create-conversation Function]
            ZodCheck[Zod Validation]
        end

        subgraph Database_Layer[Database]
            ConvTable[(conversations Table)]
        end

        subgraph PostgREST[REST API]
            DataQuery[Query Conversations]
        end
    end

    Workflow -.->|builds| Docs
    Workflow -.->|deploys to| Pages

    Code -->|Deploy| ReactApp
    ReactApp -.->|Reads| EnvVars
    
    ReactApp ==>|POST| ValidationFunc
    ValidationFunc --> ZodCheck
    ZodCheck -->|Insert| ConvTable

    ReactApp -->|GET Request| DataQuery
    DataQuery -->|Reads| ConvTable
```
</details>




