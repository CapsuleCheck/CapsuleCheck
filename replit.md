# CapsuleCheck

## Overview

CapsuleCheck is a React Native mobile application built with Expo that connects patients with affordable prescription medications and independent prescribers. The app features a dual-role system (Patient/Pharmacist) with role-specific dashboards, prescription management, pharmacist search/booking, and AI-powered prescription analysis capabilities.

The application is built using:
- **React Native** (0.81.5) with **Expo** (54.0.23) for cross-platform mobile development
- **React Navigation** for navigation structure with tab and stack navigators
- **React Native Reanimated** for smooth animations
- **TypeScript** for type safety
- **Context API** for state management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Navigation Structure**
- Root navigator manages authentication flow (Onboarding → License Verification → Main App)
- Main app uses bottom tab navigation with 4 tabs: Home, My Rx, Pharmacies, Profile
- Each tab contains its own stack navigator for nested navigation flows
- Modal-style screens for prescription upload, booking, and verification processes

**Component Design Pattern**
- Themed components (ThemedText, ThemedView) that automatically adapt to light/dark mode
- Reusable UI components (Button, Card, PrimaryButton) with consistent styling
- Specialized components for domain-specific features (MedicationCard, PrescriptionCard, PrescriberCard)
- Screen wrapper components (ScreenScrollView, ScreenFlatList, ScreenKeyboardAwareScrollView) that handle safe area insets and keyboard behavior automatically

**State Management**
- Context API used for global user state (UserContext)
- Manages user role (patient/pharmacist), onboarding completion status
- Local component state for UI interactions and form data
- No external state management libraries (Redux, MobX) currently integrated

**Styling System**
- Centralized theme constants for colors, spacing, typography, and border radius
- Light/dark mode support with automatic theme switching via `useColorScheme` hook
- Custom `useTheme` hook provides consistent theme access across components
- Platform-specific styling for iOS, Android, and web where needed

**Animation Strategy**
- React Native Reanimated for performant animations
- Spring-based animations with consistent configuration for button presses and interactions
- Shared values and animated styles for smooth transitions
- Gesture handling via react-native-gesture-handler

**Safe Area Handling**
- Custom `useScreenInsets` hook calculates padding based on header height, tab bar height, and device safe areas
- Screen wrapper components automatically apply appropriate padding
- Platform-specific considerations for notches, status bars, and navigation bars

**Error Handling**
- Error boundary component catches React rendering errors
- Development-friendly error fallback with detailed stack traces
- Production-ready error screen with restart capability
- Graceful error recovery with reset functionality

### Role-Based Architecture

**Patient Role Features**
- Dashboard with active prescriptions and refill reminders
- Prescription upload via camera or document picker
- AI-powered prescription analysis (intended integration)
- Search and browse prescribers
- Book appointments with prescribers
- Compare medication prices across sources with advanced filtering and sorting

**Pharmacist/Prescriber Role Features**
- Dashboard showing upcoming bookings and availability status
- Availability toggle (online/offline status)
- Patient booking management
- License verification process with document upload
- Role requires license verification before full access

**Role Selection Flow**
- Initial onboarding screen presents role choice
- Patients can proceed directly to main app
- Pharmacists must complete license verification step
- UserContext tracks role and onboarding completion

### Navigation Architecture

**Root Level Navigation**
- Conditional rendering based on `hasCompletedOnboarding` flag
- Onboarding stack shown for new users
- Main tab navigator shown for authenticated users
- No back navigation from main app to onboarding

**Stack Navigators**
- HomeStack: Patient/Pharmacist dashboards, prescription upload, price list, price comparison with filtering, booking
- MyRxStack: Prescription management, history, and prescription-specific price comparison
- PharmaciesStack: Prescriber search and appointment booking
- ProfileStack: User settings and account management

**Screen Options Configuration**
- Centralized screen options in `screenOptions.ts`
- Transparent headers with blur effects on iOS
- Platform-specific header backgrounds
- Consistent header styling across all navigators

### Design System

**Theme Colors**
- Primary color: Teal (#14B8A6) for brand identity
- Semantic colors: success (green), warning (yellow), error (red)
- Elevation-based background colors (root, default, secondary, tertiary)
- Separate light and dark mode palettes

**Typography Scale**
- Defined typography hierarchy (h1, h2, h3, h4, body, small, link)
- ThemedText component provides automatic type styling
- Platform-specific font adjustments where needed

**Spacing System**
- Consistent spacing scale (xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24)
- Applied uniformly across all components
- Used in layout, padding, margin, and gap specifications

**Border Radius**
- Consistent corner radius values for cards, buttons, and containers
- Creates cohesive visual language throughout app

### Platform Considerations

**iOS Specific**
- Blur effects for tab bar and headers using expo-blur
- Haptic feedback integration via expo-haptics
- Apple Sign-In support (required for App Store)
- Edge-to-edge safe area handling

**Android Specific**
- Adaptive icons with foreground, background, and monochrome variants
- Edge-to-edge rendering enabled
- Solid color backgrounds instead of blur effects
- Material Design-aligned interactions

**Web Specific**
- Fallback implementations for native-only features
- ScreenScrollView used instead of KeyboardAwareScrollView
- Static rendering support with hydration handling
- Single-page output configuration

### Build and Development

**Path Aliasing**
- `@/` alias maps to project root for cleaner imports
- Configured in babel.config.js and tsconfig.json
- Consistent import paths across all files

**Expo Configuration**
- New architecture enabled for improved performance
- React Compiler experiments enabled
- Splash screen with light/dark variants
- Custom URI scheme: `capsulecheck://`

**Development Environment**
- Replit-specific configuration for dev server and domain handling
- Custom build script for deployment preparation
- ESLint with Prettier for code quality
- TypeScript strict mode enabled

## External Dependencies

### Core Framework
- **Expo SDK 54**: Managed React Native development platform
- **React Navigation 7**: Navigation library with native stack and bottom tabs
- **React Native Reanimated 4**: Animation library for smooth interactions

### UI and Interaction
- **expo-blur**: Blur effects for translucent UI elements (iOS)
- **expo-glass-effect**: Liquid glass visual effects
- **react-native-gesture-handler**: Touch gesture recognition
- **react-native-keyboard-controller**: Keyboard behavior management
- **react-native-safe-area-context**: Safe area inset handling

### Media and Assets
- **expo-image**: Optimized image component
- **expo-symbols**: SF Symbols and Material Icons support
- **@expo/vector-icons**: Icon library (Feather icons used extensively)

### Platform Services
- **expo-web-browser**: In-app browser for OAuth flows and external links
- **expo-haptics**: Haptic feedback for iOS
- **expo-linking**: Deep linking support

### Profile Section (Complete UI/UX)
- **Personal Information**: Edit form for user profile data (name, email, phone, address) with persistence via AppDataContext
- **Notifications**: Toggle switches for notification preferences (refills, appointments, price alerts, promotions, email, push) with state persistence
- **Privacy & Security**: Security settings toggles (biometric auth, 2FA, data sharing) and placeholders for password change/data export (requires backend)
- **Payment Methods**: Card management with add/remove/set default functionality, persisted via AppDataContext
- **Help & Support**: FAQs, contact options, and resource links (external links would require expo-web-browser in production)
- **About CapsuleCheck**: App information, version details, legal links, and social media connections

All editable profile data persists across the app session via AppDataContext reducer pattern.

### Price Comparison System (Complete UI/UX with Filtering & Animations)
- **Compare Prices Screen**: Comprehensive price comparison with advanced filtering, sorting, and responsive animations
  - Accessible from both Home (Price List) and My Rx (Prescription Detail) flows
  - Displays medication name, dosage, and supply information
  - Summary card shows lowest and average prices (dynamically filtered)
  
- **Filter System with Animations**:
  - **Generic/Brand Filter**: Shows only generic or brand-name offers (based on `isGenericOffer` flag)
  - **In Stock Only**: Filters to pharmacies with medication currently in stock
  - **Nearby Only**: Shows pharmacies within 5-mile radius
  - **Patient Rating Filter**: Filter by minimum patient ratings (All Ratings, 4+ Stars, 3+ Stars)
  - Filters work cumulatively and can be combined
  - Clear visual indication of active filters with highlighted chips
  - **Responsive Animations**: Spring-based scale animations on filter chips using react-native-reanimated
  - Empty state with "Clear Filters" button when no results match
  
- **Sorting Options with Animations**:
  - Price: Low to High (default)
  - Price: High to Low
  - Distance (nearest first)
  - Name (alphabetical)
  - **Responsive Animations**: Spring-based scale animations on sort buttons for tactile feedback
  
- **Patient Rating System**:
  - Patient ratings displayed on all pharmacy cards with star icons and numeric value
  - Rating range: 3.5 to 4.8 stars in current data
  - Visual star display with full stars and half-star logic
  - Filter pharmacies by minimum rating threshold (3+, 4+, or all ratings)
  - Ratings integrate seamlessly with other filters (can combine rating + generic + in stock, etc.)
  
- **Dynamic Summary Card**:
  - Shows "Lowest Price" and "Average Price" when no filters active
  - Updates to "Lowest (Filtered)" and "Average (Filtered)" when filters applied
  - Displays empty state message when filters produce zero results
  - Savings calculation based on current filtered or unfiltered prices
  
- **Pharmacy Cards**:
  - Display pharmacy name, price, distance, stock status, and patient rating
  - Patient ratings shown with visual star icons and numeric value (e.g., "4.5")
  - "Lowest Price" badge on cheapest option in current filtered view
  - Selection indicator when pharmacy is chosen
  - Automatic selection clearing when filtered list no longer contains selected pharmacy
  
- **Animation Implementation**:
  - Uses react-native-reanimated for performant animations
  - Spring configuration: damping 15, stiffness 300 for responsive feel
  - Scale animation: 1.0 → 0.95 on press, returns to 1.0 on release
  - Applied to both filter chips and sort buttons for consistent tactile feedback
  
- **Data Model**:
  - `isGenericOffer` boolean field on PriceSource for reliable generic/brand filtering
  - `patientRating` optional number field (1-5 scale) for pharmacy quality ratings
  - Explicit distance values for nearby filtering (5-mile threshold)
  - In-stock status for availability filtering
  
- **Navigation**:
  - Home → Price List → Click medication → Compare Prices (with filters and animations)
  - My Rx → Prescription Detail → Compare Prices (with filters and animations)

### Future Integrations (Indicated by Design)
- **SSO Providers**: Apple Sign-In and Google Sign-In for authentication
- **Document Picker/Camera**: For prescription and license uploads
- **AI Service**: For prescription analysis (service not yet integrated)
- **Payment Processing**: Full Stripe/payment provider integration for production card management
- **Backend API**: Password management, data export, external contact forms, legal document hosting
- **External Links**: expo-web-browser for opening social media, support resources, and legal documents

### Development Tools
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting with Expo and Prettier configurations
- **Prettier**: Code formatting
- **babel-plugin-module-resolver**: Path aliasing support