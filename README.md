# 🤖 AI Procurement

### Intelligent Procurement Management & Decision Support System

AI Procurement is an AI-powered procurement management platform designed to simplify and automate the procurement lifecycle. It helps organizations manage procurement requests, analyze supplier information, assess risks, and support better purchasing decisions through intelligent automation.

---

## 🚀 Overview

Traditional procurement processes often involve manual data entry, repetitive approvals, supplier evaluation, and disconnected workflows.

**AI Procurement** provides a centralized platform that combines:

- 🤖 Artificial Intelligence
- 📊 Data-driven decision making
- ⚡ Workflow automation
- 🔍 Supplier analysis
- 🛡️ Risk assessment
- 📋 Procurement request management

The goal is to reduce manual effort, improve transparency, and help procurement teams make faster and smarter decisions.

---

## ✨ Key Features

### 📋 Procurement Request Management
- Create and manage procurement requests
- Track request status
- Organize procurement information
- Monitor pending and completed requests

### 🤖 AI-Powered Analysis
- Analyze procurement requests
- Extract important information from submitted data
- Provide intelligent recommendations
- Assist users in procurement decision-making

### 🏢 Supplier Management
- Maintain supplier information
- Compare supplier details
- Evaluate supplier performance
- Support supplier selection

### 🛡️ Risk Assessment
The system evaluates procurement-related information and categorizes requests based on risk factors such as:

- Transaction value
- Supplier reliability
- Missing information
- Historical performance
- Procurement category
- Policy compliance

Risk levels can be classified as:

| Risk Level | Description |
|------------|-------------|
| 🟢 Low | Low-risk procurement with minimal concerns |
| 🟡 Medium | Procurement requiring additional review |
| 🔴 High | Procurement requiring detailed verification and approval |

### ⚡ Workflow Automation
- Automates repetitive procurement tasks
- Reduces manual intervention
- Improves approval workflows
- Provides centralized request tracking

### 📊 Dashboard
The dashboard provides an overview of:

- Total procurement requests
- Pending requests
- Approved requests
- Rejected requests
- Risk distribution
- Supplier information
- Procurement activity

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User / Admin   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Next.js      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │ AI Engine  │ │ Risk       │ │ Database   │
          │ / LLM      │ │ Assessment │ │ / Supabase │
          └────────────┘ └────────────┘ └────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Intelligent Output  │
                    │ Recommendations     │
                    └─────────────────────┘
