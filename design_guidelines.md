# CapsuleCheck Design Guidelines

## Authentication Architecture
**Auth Required**: Yes - multi-role system (Patient/Pharmacist)

**Implementation**:
- Use SSO with Apple Sign-In (iOS required) and Google Sign-In
- Role selection screen after initial signup (Patient or Pharmacist)
- Pharmacist role requires license verification with document upload
- Include Privacy Policy and Terms of Service links on login/signup
- Account settings must include:
  - Profile with customizable avatar (medical/healthcare themed)
  - Role-specific settings
  - Log out (with confirmation)
  - Delete account (Settings > Account > Delete with double confirmation)

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs)
- Home (dashboard - role-specific content)
- My Rx (prescription management)
- Pharmacies (search/browse pharmacists, booking)
- Profile (account, settings, help)

**Modal Flows**:
- Onboarding (role selection)
- Prescription upload (camera + document picker)
- AI analysis results
- Pharmacist booking (calendar selection)
- License verification (pharmacist only)

## Screen Specifications

### Onboarding & Role Selection
- **Purpose**: Choose patient or pharmacist role
- **Layout**: 
  - Transparent header, no back button
  - Vertically centered card-based selection
  - Two large option cards with icons
  - Continue button at bottom
- **Safe area**: bottom: insets.bottom + Spacing.xl
- **Components**: Icon cards, primary button

### Home Dashboard (Patient)
- **Purpose**: Overview of active prescriptions, refill reminders, quick actions
- **Layout**:
  - Transparent header with greeting and notification bell
  - ScrollView with safe area: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
  - Card-based sections: Active Prescriptions, Refill Reminders, Quick Actions
  - Floating action button for "Upload Prescription" (bottom right)
- **Components**: Notification bell, prescription cards, reminder badges, FAB
- **FAB Shadow**: shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2

### Home Dashboard (Pharmacist)
- **Purpose**: Manage availability, view bookings, update pricing
- **Layout**:
  - Transparent header with availability toggle switch
  - ScrollView with sections: Today's Appointments, Pending Reviews, Quick Stats
  - Safe area: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**: Toggle switch, appointment cards, stat widgets

### Prescription Upload
- **Purpose**: Capture prescription via camera or select document
- **Layout**:
  - Modal presentation (full screen)
  - Header with Cancel (left) and title
  - Two large action buttons: Camera and Document Picker
  - Preview area if image selected
  - Submit button in header (right) when ready
- **Safe area**: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components**: Camera icon button, document icon button, image preview

### AI Analysis Results
- **Purpose**: Display AI-analyzed prescription data and recommendations
- **Layout**:
  - Modal or stack screen with close/back button
  - Non-transparent header with title "Analysis Results"
  - ScrollView: Detected medications list, Alternative suggestions, Price comparison summary
  - Safe area: top: Spacing.xl, bottom: insets.bottom + Spacing.xl
  - Primary action button at bottom: "View Full Comparison"
- **Components**: Medication cards with badges (generic/brand), price tags, recommendation chips

### My Rx (Prescription List)
- **Purpose**: View and manage all prescriptions
- **Layout**:
  - Transparent header with search bar and filter button (right)
  - FlatList of prescription cards
  - Safe area: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
  - Empty state if no prescriptions
- **Components**: Search bar, filter icon, prescription cards with status badges, refill buttons

### Medication Detail
- **Purpose**: Full medication information, reviews, regional pricing
- **Layout**:
  - Stack screen with back button (left)
  - ScrollView with sections: Basic Info, Description, Reviews & Ratings, Regional Pricing
  - Safe area: top: Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components**: Rating stars, review cards, price comparison table, generic/brand toggle

### Pharmacies Tab
- **Purpose**: Browse pharmacists, view profiles, book consultations
- **Layout**:
  - Transparent header with search bar
  - FlatList of pharmacist cards with avatar, name, rating, specialty
  - Filter chips (Available Now, Top Rated, Nearest)
  - Safe area: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**: Search bar, filter chips, pharmacist cards, availability indicator (green dot)

### Pharmacist Booking
- **Purpose**: Select date, time, and book consultation
- **Layout**:
  - Modal presentation
  - Header with Cancel (left) and "Book Consultation"
  - Calendar date picker
  - Time slot grid (scrollable)
  - Consultation type selection (In-person/Video)
  - Confirm button at bottom
- **Safe area**: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components**: Calendar picker, time slot buttons, radio buttons, primary button

### Profile/Settings
- **Purpose**: Account management, preferences, help
- **Layout**:
  - Transparent header
  - ScrollView with sections: Profile card (avatar, name, role badge), Settings list, Help & Support, Log out
  - Safe area: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**: Avatar (tappable), settings rows with chevron icons, destructive button (log out)

## Design System

### Color Palette
- **Primary**: Teal/Turquoise (#14B8A6, #0D9488 darker shade)
- **Secondary**: Blue (#3B82F6)
- **Background**: White (#FFFFFF), Light Gray (#F9FAFB)
- **Card Background**: White with subtle border or shadow
- **Text Primary**: Dark Gray (#1F2937)
- **Text Secondary**: Medium Gray (#6B7280)
- **Success**: Green (#10B981) - for availability, refills ready
- **Warning**: Amber (#F59E0B) - for refill reminders
- **Error**: Red (#EF4444) - for expired prescriptions
- **Border**: Light Gray (#E5E7EB)

### Typography
- **Heading 1**: 28pt, Bold, Text Primary
- **Heading 2**: 22pt, Semibold, Text Primary
- **Heading 3**: 18pt, Semibold, Text Primary
- **Body**: 16pt, Regular, Text Primary
- **Body Small**: 14pt, Regular, Text Secondary
- **Caption**: 12pt, Regular, Text Secondary
- **Button**: 16pt, Semibold

### Spacing
- **xs**: 4pt
- **sm**: 8pt
- **md**: 12pt
- **lg**: 16pt
- **xl**: 24pt
- **2xl**: 32pt

### Visual Design
- **Card Border Radius**: 12pt
- **Button Border Radius**: 10pt
- **Input Border Radius**: 8pt
- **Card Shadow**: shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3
- **Floating Button Shadow**: shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- **Icons**: Use Feather icons from @expo/vector-icons (pill, file-text, calendar, user, search, filter, bell, camera, upload)
- **Touchable Feedback**: Opacity change (0.7) or subtle scale (0.98)
- **Badge Border Radius**: 16pt (pill shape)

### Critical Assets
1. **Role Selection Icons**: Patient icon (user with medical cross), Pharmacist icon (mortar and pestle or pharmacy symbol)
2. **Empty State Illustrations**: No prescriptions, no bookings, no pharmacists found
3. **User Avatars**: 3-4 medical-themed preset avatars (neutral, professional healthcare aesthetic)
4. **Medication Type Icons**: Pill, capsule, liquid, injection (for medication detail screens)
5. **App Logo**: "CapsuleCheck" wordmark with pill/capsule icon

### Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio 4.5:1 for body text, 3:1 for large text
- All interactive elements must have accessible labels
- Support Dynamic Type for text scaling
- Badge colors must have sufficient contrast with background
- Critical health information (dosage, warnings) must use larger, bolder text