
# InsureMojo User Management Guide

## Table of Contents

1. [Introduction](#introduction)
2. [User Roles and Permissions](#user-roles-and-permissions)
3. [User Management](#user-management)
4. [Security Best Practices](#security-best-practices)
5. [Troubleshooting](#troubleshooting)

## Introduction

This document provides comprehensive guidance on managing users within the InsureMojo Admin Portal. It covers user roles, permissions, account management, and security best practices.

## User Roles and Permissions

### Available Roles

InsureMojo offers several predefined roles with different access levels:

| Role | Description | Access Areas |
|------|-------------|--------------|
| Admin | Full system access | All areas |
| Underwriter | Policy management | Policies, Customers |
| Support | Customer support | Support, Customers |
| Manager | Department oversight | Policies, Claims, Payments, Customers |

### Permission Details

- **Policies**: Access to view, create, and manage insurance policies
- **Claims**: Access to view, process, and manage insurance claims
- **Customers**: Access to view and manage customer information
- **Payments**: Access to view and manage payment transactions
- **Support**: Access to the customer support system
- **Settings**: Access to system configuration and user management (Admin only)

## User Management

### Adding a New User

1. Navigate to **Settings** > **Team Management**
2. Click the "Add Team Member" button
3. Fill in the required information:
   - Full Name
   - Email Address
   - Initial Password
   - Role
4. Click "Create User" to add the new team member

### Editing User Information

1. Navigate to **Settings** > **Team Management**
2. Find the user you want to edit
3. Click the edit (pen) icon next to their name
4. Update the user's information as needed
5. Click "Save Changes" to apply the updates

### Deactivating a User

1. Navigate to **Settings** > **Team Management**
2. Find the user you want to deactivate
3. Click the delete (trash) icon next to their name
4. Confirm the deactivation in the dialog

## Security Best Practices

### Password Policies

- Enforce strong passwords (minimum 8 characters, including uppercase, lowercase, numbers, and special characters)
- Require password changes every 90 days
- Do not reuse the previous 5 passwords

### Login Attempt Restrictions

The system limits login attempts to prevent unauthorized access:

- After 7 failed login attempts, a user's account is temporarily locked
- Only IT support staff can unlock accounts by resetting login attempts
- To reset login attempts, go to **Settings** > **System Settings** > **Security Settings**

### Session Management

- User sessions automatically timeout after a period of inactivity
- Default timeout is set to 30 minutes
- This can be configured in **Settings** > **System Settings** > **Security Settings**

## Troubleshooting

### Common Issues

**User cannot log in**
- Verify the correct email is being used
- Check if the account is locked due to too many failed attempts
- Reset password if necessary

**User cannot access certain features**
- Verify the user has the correct role assigned
- Check if permissions have been updated recently
- Ensure the feature is available for the user's role

**Account Lockout**
- If a user reports being locked out, verify their identity through secondary channels
- Reset their login attempts through the security settings
- Provide a temporary password if necessary

### Getting Help

For additional assistance with user management:
- Contact the IT support team
- Reference the complete system administration manual
- Submit a support ticket through the internal help desk
