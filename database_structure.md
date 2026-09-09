# ProcureAI — Database Architecture

## Supabase Database Architecture

<pre>
                 SUPABASE
                    │
        ┌───────────┴───────────┐
        │                       │
   SUPABASE AUTH            POSTGRESQL
        │                       │
        │                 ┌─────┴─────┐
        │                 │           │
        ▼                 ▼           ▼
    auth.users       CORE DATA    INTELLIGENCE
        │                 │           │
        ▼                 │           ├─ requirement_validations
     profiles             │           ├─ dependency_definitions
                          │           ├─ decision_simulations
                          │           ├─ simulation_scenarios
                          │           └─ ai_recommendations
                          │
                          ├─ suppliers
                          ├─ rfqs
                          ├─ quotations
                          ├─ purchase_orders
                          ├─ inventory_items
                          ├─ assets
                          ├─ spend_records
                          ├─ historical_data
                          ├─ supplier_risk_assessments
                          └─ price_forecasts

                    AI / SYSTEM
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       conversations  notifications  reports
              │
              ▼
       chat_messages

              +
         audit_logs
</pre>