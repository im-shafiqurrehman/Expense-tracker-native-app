# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development Workflow
- `npm start` or `npx expo start` - Start the Metro bundler and development server
- `npm run android` or `npx expo start --android` - Run on Android device/emulator
- `npm run ios` or `npx expo start --ios` - Run on iOS device/simulator  
- `npm run web` or `npx expo start --web` - Run in web browser
- `npm run lint` or `npx expo lint` - Run ESLint for code quality checks

### Build and Deployment
- `npx expo build:android` - Build Android APK/AAB
- `npx expo build:ios` - Build iOS IPA
- `npx eas build --platform android` - Build with EAS (if configured)
- `npx eas build --platform ios` - Build iOS with EAS (if configured)

### Development Utilities
- `npm run reset-project` - Reset project structure (removes existing app code, creates blank template)
- `npx expo install --fix` - Fix dependency versions for current Expo SDK
- `npx expo doctor` - Check for common project configuration issues
- `npx expo customize` - Customize built-in Expo components

## Architecture Overview

### Core Architecture Pattern
This is a React Native Expo application using **file-based routing** with Expo Router. The app follows a **modular component architecture** with clear separation of concerns:

- **File-based routing**: Routes are defined by the file structure in the `app/` directory
- **Context-based state management**: Uses React Context for authentication state
- **Service layer pattern**: Business logic separated into service files
- **Component composition**: Reusable UI components with consistent theming
- **Firebase backend**: Authentication and Firestore for data persistence

### Directory Structure & Routing

The app uses Expo Router's file-based routing system:

```
app/
├── (auth)/          # Authentication flow (login, register, welcome)
├── (tabs)/          # Main app tabs (home, statistics, wallet, profile)
├── (modals)/        # Modal screens (profile, wallet, transaction modals)
├── services/        # Business logic services (user, wallet, transaction)
├── hooks/           # Custom React hooks
├── _layout.tsx      # Root layout with AuthProvider wrapper
└── index.tsx        # Splash screen with navigation logic
```

**Key routing patterns:**
- `(auth)` group for authentication screens
- `(tabs)` group for main tabbed navigation  
- `(modals)` group for modal presentations
- Screen options configured in `_layout.tsx` files

### State Management Architecture

**Authentication Context (`contexts/authContext.tsx`)**:
- Manages user authentication state globally
- Handles login/register/logout operations
- Provides user data across the app
- Integrates with Firebase Auth and automatic navigation

**Local Component State**:
- Individual screens manage their own data fetching
- Services handle API calls and business logic
- No additional state management library used

### Firebase Integration

**Configuration** (`config/firebase.ts`):
- Firebase app initialization with React Native persistence
- Auth instance with AsyncStorage persistence
- Firestore database connection

**Data Collections**:
- `users` - User profile data
- `wallets` - User wallet information
- `transactions` - Income/expense transactions

**Authentication Flow**:
1. `onAuthStateChanged` listener in AuthContext
2. Automatic navigation based on auth state
3. User data fetched from Firestore on login

### Component Architecture

**Reusable Components** (`components/`):
- `ScreenWrapper` - Consistent screen layout and padding
- `Header` - Standardized screen headers with navigation
- `Button` - Custom buttons with loading states
- `Input` - Styled text inputs with validation
- `TransactionList` - Optimized list using FlashList
- `CustomTabs` - Custom tab bar implementation

**Styling System**:
- Centralized theme in `constants/theme.ts`
- Responsive scaling utilities in `utils/styling.ts`
- Consistent color palette and spacing scales

### Data Flow Pattern

1. **Services Layer**: Handle API calls and data transformation
   - `userService.ts` - User profile operations
   - `walletService.ts` - Wallet CRUD operations
   - `transactionService.tsx` - Transaction management

2. **Custom Hooks**: Reusable data fetching logic
   - `useFetchData.ts` - Generic data fetching with loading states

3. **Component Layer**: UI components receive data via props
   - Minimal direct Firebase calls in components
   - Business logic delegated to services

### Type Safety

**Comprehensive TypeScript** (`types.ts`):
- All major data structures typed (User, Transaction, Wallet, etc.)
- Component prop interfaces
- Service response types
- Context type definitions

**Path Aliases**:
- `@/*` for root-level imports configured in `tsconfig.json`
- Cleaner import statements across the codebase

## Development Patterns

### Screen Creation Pattern
1. Create screen file in appropriate `app/` subdirectory
2. Use `ScreenWrapper` for consistent layout
3. Import and use theme constants for styling
4. Implement TypeScript interfaces for all props

### Modal Implementation
- Modal screens placed in `app/(modals)/`
- Configure presentation: "modal" in parent `_layout.tsx`
- Use `ModalWrapper` component for consistent modal styling

### Data Fetching Pattern
- Use service functions for Firebase operations
- Implement loading states and error handling
- Cache user data in AuthContext for global access

### Navigation Pattern
- Use `useRouter()` hook from expo-router
- Programmatic navigation with `router.push()`, `router.replace()`
- Type-safe routing with experimental `typedRoutes: true`

## Firebase Configuration Notes

- Firebase config includes React Native specific imports
- Uses AsyncStorage for auth persistence
- Firestore security rules should be configured in Firebase console
- API keys are exposed in client code (normal for Firebase web SDK)

## Performance Considerations

- Uses `@shopify/flash-list` for optimized list rendering
- Image optimization with `expo-image`
- Lazy loading patterns in tab navigation
- Minimal re-renders through proper Context usage