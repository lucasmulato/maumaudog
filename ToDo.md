# Project To-Do List

This document tracks the tasks for the **maumaudog** project. Please keep it updated as you work on new features or fix bugs.

## How to Use

- Add new tasks to the **To Do** section.
- When you start working on a task, move it to the **In Progress** section and add your name (`@username`).
- When a task is completed, move it to the **Done** section.

---

## 🎯 To Do

- [ ] Initialize the frontend project inside the `frontend/` directory.
- **Backend API Development**
  - [ ] Create API endpoint (webhook) to receive new orders from iFood.
  - [ ] Create API endpoint (webhook) to receive new orders from 99food.
  - [ ] Implement logic to parse and save orders from all sources into the database.
  - [ ] Create an API endpoint for the printer bridge to fetch new orders to be printed.

## 🚧 In Progress

- **Backend Setup**
  - [x] Set up database connection in `backend/`.
  - [ ] Create a script to run the `schema.sql` migration.
- [x] Set up the basic project structure.
- [x] Research iFood and 99food APIs for order integration.
- **Printer Bridge Development**
  - [x] Initialize project in `printer_bridge/` (e.g., using Node.js).
  - [x] Implement logic to format order data into a receipt and send it to the USB printer.
  - [ ] Implement logic to fetch new orders from the backend.

## ✅ Done

- [x] Create this `ToDo.md` file to track project tasks.
- [x] Define the main features for the restaurant application.
- [x] Choose backend technology (Node.js, Express, PostgreSQL) and initialize project in `backend/`.
- [x] Design database schema and create `schema.sql` file.
- [x] Add a library for ESC/POS printer commands (for the POS-5890U-L).