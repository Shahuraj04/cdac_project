# OneHR - HR Management System | Placement Technical Documentation
**Project Title:** OneHR - Comprehensive HR Management System  
**Developer Profile:** PGDAC Candidate (Specializing in Full-Stack Java Development)  
**Tech Stack:** React.js, Spring Boot 3.x, Spring Security, MySQL, JWT, WebSockets.

---

### 1. PROJECT OVERVIEW (The Pitch)
**OneHR** is a professional-grade HR Management System designed to automate employee lifecycles and daily operations. It solves the problem of manual attendance tracking, fragmented communication, and role-based data isolation in mid-sized organizations.

*   **Key Value Proposition:** Centralized dashboard for Admin, HR, and Employees with real-time updates using WebSockets.
*   **Target Users:** 500+ Employee organizations requiring automated Leave & Attendance workflows.

---

### 2. CORE FEATURES & MODULES
| Feature | Description | Tech Detail |
| :--- | :--- | :--- |
| **RBAC Auth** | Role-Based Access Control using JWT. | Admin, HR, Employee roles. |
| **Attendance** | Real-time Clock-In/Out system. | Business logic for daily hours. |
| **Leave Management**| Apply, Approve, Reject workflow. | JPA status transitions. |
| **Real-time Chat** | Internal messaging between staff. | WebSockets + STOMP. |
| **Dashboard** | Data visualization for stats. | React State Management. |

---

### 3. TECHNICAL ARCHITECTURE (Interviewer's Focus)
The project follows the **MVC Pattern** and a **N-Tier Architecture**:
1.  **Presentation Tier:** React.js (SPA) using Axios for REST communication.
2.  **Logic Tier:** Spring Boot Services handling business rules (e.g., "Cannot apply for leave on past dates").
3.  **Data Tier:** MySQL persistence with Spring Data JPA for ORM.
4.  **Security Layer:** Custom Filter Chain for JWT validation on every HTTP request.

**System Workflow:**  
`React Request` → `CORS Filter` → `JWT Verification Filter` → `Controller` → `Service` → `JPA Repository` → `MySQL`.

---

### 4. DATABASE SCHEMA (ER Summary)
*   **Users Table:** (`id`, `email`, `password`, `role`) - Main entry for Auth.
*   **Employee Table:** (`id`, `user_id`, `dept_id`, `reporting_to_hr`) - 1:1 with User.
*   **Attendance Table:** (`id`, `emp_id`, `clock_in`, `clock_out`, `status`).
*   **Leave Table:** (`id`, `emp_id`, `start_date`, `end_date`, `status`).

---

### 5. TOP 20 PLACEMENT INTERVIEW QUESTIONS & ANSWERS

#### 🔹 Category: Architecture & Framework
1.  **Q: Why use Spring Boot instead of standard Spring/Servlets?**
    *   **A:** Auto-configuration, embedded Tomcat server, and Starter dependencies significantly reduce boilerplate code, allowing a focus on HR business logic.
2.  **Q: Explain the flow of a request in your project.**
    *   **A:** Request hits the `DispatcherServlet`, it goes through `CustomJwtVerificationFilter`. If authenticated, `HandlerMapping` finds the Controller. Service layer processes business logic, and JPA Repository interacts with MySQL.
3.  **Q: What is @RestController?**
    *   **A:** It’s a specialized version of `@Controller` that includes `@ResponseBody`. It tells Spring that the return value of methods should be written directly into the HTTP response body (usually JSON).

#### 🔹 Category: Security (JWT)
4.  **Q: How does JWT authentication work in OneHR?**
    *   **A:** User logs in → Backend validates → Generates a signed Token (Header.Payload.Signature) → Frontend stores it in `localStorage` → Frontend sends it in `Authorization: Bearer <token>` header for all protected API calls.
5.  **Q: How do you handle password security?**
    *   **A:** I use `BCryptPasswordEncoder` with a strength of 10. We never store plain text passwords; we store their hashes. 
6.  **Q: What happens if the JWT is intercepted by a hacker?**
    *   **A:** To mitigate this, we use HTTPS for encryption in transit. We also set a short expiration time for the access token and use a secret key stored in environment variables.

#### 🔹 Category: Spring Data JPA & Database
7.  **Q: How did you handle the relationship between Employee and HR?**
    *   **A:** Used `@ManyToOne` in the `Employee` entity pointing to the `HR` entity, as many employees report to one HR manager.
8.  **Q: Explain Transaction Management in your project.**
    *   **A:** Used `@Transactional` on service methods (like Leave Approval) to ensure that if the DB update fails, the entire operation rolls back to maintain data integrity.
9.  **Q: What is the difference between findById() and getReferenceById()?**
    *   **A:** `findById()` hits the DB immediately (Eager), while `getReferenceById()` returns a proxy (Lazy) and hits the DB only when the object is accessed.

#### 🔹 Category: Advanced (WebSockets & Real-time)
10. **Q: Why use WebSockets for chat instead of regular HTTP Polling?**
    *   **A:** HTTP is unidirectional and has high overhead for real-time apps. WebSockets provide a persistent, full-duplex connection which is more efficient for instant messaging.
11. **Q: What is STOMP?**
    *   **A:** STOMP is a simple text-oriented messaging protocol that works over WebSockets. It allows us to use 'topics' and 'queues' for routing messages properly.

#### 🔹 Category: Scenario-Based (Critical)
12. **"If the database is slow, how will you optimize it?"**
    *   **A:** I would first analyze the queries using `EXPLAIN`. I'd implement **Indexing** on frequently searched columns (like email or emp_id). I could also use **Hibernate Second Level Cache** or **Redis**.
13. **"How do you handle Global Exceptions?"**
    *   **A:** I implemented `@ControllerAdvice`. It intercepts all exceptions (like `ResourceNotFound`) and returns a standard JSON structure with a proper HTTP Status Code instead of an ugly stack trace.
14. **"How do you handle Cross-Origin (CORS) issues?"**
    *   **A:** Configured Spring Security to allow the React URL (`http://localhost:5173`) using `CorsConfiguration` to permit specific headers and methods (GET, POST, etc.).
15. **"What will you do if two employees try to book the same slot simultaneously?"**
    *   **A:** I would use **Pessimistic Locking** (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) in JPA to ensure one transaction finishes before the other can start modifying the record.

---

### 6. KEY CODING BITS (FOR WHITEBOARD/EXPLANATION)
*   **JWT Filter logic:** Mention `doFilterInternal` and `SecurityContextHolder`.
*   **WebSocket Config:** Mention `MessageBrokerRegistry` and `EndpointRegistry`.
*   **React Context/Hooks:** Explain how `useEffect` triggers the clock-in timer.

---
**Final Placement Tip:** Focus on explaining **WHY** you chose a technology (e.g., "I used MySQL because HR data is highly relational and requires ACID properties") rather than just **WHAT** you used.
