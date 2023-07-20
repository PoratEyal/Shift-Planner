# Shift Planner

Shift Planner is a web-based application that allows users to manage and view their shifts for the current week and the next week. The application is built with Node.js, Express.js for the backend, and React.js for the frontend.

## Features

- User-friendly interface for managing and viewing shifts
- Create and manage shifts for the current and next week
- Assign workers to shifts
- Create and manage user accounts
- Define user roles and permissions

## Technologies Used

- Backend: Node.js, Express.js
- Frontend: React.js
- Database: MongoDB

## Installation

To run Shift Planner locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/[your-username]/shift-planner.git
   ```

2. Navigate to the project directory:

   ```bash
   cd shift-planner
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3001` to access the application.

## Usage

1. Log in to the Shift Planner application as a manager.

2. As a manager, you have access to additional features such as creating and deleting users and roles.

3. Create user accounts for workers and assign them appropriate roles.

4. Create shifts for the current week or the next week by specifying the shift details such as date, time, and position.

5. Publish the shifts to make them visible to all workers.

6. As a worker, log in to the Shift Planner application.

7. View the published shifts and choose the shifts you want to work by adding yourself to them.

8. As a manager, review the shifts where workers have added themselves.

9. Choose workers for each shift based on their availability or other criteria. You can either select the workers who have added themselves or choose different workers.

10. Once you have finalized the worker assignments, publish the week to notify all workers of their assigned shifts.

11. As a worker, view the published week to see the shifts where you have been assigned.

Note: Only the manager has the ability to create and delete users and roles, create shifts, publish shifts, choose workers for shifts, and publish the week. Workers can only view the published shifts, add themselves to shifts, and view their assigned shifts after the manager has published the week.

## Contact

If you have any questions or inquiries, feel free to contact Eyal porat at eyal1.porat@gmail.com and Edi Grunseid at edgru99@gmail.com.
<img width="1235" alt="Screenshot 2023-07-20 160843" src="https://github.com/PoratEyal/Shift-Planner/assets/134833213/a40a300a-d900-48c9-9f87-29847fd28d93">

