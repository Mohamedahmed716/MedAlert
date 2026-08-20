# MedAlert: Hospital Coordinator System

MedAlert is a comprehensive full-stack web application engineered to manage and streamline hospital coordination. By implementing a robust multi-role architecture, the system provides isolated, specialized environments for different hospital demographics, including Hospital Administrators, Doctors, and Patients.

## System Architecture

The application leverages a modern full-stack ecosystem to ensure reliable data management and a responsive user interface:
*   **Backend:** Spring Boot (Java) handling RESTful API endpoints, security, and business logic.
*   **Frontend:** Angular providing a dynamic, styled single-page application (SPA) dashboard.
*   **Database:** MySQL relational database structured with optimized schemas for medical records, staff, and operational tracking.

## Core Features

*   **Multi-Role Access Control:** Strict authentication mapping ensures users are securely routed to their designated dashboards based on their verified credentials.
*   **Hospital Admin Dashboard:** A centralized interface for managing hospital operations, staff assignments, and system-wide configurations.
*   **Doctor Portal:** Specialized views for medical professionals to manage their workflows and patient interactions.
*   **Patient Interface:** A dedicated frontend environment for patients to securely access the hospital system.
*   **Relational Data Integrity:** Complex MySQL schemas designed to maintain accurate, consistent relationships between hospital departments, staff, and patient records.

## Prerequisites

To compile and run this application locally, the following environments must be configured:
*   **Java Development Kit (JDK)** (Version compatible with the Spring Boot build)
*   **Node.js and npm**
*   **Angular CLI**
*   **MySQL Server** (Running locally or accessible remotely)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mohamedahmed716/medalert.git](https://github.com/mohamedahmed716/medalert.git)
    cd medalert
    ```

2.  **Database Configuration:**
    *   Create a new MySQL database for the application.
    *   Navigate to the backend configuration file (typically `application.properties` or `application.yml`) and update the `spring.datasource.url`, `username`, and `password` to match your local MySQL instance.

3.  **Backend Execution:**
    *   Open the project in your preferred Java IDE (e.g., IntelliJ IDEA).
    *   Allow the build tool (Maven/Gradle) to download the required Spring Boot dependencies.
    *   Run the main application class to initialize the backend server.

4.  **Frontend Execution:**
    *   Navigate into the Angular frontend directory via your terminal.
    *   Install the necessary node modules:
        ```bash
        npm install
        ```
    *   Start the development server:
        ```bash
        ng serve
        ```
    *   Access the UI by navigating to `http://localhost:4200` in your web browser.
