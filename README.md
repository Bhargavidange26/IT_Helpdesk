# IT Helpdesk System 

## Project Overview

The **IT Helpdesk System** is a web-based application designed to manage user support tickets efficiently. This project integrates **DevOps practices** using **Jenkins Freestyle Jobs** to automate the build, testing, and deployment process.

It demonstrates a complete **CI/CD pipeline** with automated testing and Docker-based deployment.

---

## 🚀 Features

* 🎫 Ticket creation and management
* 👤 Role-based access (Admin, Developer, Viewer)
* 🔍 Ticket search and filtering
* 📊 Dashboard for agents and users
* 🧪 Automated unit testing using Jest
* 🌐 End-to-End testing using Cypress
* 🐳 Docker-based deployment
* ⚙️ CI/CD automation using Jenkins Freestyle

---

##  Tech Stack

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| JavaScript (HTML, CSS, JS)  | Frontend                      |
| Node.js (npm)               | Dependency management & build |
| Git & GitHub                | Version control               |
| Jenkins (Freestyle Project) | CI/CD automation              |
| Docker                      | Containerization              |
| Jest                        | Unit testing                  |
| Cypress                     | End-to-End testing            |
| ngrok                       | Webhook tunneling             |

---

##  Project Structure

```
IT_Helpdesk/
│
├── frontend/            # UI files (HTML, CSS, JS)
├── tests/               # Jest test cases
├── cypress/             # Cypress E2E tests
├── Dockerfile           # Docker configuration
├── package.json         # Node dependencies
└── README.md
```

---

##  CI/CD Workflow

```
Developer → GitHub → Webhook → Jenkins → Build → Test → Docker → Deploy
```

###  Pipeline Steps:

1. Code pushed to GitHub
2. Webhook triggers Jenkins
3. Jenkins pulls latest code
4. npm installs dependencies
5. Jest tests executed
6. Cypress tests executed
7. Docker image built
8. Container deployed on port 8080

---

##  Setup Instructions

### 1️ Clone Repository

```bash
git clone https://github.com/Bhargavidange26/IT_Helpdesk
cd IT_Helpdesk
```

---

### 2️ Install Dependencies

```bash
npm install
```

---

### 3️ Run Tests

#### Unit Testing (Jest)

```bash
npm test
```

#### End-to-End Testing (Cypress)

```bash
npx cypress run
```

---

### 4️ Run with Docker

#### Build Image

```bash
docker build -t ithelpdesk-app .
```

#### Run Container

```bash
docker run -d -p 8080:80 --name ithelpdesk-container ithelpdesk-app
```

👉 Open in browser:

```
http://localhost:8080
```

---

##  Jenkins Configuration (Freestyle)

* Source Code: GitHub Repo
* Branch: `main` / `docker-setup`
* Build Trigger: GitHub Webhook
* Build Steps:

  * npm install
  * npm test
  * Cypress execution
  * Docker build & run

---

##  GitHub Webhook Setup

* Payload URL:

```
https://<ngrok-url>/github-webhook/
```

* Content Type: `application/json`
* Event: `Push`

---

##  Testing Summary

###  Jest (Unit Testing)

* 19 test cases
* Covers core functions:

  * Authentication
  * Ticket creation
  * Status updates

###  Cypress (E2E Testing)

* 18 test cases
* Covers:

  * User workflows
  * Dashboard operations
  * Data persistence
  * Edge cases

---

##  Docker Details

### Dockerfile

```dockerfile
FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 80
```

---

##  Challenges Faced

| Issue                  | Solution                         |
| ---------------------- | -------------------------------- |
| Jenkins not triggering | Fixed webhook + new commits      |
| Test failures          | Added delays & proper setup      |
| Docker port conflict   | Stop/remove container before run |
| ngrok URL change       | Updated webhook                  |

---

##  System Architecture

```
GitHub → Jenkins → Testing (Jest + Cypress) → Docker → Deployment
```


##  Conclusion

This project successfully demonstrates a **complete DevOps CI/CD pipeline** using Jenkins Freestyle configuration. It automates:

* Code Integration
* Build Process
* Testing
* Deployment

It provides a simple yet powerful implementation of **Continuous Integration, Continuous Testing, and Continuous Deployment**.

---


