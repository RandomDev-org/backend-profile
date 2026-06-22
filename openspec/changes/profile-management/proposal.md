# Profile Management

## Problem
Users can't create or edit their profile from the frontend. The profile entity lacks a `role` field (user vs venue_owner). Preferences and history exist in the backend but have no UI.

## Solution
1. Add `role` field to Profile entity (user | venue_owner)
2. Add frontend pages for profile CRUD, preferences, and history
3. Wire up the existing gateway routes to frontend services

## Scope
- backend-profile: Add role field, expose profile CRUD via TCP
- backend-gateaway: Add profile CRUD proxy routes
- frontend: Profile page, preferences page, history page
