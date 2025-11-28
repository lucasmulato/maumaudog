# Project To-Do List

This document tracks the tasks for the **maumaudog** project. Please keep it updated as you work on new features or fix bugs.

## How to Use

- Add new tasks to the **To Do** section.
- When you start working on a task, move it to the **In Progress** section and add your name (`@username`).
- When a task is completed, move it to the **Done** section.

---

## 🎯 To Do
- **Frontend**
- **Backend Setup**
  - [ ] Add basic API documentation (e.g., using Swagger/OpenAPI).
- **Backend API Development**
  - [ ] Create API endpoints to manage order status (e.g., PREPARING, COMPLETED, CANCELLED).
- **Printer Bridge Development**
  - [ ] Add error handling for network issues and printer status (e.g., offline, out of paper).
  - [ ] Implement retry logic for fetching orders if the backend is unavailable.
- **Testing**
  - [ ] Write integration tests for the main API endpoints.
- **Project Management**
  - [ ] Review and assign all current tasks in the "To Do" and "In Progress" sections.

## 🚧 In Progress

- [ ] Research iFood and 99food APIs for order integration. (`@username`)

## ✅ Done

- **Backend Setup**: Implemented a robust logging strategy using Winston.
- **Testing**: Wrote unit tests for the `orderService` to ensure parsing and saving logic is correct.
- **Frontend**: Integrated frontend with backend API to fetch and update order data.
- **Frontend**: Implemented functionality to update order status from the UI.
- **Frontend**: Created a custom favicon for the application.
- **Frontend**: Built the main dashboard layout (`DashboardLayout.jsx`).
- **Frontend**: Created components to display orders (`OrderList.jsx`, `OrderCard.jsx`).
- **Project Setup**: Set up the basic project structure.
- **Project Setup**: Initialized project structure, `ToDo.md`, and technology stack.
- **Frontend**: Initialized project with Vite, React, and Tailwind CSS.
- **Database**: Designed `schema.sql`, created migration script, and set up DB connection.
- **Backend Core**: Implemented order parsing and saving logic.
- **Backend API for Printer**:
  - Created endpoint to fetch new orders (`GET /api/orders/new`).
  - Created endpoint to mark orders as printed (`PATCH /api/orders/:id/mark-as-printed`).
- **Backend API for Webhooks**:
  - Created secure webhook endpoint for iFood (`POST /api/webhooks/ifood`).
  - Created secure webhook endpoint for 99food (`POST /api/webhooks/99food`).
- **Printer Bridge**: Initialized project and implemented logic to format and print receipts.