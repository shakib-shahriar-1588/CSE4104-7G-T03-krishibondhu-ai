# KrishiBondhu AI – Smart Farming Assistant

**An AI-Based Agricultural Assistance Platform for Farmers in Bangladesh**

## About the Project

KrishiBondhu AI is an AI-powered agricultural assistance platform designed to support farmers in Bangladesh. It aims to provide accessible farming information and AI-assisted guidance in both Bangla and English.

The platform helps farmers understand common agricultural problems and make informed decisions about crop cultivation, soil management, irrigation, fertilizers, pests, and crop diseases.

## Problem Statement

Farmers in Bangladesh often face difficulties accessing reliable agricultural information and finding appropriate solutions to farming-related problems. Limited access to agricultural experts and language barriers can make these challenges more difficult.

KrishiBondhu AI aims to address these issues through an accessible, AI-based agricultural support platform.

## Objectives

- Provide agricultural information in Bangla and English.
- Help identify and understand common crop-related problems.
- Provide AI-assisted farming recommendations.
- Improve access to agricultural knowledge.
- Support better agricultural decision-making.

## Features

- **AI Agricultural Assistant:** Ask farming-related questions in Bangla or English.
- **Crop Disease Detection:** Upload crop images for preliminary AI-based analysis.
- **Fertilizer Guidance:** Receive general fertilizer recommendations based on available crop and soil information.
- **Crop Recommendations:** Get suggestions based on soil conditions, season, and location.
- **Weather Updates:** Access useful weather information.
- **Pest Management:** Learn about common agricultural pests and their management.
- **Farm Records:** Save crop information and farming notes.
- **Reminders:** Set reminders for irrigation and other farming activities.
- **Saved Recommendations:** Access previously received agricultural advice.
- **User Accounts & Roles:** Registration and login for Farmers, Agricultural Advisors, and Admins.
- **Advisor & Admin Tools:** Review flagged AI responses, manage users and the knowledge base, and view usage reports.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Responsive Web Application) |
| Backend | Node.js with Express.js (REST API) |
| Database | MongoDB |
| Authentication | JWT (JSON Web Token) |
| AI Integration | Google Gemini API (Text and Image Analysis) |
| Weather Service | Weather API (e.g., OpenWeatherMap) |
| Email Service | SMTP (Password Reset) |
| Version Control | Git and GitHub |
| Deployment | To be decided |

## System Architecture

The system follows a client-server architecture. The React frontend communicates with the Node.js/Express backend through REST APIs. The backend manages database operations and communicates with external AI, weather, and email services.

```text
          Frontend (React.js)
                  |
                  v
        Backend API (Node.js
             + Express.js)
                  |
          +-------+-------+
          |       |       |
          v       v       v
       MongoDB  Gemini   External
                API      Services
                         (Weather,
                          Email)
```

## Repository Structure

```text
CSE4104-7G-T03-krishibondhu-ai/
│
├── backend/                     # Node.js + Express REST API
│
├── frontend/                    # React web application
│
├── docs/                        # Project documentation
│   ├── CSE4104-7G-T03_SRS.pdf
│   ├── CSE4104-7G-T03_Proposal.pdf
│   ├── CSE4104-7G-T03_TeamInfo.pdf
│   ├── CSE4104-7G-T03_UseCaseDiagram.pdf
│   ├── CSE4104-7G-T03_ERDiagram.pdf
│   └── CSE4104-7G-T03_ArchitectureDiagram.pdf
│
├── .gitignore
│
└── README.md
```

## Documentation

All project documents are available in the `docs/` directory.

| Document | File |
|---|---|
| Project Proposal | `CSE4104-7G-T03_Proposal.pdf` |
| Team Information | `CSE4104-7G-T03_TeamInfo.pdf` |
| Software Requirements Specification (SRS) | `CSE4104-7G-T03_SRS.pdf` |
| Use Case Diagram | `CSE4104-7G-T03_UseCaseDiagram.pdf` |
| Entity Relationship (ER) Diagram | `CSE4104-7G-T03_ERDiagram.pdf` |
| System Architecture Diagram | `CSE4104-7G-T03_ArchitectureDiagram.pdf` |

## Target Users

- Farmers in Bangladesh
- Agricultural students
- Agricultural advisors
- Rural communities

## Team Information

| Role | Name | Student ID |
|---|---|---|
| Team Leader | Shakib Shahriar | 11230321588 |
| Member 2 | Samia Rahman | 11230321590 |
| Member 3 | Tanusree Mistry | 11230321465 |

**Course:** CSE 4104 – Software Development III  
**Section:** 7G  
**Team Name:** CSE4104-7G-T03  
**Course Teacher:** Md. Riaz Mahmud, Assistant Professor, Department of CSE, Northern University of Business and Technology, Khulna.

## Expected Outcome

A user-friendly web application that provides accessible agricultural information and AI-assisted farming guidance to support farmers in Bangladesh.

## Project Status

- [x] Project proposal completed
- [x] Software Requirements Specification (SRS) completed
- [x] Initial system diagrams prepared
- [ ] Detailed system design
- [ ] Backend and frontend development
- [ ] Integration and testing
- [ ] Deployment

## Repository Purpose

This repository contains the project's documentation, source code, and other relevant development materials throughout the project development process.

## Disclaimer

KrishiBondhu AI provides preliminary, AI-generated agricultural guidance. Its recommendations are informational and should not be considered a substitute for professional agricultural advice. Farmers should consult qualified agricultural experts or local agricultural extension officers before making important farming decisions.
