# CoinCubs Classroom Economy App

## Overview
CoinCubs is a classroom economy application designed for students aged 7-12 that promotes collaboration and community achievement through a shared reward system called "CubCoins". The application is designed for teachers and parents, with no direct student access.

## User Types and Access
- **Teachers**: Full access to all features including quick awards, class display, lessons, and administrative settings
- **Parents**: Access to Parent Portal with Learning, Payments, Forms, and Profile tabs to view their child's progress and manage family account
- **Students**: No direct application access - participate through teacher-mediated classroom activities

## Login System
- Welcome page displays "Welcome to CoinCubs" with two login options:
  - [I'm a Teacher] - Access to full teacher functionality
  - [I'm a Parent] - Access to Parent Portal
- No student login or authentication required

## Responsive Design System
The application follows a comprehensive responsive design system with specific breakpoints and layout rules:

### Breakpoints and Layout Rules
- **Desktop (>1024px)**: 24px padding, visible sidebar, 36px buttons, 14px body font
- **Tablet (768–1024px)**: 16px padding, collapsible sidebar, 40px buttons, 14px font
- **Mobile (<768px)**: 12px padding, hamburger menu, stacked layout, 44px buttons, 16px font

### Touch Target Requirements
- Minimum 44x44px touch targets for all interactive elements on mobile
- Full-width buttons and dropdowns on mobile devices
- Grid layouts for button groups with appropriate spacing
- Large, easily tappable controls optimized for touch interaction

### Typography and Spacing
- Responsive font sizes using vw units for large numbers and headings
- Scalable progress bars and interface elements
- Vertical stacking of elements on small screens
- Consistent padding and margin scaling across breakpoints

## Navigation Structure

### Teacher Navigation
The teacher application features a responsive top-level navigation bar with the following sections:
- **⚡ Quick Award**: Fast, mobile-friendly award interface with mobile-first design
- **📺 Class Display**: Projector-optimized community fund display with responsive scaling
- **📚 Lessons**: Curriculum overview and lesson management with responsive layout
- **⚙️ Settings**: Administrative functions with compact, responsive design
- **User Info**: Display logged-in teacher's name and role with [Logout] button

### Parent Portal Navigation
The Parent Portal features a responsive top-level navigation bar with four main tabs:
- **📚 Learning**: Current week's class topic, key concepts, child's contributions and achievements
- **💳 Payments**: Upcoming expenses, payment history, and Concordium wallet integration
- **📋 Forms**: Permission slips, forms with status indicators and digital signatures
- **👤 Profile**: Parent info, children management, payment methods, notification preferences
- **User Info**: Display logged-in parent's name with [Logout] button

## Teacher Features

### ⚡ Quick Award Page
Mobile-first interface optimized for real-time classroom use with full responsive design:
- **Mobile-First Quick Award Interface**: 
  - **Student Selection**: Full-width dropdown with type-to-search functionality, plus the last 5 awarded students displayed as full-width quick-select buttons (44x44px minimum) at the top for instant access
  - **🏆 AWARD WHOLE CLASS Button**: Full-width prominent button (44px height on mobile) that awards CubCoins only to the class fund with no personal split
  - **Amount Selection**: Grid of 5 preset amount buttons ([5], [10], [15], [20], [25] CubCoins) with 44x44px minimum touch targets, plus full-width custom amount input field, all optimized for touch interaction
  - **Reason Selection**: Full-width dropdown with preset reasons: "Helped classmate", "Great work", "Perfect homework", "Good behavior", "Class participation"
  - **Preview Area**: Large, full-width preview showing split calculation - displays "+7 CubCoins to class fund, +3 CubCoins to [Student Name]" or "+[amount] CubCoins to class fund" for whole class awards
  - **[AWARD] Button**: Full-width, prominent button (44px height minimum) that submits on Enter key press, automatically clears student selection after award
  - **Post-Award Feedback**: Large confirmation message ("✅ Emma awarded!" or "✅ Whole class awarded!") with optional sound notification
  - **[UNDO LAST AWARD] Button**: Full-width button appearing for 10 seconds after each award
  - **Responsive Layout**: Stacked vertical layout on mobile, grid layout on tablet/desktop
  - **Touch-Optimized Design**: All controls feature large, touch-friendly targets with appropriate spacing
- **"This Week at a Glance" Stats Card**: Compact, always-visible stats card positioned directly below the Quick Award interface displaying:
  - Current Class Fund balance in CubCoins
  - Number of students who contributed this week (e.g., "23/28 students contributed")
  - Total CubCoins earned this week
  - Clearly styled with responsive design for maximum visibility on all devices
- **Responsive Design**: Mobile-first approach with stacked layout, full-width elements, and scalable typography

### 📺 Class Display Page
Full-screen projector-optimized interface with responsive scaling and no navigation elements:
- **Responsive Full-Screen Layout**: 
  - Remove all navigation and fill the entire screen with responsive background gradient
  - Responsive font sizes using vw units for optimal readability at any screen size
  - Vertical stacking of elements on smaller screens while maintaining hierarchy
- **Responsive Hero Section (Top 60%)**: 
  - **"🏆 OUR CLASS FUND 🏆" heading**: Responsive heading (4-6vw font size) scaling with screen size
  - **Main CubCoins Balance**: Responsive display (8-12vw font size) with scalable coin icons
  - **Goal Information**: Responsive progress bar that scales with screen width
  - **Progress Details**: Scalable percentage display and responsive messaging
  - **High-Contrast Responsive Design**: Maintains readability across all screen sizes
- **Responsive Activity Ticker (Bottom 40%)**: 
  - **Scalable Activity Display**: Responsive text sizing (2-3vw font size) for optimal readability
  - **Responsive Scrolling**: Adapts to screen width while maintaining smooth transitions
  - **Mobile-Optimized Ticker**: Vertical stacking and larger text on small screens
- **Responsive Animations**: 
  - **Scalable Celebrations**: Confetti and effects that scale appropriately to screen size
  - **Responsive Transitions**: Smooth animations that work across all device sizes
- **Responsive Vote Results**: Celebration animations and ticker updates that scale appropriately
- **Lesson Mode Display**: When lesson is activated, Class Display shows child-friendly lesson content with:
  - Large, readable text and icons optimized for student viewing
  - Visual elements using child-friendly colors and fonts
  - Interactive discussion prompts and activities
  - Math examples and scenarios displayed in engaging, accessible format
  - Celebration animations when lesson milestones are reached

### 📚 Lessons Page
Responsive curriculum management interface with mobile-first design and complete financial literacy lesson plans:
- **Responsive Page Header**: Scalable curriculum title and current week highlight that adapts to screen size
- **Responsive Four-Lesson Grid Layout**: 
  - **Desktop (>1024px)**: 2x2 grid layout with appropriate spacing between cards
  - **Tablet (768-1024px)**: 2x2 grid with responsive card sizing
  - **Mobile (<768px)**: Single column stacked layout with full-width cards
- **Enhanced Lesson Cards**: Four comprehensive lesson cards displaying:
  - **Lesson 1**: "Community Inflation (Weeks 1-2)" - Understanding how shared resources grow and change value over time
  - **Lesson 2**: "Democratic Decision Making (Weeks 3-4)" - Learning to make collective choices through voting and discussion
  - **Lesson 3**: "Savings & Delayed Gratification (Weeks 5-6)" - Building patience and planning for future goals
  - **Lesson 4**: "Cross-Classroom Collaboration (Weeks 7-8)" - Working with other classes to achieve bigger community goals
- **Responsive Lesson Card Structure**: Each card displays:
  - **Week Range**: Clear indication (e.g., "Weeks 1-2") with responsive typography
  - **Lesson Title**: Prominent, scalable lesson name
  - **Time Commitment**: "20 min/week (10 min Monday + 10 min Friday)" with responsive text sizing
  - **Learning Objectives**: 3-4 bullet points showing key learning goals with responsive formatting
  - **Expandable Section**: Collapsible area revealing full lesson details, teacher scripts, and activities
  - **Action Buttons**: Two prominent buttons per card:
    - **[START MONDAY LESSON]**: Triggers Class Display to show Monday lesson content (44px minimum height on mobile)
    - **[START FRIDAY LESSON]**: Triggers Class Display to show Friday lesson content (44px minimum height on mobile)
- **Lesson 1 Complete Content**: "Community Inflation (Weeks 1-2)"
  - **Learning Objectives**:
    - Understand how community funds work
    - Learn about inflation at the collective level
    - Practice community budgeting decisions
    - Understand scarcity of resources
  - **Monday Lesson (Expandable Section)**:
    - **Title**: "What Happens When We All Get More Money?"
    - **Teacher Script**: "The school is celebrating Community Week! Every classroom gets a bonus 500 CubCoins!"
    - **Class Display Content**:
      - Current class fund: 1,200 CubCoins
      - Add bonus: Fund jumps to 1,700 CubCoins
      - Current goal: Pizza party (1,500 CubCoins)
    - **Discussion Questions**:
      - How does it feel to suddenly have more money?
      - If every class got this bonus, what might happen?
      - Should we spend it all or save some?
  - **Friday Lesson (Expandable Section)**:
    - **Title**: "Why Did Prices Change?"
    - **Teacher Script**: "The pizza shop noticed EVERY class wanted pizza. They can only make so many pizzas, so they adjusted prices."
    - **Class Display Content**:
      - Pizza party: 1,500 → 2,000 CubCoins (+500)
      - Field trip: 2,500 → 3,200 CubCoins (+700)
      - Extra recess: 800 → 1,000 CubCoins (+200)
      - **Math Comparison**:
        - BEFORE: Fund: 1,200 | Pizza: 1,500 | Progress: 80%
        - AFTER: Fund: 1,700 | Pizza: 2,000 | Progress: 85%
      - **Key Learning**: When everyone has more money, prices adjust because resources are limited. This is community inflation.
- **Lesson 2 Complete Content**: "Democratic Decision Making (Weeks 3-4)"
  - **Learning Objectives**:
    - Understand how democratic voting works
    - Practice making collective decisions
    - Learn about equal participation and fairness
    - Experience the power of group choice
  - **Monday Lesson (Expandable Section)**:
    - **Title**: "Our Class Gets to Decide Together"
    - **Teacher Script**: "Our class fund has grown to 2,000 CubCoins! Now we get to vote on how to spend it. Everyone gets one equal vote, and the majority decides for our whole class."
    - **Class Display Content**:
      - **Current Class Fund**: 2,000 CubCoins
      - **Voting Options**:
        - 🍕 Pizza Party (1,800 CubCoins)
        - 🎮 Extra Recess Week (1,500 CubCoins)  
        - 📚 New Books for Class Library (1,600 CubCoins)
      - **Voting Rules**: "One person = One vote. Majority wins!"
    - **Discussion Questions**:
      - Why is it important that everyone gets one vote?
      - How do we make sure everyone's voice is heard?
      - What happens if the vote is very close?
      - How is this different from one person deciding for everyone?
  - **Friday Lesson (Expandable Section)**:
    - **Title**: "Time to Vote!"
    - **Teacher Script**: "Today we'll vote by raising hands for each option. I'll count the votes and enter them so everyone can see the results live."
    - **Class Display Content**:
      - **Live Vote Counting Interface**:
        - 🍕 Pizza Party: [Live count display]
        - 🎮 Extra Recess Week: [Live count display]
        - 📚 New Books: [Live count display]
      - **Winner Announcement**: Highlight winning option with celebration
      - **Blockchain Record**: "🔒 Vote recorded on blockchain (immutable)"
    - **Teacher Workflow**: Manual vote count entry through responsive input fields for each option
    - **Post-Vote Discussion Questions**:
      - How does it feel to see your vote counted?
      - Are you happy with the result even if your choice didn't win?
      - What did we learn about making decisions together?
      - Why is it important that votes are recorded permanently?
    - **Key Learning**: Democratic decision-making means everyone has an equal voice, majority rules, and decisions are recorded permanently for transparency.
- **Lesson 3 Complete Content**: "Savings & Delayed Gratification (Weeks 5-6)"
  - **Learning Objectives**:
    - Understand the concept of delayed gratification
    - Learn how saving as a community benefits everyone
    - Practice making difficult choices between immediate and future rewards
    - Experience supporting each other through waiting periods
  - **Monday Lesson (Expandable Section)**:
    - **Title**: "One Marshmallow Now or Two Later?"
    - **Teacher Script**: "Our class has earned 800 CubCoins and we expect about 400 more this week, giving us 1,200 total. We have two choices: spend now on a pizza party or save and wait for something bigger and better."
    - **Class Display Content**:
      - **Current Situation**: 800 CubCoins + ~400 more = 1,200 total
      - **Option A - Spend Now**:
        - 🍕 Pizza Party (1,200 CubCoins)
        - Fund goes to 0
        - Start saving over again
      - **Option B - Save & Wait**:
        - No reward this week
        - Keep saving our CubCoins
        - 🚌 Field Trip in 4 weeks (2,500 CubCoins)
        - More fun, longer lasting experience
    - **Discussion Questions**:
      - Which is harder—getting a reward now or waiting for something better?
      - What do we give up if we choose the pizza party?
      - What do we give up if we wait for the field trip?
      - How can we support each other if we decide to wait?
  - **Friday Lesson (Expandable Section)**:
    - **Title**: "Should We Save or Spend?"
    - **Teacher Script**: "Today we'll vote by raising hands. Should we spend our CubCoins now on a pizza party, or save them for the field trip in 4 weeks?"
    - **Class Display Content**:
      - **Voting Options**:
        - 🍕 Spend Now: Pizza Party (1,200 CubCoins)
        - 💰 Save & Wait: Field Trip (2,500 CubCoins, 4 weeks)
      - **If Class Votes SAVE**:
        - Show countdown to field trip (4 weeks remaining)
        - Track weekly progress toward 2,500 CubCoins goal
        - Celebrate when goal is reached with field trip
      - **If Class Votes SPEND**:
        - Have pizza party celebration
        - Reflect on the choice with discussion prompts:
          - "Was the pizza party worth it?"
          - "What did we give up by not waiting?"
          - "How do we feel about starting over?"
    - **Teacher Workflow**: Manual vote count entry through responsive input fields for both options
    - **Key Learning**: Delayed gratification means waiting for something better. When we save as a community, we support each other and all benefit from the bigger reward.
- **Lesson 4 Complete Content**: "Cross-Classroom Collaboration (Weeks 7-8)"
  - **Learning Objectives**:
    - Understand how working together with other classes can achieve bigger goals
    - Learn about cooperation versus competition
    - Practice making decisions that affect multiple groups
    - Experience the power of community collaboration
  - **Monday Lesson (Expandable Section)**:
    - **Title**: "What If We Worked Together?"
    - **Teacher Script**: "Our class has 2,800 CubCoins and Mrs. Smith's class has 2,200 CubCoins. We both want the same big reward - a school-wide carnival that costs 5,000 CubCoins. Should we compete against each other or work together?"
    - **Class Display Content**:
      - **Math Comparison**:
        - **Our Class**: 2,800 CubCoins
        - **Mrs. Smith's Class**: 2,200 CubCoins
        - **Separate Progress**: Our class 56% to goal, Their class 44% to goal
        - **Together**: 5,000 CubCoins = 100% to goal!
      - **Combined Progress After 3 Weeks**:
        - **If Separate**: Our class ~3,600 (72%), Their class ~3,000 (60%)
        - **If Together**: Combined ~6,600 CubCoins = Carnival + Extra Activities!
    - **Discussion Questions**:
      - Can we reach 5,000 CubCoins alone before the deadline?
      - Should we compete against Mrs. Smith's class or cooperate with them?
      - Is it fair if one class earns more CubCoins than the other?
      - What could we achieve together that we can't achieve alone?
  - **Friday Lesson (Expandable Section)**:
    - **Title**: "Should We Collaborate?"
    - **Teacher Script**: "Today we'll vote on whether to combine our class fund with Mrs. Smith's class to work toward the school carnival together, or continue working separately toward our own goals."
    - **Class Display Content**:
      - **Voting Prompt**: "Should we collaborate with Mrs. Smith's class?"
      - **YES Outcome**: 
        - Arrange joint meeting with Mrs. Smith's class
        - Combine funds: 2,800 + 2,200 = 5,000 CubCoins
        - Immediate carnival celebration
        - Plan joint activities and shared rewards
      - **NO Outcome**:
        - Continue working separately
        - Discuss alternative goals we can reach alone
        - Keep our class identity and individual achievements
        - Explore other collaboration opportunities
    - **Teacher Workflow**: Manual vote count entry through responsive input fields for YES/NO options
    - **Key Learning**: Collaboration allows us to achieve bigger goals together, but we must decide when cooperation serves everyone's interests.
  - **Week 8 Content**:
    - **Combined Progress Tracker**:
      - **Our Class**: [Current amount] CubCoins
      - **Their Class**: [Current amount] CubCoins  
      - **Combined**: [Total amount] CubCoins
      - **Percent to Goal**: [Combined percentage]%
      - **Amount Needed**: [Remaining amount] CubCoins
    - **Celebration**: When combined goal is reached, both classes celebrate together
- **Responsive Expandable Sections**: Each lesson card contains expandable content:
  - **Detailed Lesson Plans**: Complete teacher scripts and activity guides
  - **Discussion Questions**: Age-appropriate prompts for classroom engagement
  - **Learning Activities**: Hands-on exercises and group work instructions
  - **Assessment Ideas**: Suggestions for checking student understanding
  - **Home Extension**: Optional activities for family engagement
- **Mobile-Optimized Lesson Interface**: 
  - **Touch-Friendly Expansion**: Large, easily tappable expand/collapse controls
  - **Responsive Content**: Lesson details adapt to screen size with appropriate text scaling
  - **Mobile Navigation**: Swipe gestures and touch-optimized controls throughout
- **Lesson Activation Integration**: 
  - **Direct Class Display Trigger**: [START LESSON] buttons immediately switch Class Display to Lesson Mode
  - **Child-Friendly Content Display**: Activated lessons show on Class Display with large text, icons, and visual elements
  - **Responsive Lesson Content**: Lesson materials scale appropriately for classroom projection
- **Responsive Design Features**: 
  - **Scalable Card Layout**: Cards resize appropriately across all device types
  - **Touch-Optimized Controls**: All buttons meet 44px minimum touch target requirements
  - **Responsive Typography**: Text scales appropriately while maintaining readability
  - **Mobile-First Approach**: Stacked layout on mobile with progressive enhancement for larger screens
- **Visual Design Elements**: 
  - **Engaging Card Design**: Visually appealing cards with appropriate spacing and shadows
  - **Accessible Color Scheme**: High contrast colors suitable for all users
  - **Consistent Iconography**: Clear, recognizable icons for each lesson theme
  - **Progress Indicators**: Visual indicators showing lesson completion status

### ⚙️ Settings Page
Compact, responsive administrative interface with mobile-first sidebar design:
- **Responsive Sidebar Navigation**: 
  - **Desktop (>1024px)**: 200px width sidebar with 8px padding, 14px text, 16px icons
  - **Tablet (768-1024px)**: Collapsible sidebar with toggle button
  - **Mobile (<768px)**: Hamburger menu with full-screen overlay navigation
  - **Visual States**: Selected/hover states optimized for each device type
- **Responsive Main Content Area**: 
  - **Desktop**: Max width 1200px with 24px padding
  - **Tablet**: 16px padding with responsive grid layouts
  - **Mobile**: 12px padding with stacked, full-width elements
  - **Compact Elements**: Responsive button heights (36px desktop, 40px tablet, 44px mobile)
- **Mobile-Optimized Sections**: 
  - **Students Section**: Responsive student list with touch-friendly edit controls
  - **Class Fund Section**: Mobile-first transaction display with swipe actions
  - **Goals & Rewards**: Touch-optimized goal creation and reward management
  - **Voting Section**: Mobile-friendly vote counting interface with large input fields
  - **System Section**: Mobile-optimized settings with touch-friendly controls
- **Responsive Modals**: All modals adapt to screen size with appropriate touch targets and spacing

## Parent Portal Features

### Responsive Parent Portal Design
All Parent Portal tabs follow responsive design principles with mobile-first approach:

### 📚 Learning Tab
Responsive parent-focused view with mobile-optimized layout:
- **Mobile-First Layout**: Stacked cards on mobile, grid layout on larger screens
- **Responsive Content Cards**: Child contributions and class achievements scale appropriately
- **Touch-Friendly Navigation**: Large, easily tappable elements throughout
- **Scalable Progress Indicators**: Visual progress elements that adapt to screen size

### 💳 Payments Tab
Mobile-optimized payment management interface:
- **Responsive Payment Lists**: Full-width on mobile, card layout on larger screens
- **Touch-Optimized Buttons**: 44px minimum height [PAY NOW] buttons
- **Mobile-Friendly Forms**: Full-width form elements with appropriate spacing
- **Responsive Transaction History**: Scalable table/list view based on screen size

### 📋 Forms Tab
Mobile-first digital form management:
- **Responsive Form Lists**: Stacked layout on mobile, grid on larger screens
- **Touch-Optimized Signatures**: Large signature areas optimized for touch input
- **Mobile-Friendly Status**: Clear, scalable status indicators
- **Responsive Form Viewer**: Full-screen form viewing on mobile devices

### 👤 Profile Tab
Mobile-optimized account management:
- **Responsive Profile Layout**: Stacked sections on mobile, sidebar layout on desktop
- **Touch-Friendly Controls**: Large buttons and form elements throughout
- **Mobile-Optimized Forms**: Full-width inputs with appropriate keyboard types
- **Responsive Child Management**: Scalable child selection and management interface

### Reward System
- Students earn CubCoins for positive actions through teacher awards
- Default split: 70% to shared class fund, 30% to personal savings
- Teacher can customize the split for each reward in Settings
- When "Whole Class" is selected, 100% goes to class fund with no personal split
- Dynamic learning explanations appear when the class fund grows
- Parents can view their child's contributions and class achievements in the Learning tab

### Enhanced Voting Interface
- All voting is teacher-facilitated and manual - no student device access
- Teacher creates proposals and facilitates in-person voting where students raise hands
- Teacher manually enters vote counts for each option through responsive input fields
- Vote validation ensures totals are reasonable before finalization
- Integration with Class Display for real-time celebration of voting outcomes
- Teacher manages all voting through responsive Settings page interface

### Responsive Design Principles
- Mobile-first approach with progressive enhancement for larger screens
- Touch-optimized interface with 44px minimum touch targets on mobile
- Responsive typography using scalable units (rem, em, vw) where appropriate
- Flexible grid layouts that adapt to screen size and orientation
- Consistent spacing and padding that scales appropriately across breakpoints
- Warm, friendly, collaborative visual design using rich purple (#7C3AED), blue (#3B82F6), gold (#F59E0B), and other specified colors
- Large, friendly sans-serif headers with highly readable body text that scales appropriately
- Smooth animations and transitions that work across all device types
- Integration of provided asset images with responsive scaling
- No leaderboards or competitive elements
- All language and visuals reinforce community and collective achievement
- Age-appropriate interface for 7-12 year olds that feels educational and community-focused
- Device-optimized interfaces for each page type with responsive considerations
- Parent Portal uses professional, warm design suitable for adult users across all devices
- Clear "Coming Soon" labels and skeleton placeholders for incomplete features
- App content language: English

## Data Storage
The backend must store:
- Student accounts and personal CubCoins balances with blockchain preparation fields (student_id as unique Nat, wallet_address as Text empty by default, concordium_identity as Text empty by default)
- Class fund totals and transaction history with blockchain preparation fields (blockchain_hash as Text empty by default, last_synced as Time null by default, is_verified as Bool false by default)
- Class goals and progress tracking
- Weekly contribution records per student for stats card display
- Active voting proposals with detailed purposes, discussion threads, and manual vote counting fields, including blockchain preparation fields (vote_id as unique Nat, blockchain_record as Text empty by default, is_finalized as Bool, finalized_timestamp as Time null by default)
- Manual vote results with individual option vote counts entered by teacher
- Teacher accounts and class associations
- Transaction history for CubCoins awards with full audit trails and blockchain preparation fields (transaction_id as unique Nat, blockchain_tx_hash as Text empty by default, is_on_chain as Bool false by default)
- Class achievements and badges with unlock criteria
- Anonymous support examples for peer help tracking
- Learning content and financial literacy lessons
- Class history timeline events and milestones
- Student private notes and status (active/inactive)
- Rewards catalog with pricing and availability
- Bulk operation logs and semester reset history
- Vote results and decision records with manual vote counts
- Administrative action logs for accountability
- Current display mode state (Default View vs Lesson Mode)
- Active lesson content and voting options with costs
- **Updated financial literacy curriculum data**: Four-lesson program structure with detailed lesson plans for:
  - **Lesson 1**: "Community Inflation (Weeks 1-2)" - Complete lesson plans, teacher scripts, activities, and discussion prompts about shared resource growth and value changes
  - **Lesson 2**: "Democratic Decision Making (Weeks 3-4)" - Full curriculum for collective choice-making, voting processes, and group discussion facilitation
  - **Lesson 3**: "Savings & Delayed Gratification (Weeks 5-6)" - Comprehensive materials for teaching patience, planning, and future goal setting
  - **Lesson 4**: "Cross-Classroom Collaboration (Weeks 7-8)" - Complete lesson plans for inter-class cooperation and larger community goal achievement
- **Complete Lesson 1 content storage**:
  - **Learning objectives**: Community funds understanding, collective inflation concepts, community budgeting decisions, resource scarcity awareness
  - **Monday lesson data**: "What Happens When We All Get More Money?" teacher script, Class Display content showing fund progression (1,200 → 1,700 CubCoins), discussion questions about sudden money increases
  - **Friday lesson data**: "Why Did Prices Change?" teacher script, Class Display content showing price adjustments (Pizza: 1,500 → 2,000, Field trip: 2,500 → 3,200, Extra recess: 800 → 1,000), math comparison displays, key learning about community inflation
  - **Child-friendly display content**: Large text, visual elements, and engaging format for Class Display presentation of Lesson 1 content
- **Complete Lesson 2 content storage**:
  - **Learning objectives**: Democratic voting understanding, collective decision-making practice, equal participation and fairness concepts, group choice experience
  - **Monday lesson data**: "Our Class Gets to Decide Together" teacher script, Class Display content showing 2,000 CubCoins fund and three voting options (Pizza Party 1,800, Extra Recess Week 1,500, New Books 1,600), discussion questions about equal voting and voice
  - **Friday lesson data**: "Time to Vote!" teacher script, Class Display live vote counting interface for three options, winner announcement with celebration, blockchain record display, post-vote discussion questions, key learning about democratic decision-making
  - **Child-friendly display content**: Large text, visual voting interface, live count displays, and celebration elements for Class Display presentation of Lesson 2 content
  - **Manual voting workflow data**: Teacher input fields for vote counts, validation logic, finalization process, and blockchain record display
- **Complete Lesson 3 content storage**:
  - **Learning objectives**: Delayed gratification understanding, community saving benefits, difficult choice-making practice, mutual support during waiting periods
  - **Monday lesson data**: "One Marshmallow Now or Two Later?" teacher script, Class Display content showing current situation (800 + ~400 = 1,200 CubCoins), Option A (Spend Now: Pizza Party, fund to 0, start over), Option B (Save & Wait: no reward this week, field trip in 4 weeks, more fun), discussion questions about immediate vs future rewards
  - **Friday lesson data**: "Should We Save or Spend?" teacher script, Class Display voting interface for spend now vs save options, conditional outcomes (if SAVE: countdown to field trip, progress tracking, celebration when goal reached; if SPEND: pizza party, reflection prompts about choice consequences), key learning about delayed gratification and community support
  - **Child-friendly display content**: Large text, visual comparison of options, countdown displays, progress tracking, and celebration elements for Class Display presentation of Lesson 3 content
  - **Manual voting workflow data**: Teacher input fields for spend vs save vote counts, conditional outcome displays, progress tracking for saving choice, reflection prompts for spending choice
- **Complete Lesson 4 content storage**:
  - **Learning objectives**: Cross-classroom collaboration understanding, cooperation versus competition concepts, multi-group decision-making practice, community collaboration experience
  - **Monday lesson data**: "What If We Worked Together?" teacher script, Class Display content showing math comparison (Our Class: 2,800 CubCoins, Mrs. Smith's Class: 2,200 CubCoins, Separate Progress: 56% and 44%, Together: 100%), combined progress after 3 weeks (If Separate: ~3,600 and ~3,000, If Together: ~6,600 CubCoins), discussion questions about reaching goals alone, competing vs cooperating, fairness, and collaborative achievements
  - **Friday lesson data**: "Should We Collaborate?" teacher script, Class Display voting interface for YES/NO collaboration, YES outcome (joint meeting, combine funds 5,000 CubCoins, immediate carnival, joint activities), NO outcome (continue separately, alternative goals, individual achievements, other opportunities), key learning about collaboration for bigger goals
  - **Week 8 data**: Combined progress tracker showing Our Class amount, Their Class amount, Combined total, Percent to Goal, Amount Needed, celebration when combined goal reached
  - **Child-friendly display content**: Large text, visual math comparisons, progress tracking displays, collaboration interface, and celebration elements for Class Display presentation of Lesson 4 content
  - **Manual voting workflow data**: Teacher input fields for YES/NO collaboration vote counts, conditional outcome displays, combined progress tracking, joint celebration triggers
- **Enhanced lesson completion tracking**: Individual lesson completion status, current week progression, and curriculum restart history for all four updated lessons
- **Detailed lesson content storage**: Complete Monday opening lessons (10-minute teacher scripts, activities, discussion questions) and Friday wrap-up sessions (10-minute reflection activities, celebrations, week summaries) for each of the four lessons
- **Lesson activation state**: Track which specific lessons are currently active on Class Display and lesson mode status
- **Child-friendly lesson display content**: Formatted lesson content optimized for Class Display with large text, icons, and visual elements for all four lesson topics
- **Lesson progress indicators**: Visual progress tracking for each of the four updated lessons with completion timestamps
- **Parent communication materials**: Generated parent letters explaining weekly learning objectives and home extension activities for each lesson
- **Printable lesson scripts**: Formatted teacher scripts and materials for offline use and preparation for all four lessons
- **Lesson celebration triggers**: Data for triggering celebration animations when lesson milestones are reached for each lesson
- **Current week tracking**: Active lesson week with ability to advance through curriculum progression across all four lessons
- **Lesson plan export data**: Formatted curriculum content for PDF generation and teacher resource downloads for all lessons
- **Expandable section state**: Track which lesson cards have expanded sections open for user experience continuity
- **Lesson card layout data**: Store responsive grid layout preferences and card display settings
- **Last awarded students**: Track the 5 most recently awarded students for quick-select functionality
- **Undo transaction data**: Temporary storage of the last award transaction for 10-second undo functionality
- **Whole class award transactions**: Track awards made to the entire class fund without personal splits
- **Week navigation state**: Current week selection and skip-ahead functionality tracking
- **Parent accounts**: Parent profile information, contact details, authentication credentials, and account preferences
- **Parent-child associations**: Links between parent accounts and their children in the system
- **Payment information**: Upcoming expenses, payment history, transaction records, and payment method details
- **Form data**: Permission slips, forms with status tracking, digital signature records, and completion timestamps
- **Notification preferences**: Parent notification settings for email, SMS, and push notifications
- **Child selection state**: Track which child a parent is currently viewing in multi-child families
- **Real-time display state**: Current class fund total, goal progress, and activity ticker items for instant Class Display updates
- **Goal creation data**: Store goal names, target amounts, optional descriptions, and creation timestamps
- **Customizable preset amounts**: Store up to five (or more) preset award amounts that teachers can modify
- **Custom preset reasons**: Store teacher-created custom reasons for awards alongside default options
- **Manual voting workflow data**: Store teacher-entered vote counts for each option, validation status, and finalization records
- **Vote count validation logs**: Track vote total validation and any warnings or corrections made by teachers
- **Weekly stats data**: Current week's total CubCoins earned, student contribution counts, and class fund balance for Quick Award stats card

## Key Operations
- Award CubCoins to students with configurable splits through responsive Quick Award page
- Award CubCoins to whole class fund only (no personal split) when "Whole Class" option is selected
- Track and display last 5 awarded students for quick selection with responsive button layout
- Process undo operations for the most recent award within 10-second window
- Generate real-time split previews before awarding CubCoins with responsive preview display
- Trigger post-award confirmations with responsive feedback messages
- **Calculate and display weekly stats**: Generate current week's class fund balance, student contribution count, and total CubCoins earned for "This Week at a Glance" stats card
- **Push real-time updates to responsive Class Display**: Update fund counter, progress bar, activity ticker with responsive scaling
- **Manage responsive activity ticker**: Maintain activity items with responsive text sizing and layout
- **Animate responsive Class Display elements**: Scale animations appropriately for different screen sizes
- **Handle responsive celebrations**: Display celebrations that scale to screen size and device capabilities
- **Activate lesson mode on Class Display**: Switch Class Display to show child-friendly lesson content when [START MONDAY LESSON] or [START FRIDAY LESSON] buttons are pressed for any of the four lessons
- **Display Lesson 1 content for students**: Show "Community Inflation" lesson materials in large, readable format with icons and visual elements optimized for classroom viewing, including:
  - **Monday content**: "What Happens When We All Get More Money?" with fund progression display (1,200 → 1,700 CubCoins) and discussion prompts
  - **Friday content**: "Why Did Prices Change?" with price adjustment displays and math comparisons showing community inflation effects
- **Display Lesson 2 content for students**: Show "Democratic Decision Making" lesson materials in large, readable format with icons and visual elements optimized for classroom viewing, including:
  - **Monday content**: "Our Class Gets to Decide Together" with class fund display (2,000 CubCoins) and three voting options (Pizza Party, Extra Recess Week, New Books) with costs and voting rules
  - **Friday content**: "Time to Vote!" with live vote counting interface, real-time count displays for each option, winner highlighting with celebration, and blockchain record confirmation display
- **Display Lesson 3 content for students**: Show "Savings & Delayed Gratification" lesson materials in large, readable format with icons and visual elements optimized for classroom viewing, including:
  - **Monday content**: "One Marshmallow Now or Two Later?" with current situation display (800 + ~400 = 1,200 CubCoins), visual comparison of Option A (Spend Now: Pizza Party, fund to 0, start over) vs Option B (Save & Wait: no reward this week, field trip in 4 weeks, more fun), and discussion prompts about immediate vs future rewards
  - **Friday content**: "Should We Save or Spend?" with voting interface for spend now vs save options, conditional outcome displays (if SAVE: countdown to field trip, progress tracking, celebration when goal reached; if SPEND: pizza party, reflection prompts about choice consequences), and key learning about delayed gratification
- **Display Lesson 4 content for students**: Show "Cross-Classroom Collaboration" lesson materials in large, readable format with icons and visual elements optimized for classroom viewing, including:
  - **Monday content**: "What If We Worked Together?" with math comparison display (Our Class: 2,800 CubCoins, Mrs. Smith's Class: 2,200 CubCoins, Separate vs Together progress), combined progress projections after 3 weeks, and discussion prompts about individual vs collaborative achievement
  - **Friday content**: "Should We Collaborate?" with voting interface for YES/NO collaboration options, conditional outcomes (YES: joint meeting arrangement, fund combination, immediate carnival; NO: separate goals, alternative paths), and key learning about collaboration benefits
  - **Week 8 content**: Combined progress tracker showing both classes' amounts, combined total, percentage to goal, amount needed, and joint celebration when goal is reached
- **Process manual vote counting for Lesson 2**: Handle teacher-entered vote counts through responsive input fields for Pizza Party, Extra Recess Week, and New Books options
- **Process manual vote counting for Lesson 3**: Handle teacher-entered vote counts through responsive input fields for spend now vs save options, with conditional outcome processing
- **Process manual vote counting for Lesson 4**: Handle teacher-entered vote counts through responsive input fields for YES/NO collaboration options, with conditional outcome processing and combined progress tracking
- **Display live vote results for Lesson 2**: Show real-time vote counts on Class Display as teacher enters hand-raise counts for each voting option
- **Display live vote results for Lesson 3**: Show real-time vote counts on Class Display as teacher enters hand-raise counts for spend vs save options
- **Display live vote results for Lesson 4**: Show real-time vote counts on Class Display as teacher enters hand-raise counts for collaboration YES/NO options
- **Celebrate voting outcomes for Lesson 2**: Trigger celebration animations when vote is finalized and display winning option with blockchain record confirmation
- **Handle conditional outcomes for Lesson 3**: Process different pathways based on voting results (save: show countdown and progress tracking; spend: show pizza party celebration and reflection prompts)
- **Handle conditional outcomes for Lesson 4**: Process different pathways based on voting results (YES: arrange joint meeting, combine funds, show immediate carnival; NO: continue separately, show alternative goals, maintain individual achievements)
- **Display combined progress tracking for Lesson 4**: Show Week 8 progress tracker with both classes' amounts, combined totals, percentage calculations, and remaining amount needed
- **Trigger joint celebrations for Lesson 4**: Display combined class celebrations when collaborative goals are reached, scaled appropriately for Class Display
- **Display updated lesson content for students**: Show lesson materials for Community Inflation, Democratic Decision Making, Savings & Delayed Gratification, and Cross-Classroom Collaboration in large, readable format with icons and visual elements optimized for classroom viewing
- **Track lesson completion for all four lessons**: Mark individual lessons as completed and update curriculum progress indicators across the updated curriculum
- **Generate lesson progress tracking**: Monitor and display completion status across all four updated financial literacy lessons
- **Create printable lesson materials**: Generate teacher-friendly lesson scripts and materials for offline preparation and classroom use for all four lessons
- **Generate parent communication letters**: Create downloadable letters explaining weekly learning objectives and suggesting home extension activities for each lesson
- **Handle lesson navigation**: Allow teachers to advance through curriculum weeks and manage lesson progression across all four lessons
- **Trigger lesson celebration animations**: Display celebrations when lesson milestones are reached for any lesson, scaled appropriately for Class Display
- **Manage lesson activation state**: Track which specific lessons are currently active and synchronize between Lessons page and Class Display
- **Process lesson completion marking**: Handle teacher input for marking lessons as completed with timestamp tracking for all four lessons
- **Export lesson plan materials**: Generate downloadable lesson plans and curriculum materials for teacher resources for all lessons
- **Handle curriculum restart**: Process curriculum restart requests with confirmation dialogs and progress reset across all four lessons
- **Manage responsive lesson card expansion**: Handle expand/collapse functionality for lesson card details with touch-optimized controls
- **Process lesson card grid layout**: Render responsive 2x2 grid on desktop/tablet, single column on mobile with appropriate spacing
- **Handle lesson activation buttons**: Process [START MONDAY LESSON] and [START FRIDAY LESSON] button clicks to trigger Class Display lesson mode
- **Synchronize lesson display content**: Ensure activated lesson content displays properly on Class Display with child-friendly formatting
- **Track lesson card interaction state**: Maintain which cards are expanded and user interaction preferences
- **Generate responsive lesson card layouts**: Adapt card sizing and spacing based on device type and screen size
- Synchronize lesson state between responsive Lessons page and Class Display page
- Toggle between Default View and Lesson Mode with responsive transitions
- Track contributions to class fund vs personal savings
- Create and manage class voting proposals through responsive Settings interface
- **Process manual vote counting**: Handle teacher-entered vote counts through responsive input fields
- **Validate vote totals**: Provide responsive validation feedback and warnings
- **Finalize manual votes**: Process finalization through responsive confirmation dialogs
- **Update responsive Class Display with vote results**: Push results with responsive celebration animations
- Update class goals and progress with responsive real-time updates
- Create and award class-wide achievements and badges
- Track and display anonymized peer support examples
- Deliver dynamic learning explanations based on class fund growth
- Manage class history timeline and milestones
- Provide responsive real-time updates to Class Display based on teacher actions
- Handle bulk administrative operations through responsive interfaces
- Maintain session state across different responsive teacher pages
- Edit and delete transactions with responsive balance recalculation interfaces
- Manage student accounts with responsive editing capabilities
- Create and manage rewards catalog with responsive bulk pricing operations
- Record and manage manual voting results through responsive interfaces
- Perform bulk class operations through responsive control interfaces
- Generate comprehensive audit trails for all administrative actions
- Export class data in multiple formats with responsive download interfaces
- Trigger responsive celebration animations when goals are reached
- Display lesson content with responsive voting options and cost calculations
- **Navigate responsive curriculum**: Allow teachers to view and manage updated curriculum across all device types
- **Track curriculum progress**: Monitor progress through responsive progress indicators for all four lessons
- **Display responsive lesson plans**: Show lesson content optimized for each device type for all lessons
- **Synchronize responsive curriculum state**: Maintain consistency across responsive interfaces for all lesson content
- **Display responsive lesson plan modal**: Show comprehensive content with responsive navigation for detailed lesson viewing
- **Navigate between weeks responsively**: Provide touch-friendly navigation across device types for all lesson weeks
- **Export lesson plans**: Generate downloads through responsive interface for all four lessons
- **Handle responsive week navigation**: Process selections through responsive dropdown interfaces across all lessons
- **Restart curriculum**: Handle restart through responsive confirmation dialogs for the complete four-lesson program
- **Track responsive lesson completion**: Monitor and display completion across device types for all lessons
- **One-click responsive lesson activation**: Direct integration optimized for each device type for all lesson buttons
- **Mobile-responsive lesson interface**: Optimize all lesson controls for touch interaction across all four lessons
- **Visual responsive progress indicators**: Display progress with appropriate scaling for the complete curriculum
- Apply responsive design polish across all interfaces and interactions
- Handle responsive page navigation with smooth transitions optimized for each device type
- Manage teacher authentication through responsive login interfaces
- Remove student access while maintaining responsive design principles
- Process custom amount input through responsive input validation
- Validate award amounts with responsive error messaging
- Display preset reason options through responsive dropdown interfaces
- **Navigate responsive compact Settings sidebar**: Handle navigation optimized for each device type
- **Update responsive main content area**: Display content with appropriate responsive layout
- **Handle responsive mobile Settings navigation**: Provide hamburger menu and touch-friendly navigation
- **Process responsive compact form elements**: Handle all form interactions with appropriate sizing
- **Maintain responsive Settings state**: Remember selections across responsive layout changes
- **Process responsive goal creation modal**: Handle modal interactions optimized for each device
- **Manage responsive preset editing**: Process editing through responsive modal interfaces
- **Handle responsive preset reason management**: Process reason management with touch-friendly controls
- **Validate responsive modal forms**: Ensure validation works across all device types
- **Apply responsive compact styling**: Implement consistent responsive design across all Settings sections
- **Authenticate parent users**: Handle parent login through responsive interfaces
- **Navigate responsive Parent Portal tabs**: Handle navigation optimized for each device type
- **Display responsive child-specific data**: Show data with appropriate responsive layout
- **Manage responsive multiple children**: Allow child switching through responsive interface
- **Process responsive payment actions**: Handle payments through responsive interface controls
- **Manage responsive digital signatures**: Process signatures optimized for touch input
- **Update responsive parent profile**: Handle profile editing through responsive forms
- **Display responsive "Coming Soon" features**: Show placeholders with appropriate responsive sizing
- **Track responsive parent session state**: Maintain state across responsive layout changes
- **Generate responsive parent-friendly content**: Display content optimized for each device type
- **Handle responsive form submissions**: Process forms with responsive validation and feedback
- **Manage responsive notification settings**: Update preferences through responsive interface
- **Display responsive payment history**: Show history with appropriate responsive layout
- **Handle responsive child selection**: Process selection through responsive interface controls
- **Display responsive manual voting workflow guidance**: Show guidance optimized for each device
- **Process responsive vote count validation**: Handle validation with responsive feedback
- **Handle responsive vote finalization**: Process finalization through responsive confirmation dialogs
- **Prevent editing of finalized votes**: Disable controls with responsive visual feedback
- **Track responsive manual vote counting**: Store records with responsive interface tracking
