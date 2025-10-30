# WebLit: Automated Primary Study Selection for Systematic Literature Reviews (SLRs).

## Overview
**WebLit** is an open-source, web-based application designed to fully automate the **primary study selection process** in **Systematic Literature Reviews (SLRs)**. Built with **Angular** for the frontend and **Node.js** for the backend, WebLit leverages the power of **GPT-4** to dynamically retrieve, filter, and analyze research papers across multiple disciplines.

This tool aims to:
- Eliminate manual efforts in SLRs.
- Provide transparent, user-controlled automation. 
- Enhance cross-domain applicability. 

---

## Key Features

- **Dynamic Paper Retrieval**: Automates the search and retrieval of research papers using customizable search strings.  
- **Full Automation**: From data collection to study selection—no manual uploads required.  
- **Customizable Criteria**: Flexible inclusion/exclusion parameters tailored to specific research needs.  
- **Integrated Chat**: Interact with an LLM trained on your selected studies for deeper insights.  
- **SLR History & Traceability**: View, edit, and manage all past SLRs for continuous improvement.  
- **Cross-Disciplinary Support**: Tested in medical sciences, engineering, and social sciences.  


---

## Performance Highlights

- **Precision Rate**: 73.3% (High accuracy in identifying relevant studies)  
- **Retention Rate**: 1.7% (Selective and rigorous screening process)  

These metrics emphasize WebLit’s focus on **quality over quantity** in study selection.

---

## Tech Stack

- **Frontend:** [Angular](https://angular.io/)  
- **Backend:** [Node.js](https://nodejs.org/)  
- **LLM:** GPT-4   

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or above)  
- **Angular CLI** (v15 or above)  
- **npm** (v6 or above)  

---

### Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/ftoucch/weblit.git
   cd weblit

2. **Environment Setup**
Rename .env-example to .env
Add the required environment variables in .env
(Ensure you have API keys or credentials if needed)

3.  **Backend Setup**
    ```bash 
    npm install && npm run dev

4.  **Frontend Setup**

    ```bash
    cd client
    npm install 
    ng serve --open
