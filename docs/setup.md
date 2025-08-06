# CineScope Project Setup

This document outlines the setup and installation steps for the CineScope project.

## Step 1: Initial Project Structure

1. We created the basic directory structure:
   - `app/` – React Native application  
   - `backend/` – Node.js API  
   - `docs/` – Project documentation  
   - `.github/workflows/` – CI/CD configuration files  

2. Docker Compose was configured for local development:
   - Backend service using Node.js  
   - PostgreSQL database  

3. Initial README files were created for both the app and backend.

## Step 2: React Native Setup with Expo

1. Installed the Expo CLI globally:

   ```bash
   npm install -g expo-cli
