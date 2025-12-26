# How is the application hosted?

The application is hosted on [Render](https://render.com/).

We have a free account on render that points to a github repo and contains a run command and some Supabase environment variables.

Here is a diagram, because diagrams are cool.

```mermaid
flowchart LR
    User[User / Browser]

    GitHub[GitHub Repository]
    Render[Render Hosting]
    ReactApp[React Frontend]
    Supabase["Supabase BaaS (Database)"]

    User -->|Uses app| ReactApp
    GitHub -->|Deploys from| Render
    Render -->|Hosts| ReactApp
    ReactApp -->|API calls| Supabase
    Supabase -->|Data & Auth responses| ReactApp
```




