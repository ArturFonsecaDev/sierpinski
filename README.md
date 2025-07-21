# 🔺 Sierpinski Fractal Generator

This project is an interactive web application that visualizes the construction of the famous **Sierpinski Triangle** using the **Chaos Game** algorithm. It allows users to define the number of points to generate and dynamically observe the fractal forming on the canvas.

---

## ✨ Project Concept

The main idea is to provide a **visual and educational** experience about fractals, particularly the Sierpinski Triangle. Instead of just showing the final image, the app demonstrates the **iterative process** of its creation, where each point is added sequentially, gradually revealing the complex fractal structure over time.

---

## ⚙️ How It Works

The Sierpinski Triangle is generated using the **Chaos Game Algorithm**:

1. **Base Vertices**: An initial triangle (three outer vertices) is defined.
2. **Starting Point**: A random point is chosen inside this triangle.
3. **Iterations**: The following steps are repeated thousands of times:
   - One of the three triangle vertices is randomly selected.
   - The midpoint between the current point and the chosen vertex is calculated.
   - This new midpoint is drawn on the canvas.
   - The new point becomes the current point for the next iteration.

By repeating this process many times, the points gradually fill in the area of the Sierpinski Triangle, leaving behind the characteristic empty spaces that define the fractal.

---

## 🚀 Features

- **Custom Point Input**: Users can specify the number of points to generate.
- **Input Validation**: Only positive integers are accepted, with visual feedback for invalid entries.
- **Dynamic Visualization**: Points are drawn one by one with a small delay (5ms), allowing users to observe the fractal forming in real time.
- **Progress Bar**: A real-time progress bar displays the percentage of generated points.
- **Simulation Cancellation**: Users can cancel the simulation at any time, which clears the canvas.
- **Easy Restart**: After completion or cancellation, a button allows users to easily start a new simulation.
- **Responsive Design**: The interface adapts to both desktop and mobile screens.

---

## 🛠️ Technologies Used

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript.
- **HTML Canvas API**: For drawing points and the triangle directly in the browser.
- **Tailwind CSS**: A utility-first CSS framework for rapid and responsive styling.
- **Shadcn UI**: A set of accessible, customizable components built with Tailwind and based on Radix UI.

---
