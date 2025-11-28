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
- **Printer Bridge Development**
  - [ ] Initialize project in `printer_bridge/` (e.g., using Node.js).
  - [ ] Add a library for ESC/POS printer commands (for the POS-5890U-L).
  - [ ] Implement logic to fetch new orders from the backend.
  - [ ] Implement logic to format order data into a receipt and send it to the USB printer.

## 🚧 In Progress

- **Backend Setup**
  - [x] Choose backend technology (e.g., Node.js, Dart, Python) and initialize project in `backend/`.
  - [x] Design database schema (tables for orders, items, customers).
  - [ ] Set up database connection.
- [x] Set up the basic project structure.
- [x] Research iFood and 99food APIs for order integration.

## ✅ Done

- [x] Create this `ToDo.md` file to track project tasks.
- [x] Define the main features for the restaurant application.