import { CurriculumModule } from '../types';

export const curriculumModules: CurriculumModule[] = [
  // Week 1: Community Inflation (Part 1)
  {
    weekNumber: 1,
    moduleName: "Community Inflation (Part 1)",
    learningObjectives: [
      "Understand how community funds work",
      "Learn about inflation at the collective level",
      "Practice community budgeting decisions",
      "Understand scarcity of resources"
    ],
    mondayLesson: {
      title: "What Happens When We All Get More Money?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students explore what happens when the entire community receives additional funds, introducing the concept of inflation and its effects on purchasing power.",
      materials: [
        "Class Display showing CubCoin balance",
        "Whiteboard for discussion notes",
        "Optional: Play money for visualization"
      ],
      objectives: [
        "Identify what happens when everyone receives more money",
        "Understand the initial excitement of increased funds",
        "Begin to question how this affects the community"
      ],
      structure: "1. Introduction (5 mins): Announce exciting news - Community Week bonus!\n2. Observation (5 mins): Watch class fund increase on display from 1,200 to 1,700 CC\n3. Discussion (5 mins): How does it feel? What should we do with extra money?\n4. Prediction (5 mins): What might happen if EVERY class gets this bonus?\n5. Wrap-up (5 mins): Set up Friday's lesson - we'll see what happens next!",
      assessment: "Can students articulate the excitement of having more money? Do they begin to question what happens when everyone has more? Can they make predictions about potential consequences?",
      teacherScript: "The school is celebrating Community Week! Every classroom gets a bonus 500 CubCoins! Let's see what happens to our class fund and talk about how this affects everyone.",
      discussionQuestions: [
        "How does it feel to suddenly have more money?",
        "If every class got this bonus, what might happen?",
        "Should we spend it all or save some?"
      ],
      activities: [
        {
          name: "Fund Boost Visualization",
          description: "Watch our class fund jump from 1,200 to 1,700 CubCoins on the Class Display. Current goal: Pizza party (1,500 CubCoins)"
        }
      ]
    },
    fridayLesson: {
      title: "Why Did Prices Change?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students discover how increased money supply affects prices when resources are limited, understanding the concept of community inflation.",
      materials: [
        "Class Display showing updated prices",
        "Before/After comparison chart",
        "Whiteboard for calculations"
      ],
      objectives: [
        "Explain why prices increase when everyone has more money",
        "Calculate the impact of price changes on purchasing power",
        "Understand that money value is relative to supply and demand"
      ],
      structure: "1. Reveal (5 mins): Show that pizza shop raised prices from 1,500 to 2,000 CC\n2. Investigation (10 mins): Why did this happen? Discuss supply and demand\n3. Calculation (5 mins): Compare before/after - Fund: 1,200→1,700, Pizza: 1,500→2,000\n4. Key Learning (5 mins): Define community inflation - when everyone has more money, prices adjust\n5. Reflection (5 mins): Was the bonus actually helpful?",
      assessment: "Can students explain why prices rose? Do they understand that progress toward goal barely changed (80%→85%)? Can they define inflation in their own words?",
      teacherScript: "The pizza shop noticed EVERY class wanted pizza. They can only make so many pizzas, so they adjusted prices. Let's understand why this happened.",
      discussionQuestions: [
        "Why do you think the pizza shop raised their prices?",
        "Is it fair that prices went up?",
        "What does this teach us about when everyone has more money?"
      ],
      activities: [
        {
          name: "Price Comparison Activity",
          description: "Compare BEFORE and AFTER: Fund: 1,200 → 1,700 | Pizza: 1,500 → 2,000 | Progress: 80% → 85%. Key Learning: When everyone has more money, prices adjust because resources are limited. This is community inflation."
        }
      ]
    }
  },

  // Week 2: Community Inflation (Part 2)
  {
    weekNumber: 2,
    moduleName: "Community Inflation (Part 2)",
    learningObjectives: [
      "Apply inflation concepts to real scenarios",
      "Make informed community financial decisions",
      "Understand the impact of collective choices",
      "Practice resource management"
    ],
    mondayLesson: {
      title: "Making Smart Choices Together",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students apply their understanding of inflation to develop strategies for managing their class fund effectively when prices change.",
      materials: [
        "Class Display showing current fund and goals",
        "Strategy cards or whiteboard",
        "Updated price list"
      ],
      objectives: [
        "Identify at least three strategies for dealing with price increases",
        "Evaluate which strategies work best for different situations",
        "Collaborate to create a class action plan"
      ],
      structure: "1. Review (5 mins): Recall what we learned about inflation\n2. Problem Statement (5 mins): Our goal costs more now - what do we do?\n3. Brainstorm (10 mins): Small groups list possible strategies\n4. Share & Discuss (5 mins): Each group presents their best strategy\n5. Action Plan (5 mins): Class selects approach for this week",
      assessment: "Do students suggest saving more, changing goals, or earning more? Can they explain pros and cons of each strategy? Do they work collaboratively?",
      teacherScript: "Now that we understand how community inflation works, let's think about how we can make smart choices with our class fund when prices change.",
      discussionQuestions: [
        "What strategies can we use when prices go up?",
        "Should we change our goals when inflation happens?",
        "How can we work together to reach our goals despite higher prices?"
      ],
      activities: [
        {
          name: "Strategy Discussion",
          description: "Brainstorm as a class: save more, choose different goals, or work harder to earn more CubCoins"
        }
      ]
    },
    fridayLesson: {
      title: "Our Class Decision",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students make an informed group decision about their class goal, applying lessons learned about inflation and resource management.",
      materials: [
        "Class Display with goal options and prices",
        "Voting materials",
        "Calculator for time estimates"
      ],
      objectives: [
        "Compare different goal options mathematically",
        "Make a reasoned decision based on available information",
        "Participate in democratic decision-making"
      ],
      structure: "1. Present Options (5 mins): Show updated goals and prices\n2. Calculate (10 mins): How long to reach each goal at current earning rate?\n3. Discuss (5 mins): Which goal makes sense for our class?\n4. Vote (5 mins): Democratic decision on new goal\n5. Reflect (5 mins): What did we learn about money and prices?",
      assessment: "Can students calculate time to reach goals? Do they consider both cost and value? Can they articulate what they learned about inflation?",
      teacherScript: "Let's look at our updated prices and decide together what our new goal should be. Remember, we have 1,700 CubCoins now.",
      discussionQuestions: [
        "Which goal makes the most sense for our class?",
        "How long will it take to reach each goal?",
        "What did we learn about money and prices this week?"
      ],
      activities: [
        {
          name: "Goal Selection",
          description: "Review options: Pizza party (2,000), Field trip (3,200), Extra recess (1,000). Discuss and vote on class goal."
        }
      ]
    }
  },

  // Week 3: Democratic Decision Making (Part 1)
  {
    weekNumber: 3,
    moduleName: "Democratic Decision Making (Part 1)",
    learningObjectives: [
      "Understand how democratic voting works",
      "Practice making collective decisions",
      "Learn about equal participation and fairness",
      "Experience group decision-making"
    ],
    mondayLesson: {
      title: "Our Class Gets to Decide Together",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students learn about democratic voting and equal participation, preparing for a class-wide financial decision.",
      materials: [
        "Class Display with voting options",
        "Ballot papers or voting cards",
        "Democracy vocabulary cards"
      ],
      objectives: [
        "Explain what democratic voting means",
        "Understand that each person gets one equal vote",
        "Prepare to make an informed choice"
      ],
      structure: "1. Introduction (5 mins): What is democracy? One person, one vote\n2. Present Options (10 mins): Show three spending options with costs\n3. Discussion (5 mins): Why is equal voting important?\n4. Preparation (5 mins): Think about your choice and reasons\n5. Preview (5 mins): We'll vote on Friday - prepare your decision!",
      assessment: "Can students define democracy in their own words? Do they understand equal voting? Can they explain why everyone's voice matters?",
      teacherScript: "Great news! Our class has earned 2,000 CubCoins! But this time, we're going to make a choice together using democratic voting. Everyone gets one vote.",
      discussionQuestions: [
        "Why is it important that everyone gets one vote?",
        "What if we don't all agree on the same choice?",
        "How can we make sure everyone's voice is heard?"
      ],
      activities: [
        {
          name: "Introduce Voting Options",
          description: "Class Display shows three options: Pizza Party (1,800), Extra Recess Week (1,500), New Books (1,600). Discuss each option and what it means for our class."
        }
      ]
    },
    fridayLesson: {
      title: "Time to Vote!",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students participate in a democratic vote, experiencing the voting process and accepting the group decision.",
      materials: [
        "Ballot papers",
        "Voting box",
        "Class Display for results",
        "Celebration materials"
      ],
      objectives: [
        "Participate in a fair voting process",
        "Count and understand vote results",
        "Accept and support the group decision"
      ],
      structure: "1. Voting Rules (5 mins): Review process - secret ballot, one vote each\n2. Cast Votes (10 mins): Students vote privately\n3. Count Together (5 mins): Tally votes on Class Display\n4. Announce Winner (5 mins): Celebrate the democratic decision\n5. Reflect (5 mins): How did it feel to participate?",
      assessment: "Did all students participate? Can they accept the result even if their choice didn't win? Do they understand this is democracy in action?",
      teacherScript: "Today we vote! Remember, every person's vote counts equally. After we count the votes, we'll celebrate our democratic decision together.",
      discussionQuestions: [
        "How did it feel to have your vote count?",
        "Even if your choice didn't win, why is voting still important?",
        "What makes a decision fair?"
      ],
      activities: [
        {
          name: "Live Vote Count",
          description: "Teacher counts votes for each option on Class Display. Announce winner with celebration. Record the decision in the system."
        }
      ]
    }
  },

  // Week 4: Democratic Decision Making (Part 2)
  {
    weekNumber: 4,
    moduleName: "Democratic Decision Making (Part 2)",
    learningObjectives: [
      "Reflect on democratic decision outcomes",
      "Understand compromise and acceptance",
      "Practice respectful disagreement",
      "Build community through shared decisions"
    ],
    mondayLesson: {
      title: "Living with Our Choice",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students reflect on the democratic process and learn about accepting and supporting group decisions.",
      materials: [
        "Reflection journals or paper",
        "Previous week's voting results",
        "Discussion circle setup"
      ],
      objectives: [
        "Reflect on feelings about the group decision",
        "Understand the importance of supporting democratic outcomes",
        "Identify ways to include everyone despite differences"
      ],
      structure: "1. Recall (5 mins): Review our vote and the result\n2. Feelings Check (5 mins): How do different people feel about the outcome?\n3. Discussion Circle (10 mins): Sharing thoughts respectfully\n4. Community Building (5 mins): How do we support each other?\n5. Looking Forward (5 mins): Our reward is coming!",
      assessment: "Can students express their feelings appropriately? Do they show respect for others' opinions? Do they understand supporting the group even when they disagree?",
      teacherScript: "Last week we voted and made a decision together. Today let's talk about what it means to accept and support a decision even if it wasn't your first choice.",
      discussionQuestions: [
        "How do you feel about the choice we made?",
        "What's good about supporting decisions even when you voted differently?",
        "How can we make sure everyone feels included in our class choice?"
      ],
      activities: [
        {
          name: "Reflection Circle",
          description: "Students share their thoughts about the voting process and outcome. Teacher guides discussion about democracy and community."
        }
      ]
    },
    fridayLesson: {
      title: "Celebrating Our Democratic Choice",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students enjoy the result of their democratic decision and reflect on the entire decision-making process.",
      materials: [
        "Reward items (pizza, extra recess, or books)",
        "Celebration setup",
        "Reflection worksheets"
      ],
      objectives: [
        "Experience the outcome of democratic decision-making",
        "Identify key lessons learned about group decisions",
        "Apply democratic principles to future choices"
      ],
      structure: "1. Celebration Setup (5 mins): Prepare for our reward\n2. Enjoy Together (10 mins): Experience what we chose as a class\n3. Reflection (5 mins): What did we learn about democracy?\n4. Future Applications (5 mins): When else could we use voting?\n5. Summary (5 mins): Key takeaways about group decisions",
      assessment: "Do students appreciate the democratic process? Can they identify lessons learned? Are they considering future applications of these principles?",
      teacherScript: "Today we enjoy what we voted for together! This is the result of our democratic process. Everyone contributed to this decision.",
      discussionQuestions: [
        "What did we learn about making decisions as a group?",
        "Would you do anything differently next time we vote?",
        "Why is democracy a good way to make class decisions?"
      ],
      activities: [
        {
          name: "Enjoy Class Reward",
          description: "Spend the CubCoins on the winning choice (Pizza Party, Extra Recess, or New Books). Celebrate together as a class."
        }
      ]
    }
  },

  // Week 5: Managing Our Class Bank
  {
    weekNumber: 5,
    moduleName: "Managing Our Class Bank",
    learningObjectives: [
      "Identify sources of regular income",
      "List classroom expenses",
      "Understand budget balancing",
      "Make decisions about managing shortfalls or surpluses"
    ],
    mondayLesson: {
      title: "Income and Expenses",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students learn about regular income and expenses by exploring the class bank, understanding that communities have ongoing costs that must be balanced against income.",
      materials: [
        "Class Display showing Class Bank",
        "Whiteboard for listing income and expenses",
        "Class Bank statement printout",
        "Calculator"
      ],
      objectives: [
        "Identify at least 3 sources of classroom income",
        "List at least 4 classroom expenses",
        "Understand the difference between income and expenses"
      ],
      structure: "1. Introduction (10 mins): What are income and expenses? What do families pay for regularly?\n2. Class Bank Review (10 mins): Open Class Bank on display, review current balance and recent transactions\n3. Income Activity (10 mins): List all sources of class income - CubCoins earned, weekly salary (if enabled), interest\n4. Expenses Brainstorm (10 mins): What does our classroom cost? Electricity, heating, snacks, resources, cleaner\n5. Wrap-up (5 mins): Summarise income vs expenses concept",
      assessment: "Can students identify at least 3 sources of classroom income? Can students list at least 4 classroom expenses? Do students understand the difference between income and expenses?",
      teacherScript: "Today we're going to learn about how our classroom works like a business! Just like your families pay for things at home, our classroom has costs too. Let's explore our Class Bank to see where our money comes from and where it goes.",
      discussionQuestions: [
        "What bills do your parents pay at home?",
        "Where does our class get CubCoins from?",
        "What things cost money to run our classroom?"
      ],
      activities: [
        {
          name: "Class Bank Exploration",
          description: "Open the Class Bank page and review transactions. Identify which are income (green +) and which are expenses (red -). Calculate weekly totals."
        }
      ]
    },
    fridayLesson: {
      title: "Balancing the Budget",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / Maths",
      lessonFocus: "Students compare total income versus total expenses and make decisions about managing the class budget.",
      materials: [
        "Income and expenses lists from Monday",
        "Calculator",
        "Budget worksheet",
        "Class Display"
      ],
      objectives: [
        "Calculate whether income exceeds expenses",
        "Explain what happens if expenses exceed income",
        "Propose solutions for budget shortfalls or surplus management"
      ],
      structure: "1. Review (5 mins): Recap income and expenses from Monday\n2. Budget Calculation (10 mins): Add up total income vs total expenses for the week\n3. Analysis (10 mins): Are we earning more than we spend? What if expenses increase?\n4. Decision Making (10 mins): Class discusses options - reduce expenses, increase earning, save for emergencies\n5. Action Plan (10 mins): Agree on one budget management strategy to try",
      assessment: "Can students perform the budget calculation correctly? Do they understand consequences of unbalanced budgets? Can they propose reasonable solutions? Group discussion: What should we do with surplus funds?",
      teacherScript: "Let's put it all together! We know our income sources and our expenses. Now let's see if our class is making money or losing money each week. This is called balancing our budget.",
      discussionQuestions: [
        "What happens if we spend more than we earn?",
        "Is it good to have money left over? Why?",
        "How can we earn more or spend less?"
      ],
      activities: [
        {
          name: "Budget Balance Sheet",
          description: "Create a simple budget on the whiteboard. Income on one side, expenses on the other. Calculate the difference. Discuss whether we need to adjust."
        }
      ]
    }
  },

  // Week 6: Savings & Delayed Gratification (Part 1)
  {
    weekNumber: 6,
    moduleName: "Savings & Delayed Gratification (Part 1)",
    learningObjectives: [
      "Understand delayed gratification concepts",
      "Learn the benefits of community saving",
      "Practice making difficult choices",
      "Support each other during waiting periods"
    ],
    mondayLesson: {
      title: "One Marshmallow Now or Two Later?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students explore the concept of delayed gratification through the famous marshmallow experiment and apply it to their class fund decisions.",
      materials: [
        "Class Display with current fund balance",
        "Pictures or video of marshmallow experiment",
        "Comparison chart showing options"
      ],
      objectives: [
        "Explain what delayed gratification means",
        "Compare immediate vs future rewards",
        "Identify strategies for waiting"
      ],
      structure: "1. Story Time (5 mins): Share the marshmallow experiment story\n2. Connect to Our Class (5 mins): We have a similar choice to make\n3. Present Options (10 mins): Show spend now vs save for bigger reward\n4. Discussion (5 mins): What are benefits of waiting?\n5. Preparation (5 mins): Think about your choice for Friday",
      assessment: "Can students explain delayed gratification? Do they understand the trade-off between now and later? Can they identify personal strategies for waiting?",
      teacherScript: "Let's talk about the famous marshmallow experiment! Scientists found that kids who could wait for two marshmallows did better in life. Our class has a similar choice today.",
      discussionQuestions: [
        "What's harder: waiting for something better, or taking something smaller now?",
        "What are the benefits of saving and waiting?",
        "How can we help each other wait for bigger rewards?"
      ],
      activities: [
        {
          name: "Choice Presentation",
          description: "Show on Class Display: Current fund: 1,200 CubCoins. Option A: Spend Now - Pizza Party today, fund goes to 0. Option B: Save & Wait - No reward this week, but field trip in 4 weeks."
        }
      ]
    },
    fridayLesson: {
      title: "Should We Save or Spend?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students make a collective decision about saving versus spending, putting delayed gratification principles into practice.",
      materials: [
        "Voting materials",
        "Countdown calendar (if SAVE wins)",
        "Celebration materials (if SPEND wins)"
      ],
      objectives: [
        "Weigh pros and cons of saving vs spending",
        "Make an informed group decision",
        "Plan for the outcome of the choice"
      ],
      structure: "1. Recap (5 mins): Review our two options\n2. Pros and Cons (10 mins): List advantages of each choice\n3. Vote (5 mins): Democratic decision - save or spend?\n4. Outcome (5 mins): If SAVE - start countdown. If SPEND - celebrate now\n5. Reflection (5 mins): What does our choice say about us?",
      assessment: "Do students consider long-term consequences? Can they articulate reasons for their choice? Do they accept the group decision?",
      teacherScript: "It's decision time! Let's vote on whether we spend now for a quick reward, or save and wait for something bigger and better.",
      discussionQuestions: [
        "What are the pros and cons of each choice?",
        "If we choose to wait, how can we stay motivated?",
        "What will make the waiting worth it?"
      ],
      activities: [
        {
          name: "Save vs Spend Vote",
          description: "Vote and display results. If SAVE wins: Start countdown display (4 weeks to field trip!). If SPEND wins: Enjoy pizza party and reflect on instant gratification."
        }
      ]
    }
  },

  // Week 7: Savings & Delayed Gratification (Part 2)
  {
    weekNumber: 7,
    moduleName: "Savings & Delayed Gratification (Part 2)",
    learningObjectives: [
      "Practice patience while working toward goals",
      "Track progress toward future rewards",
      "Experience the satisfaction of achieving saved goals",
      "Understand the relationship between waiting and reward size"
    ],
    mondayLesson: {
      title: "The Waiting Game",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students practise patience and track progress as they work toward their saved goal, learning coping strategies for delayed gratification.",
      materials: [
        "Progress tracker on Class Display",
        "Countdown calendar",
        "Strategy sharing materials"
      ],
      objectives: [
        "Track progress toward the goal",
        "Share strategies for staying patient",
        "Celebrate progress made so far"
      ],
      structure: "1. Progress Check (5 mins): How far have we come?\n2. Feelings Share (10 mins): How has waiting been for you?\n3. Strategy Exchange (5 mins): What helps you stay patient?\n4. Encouragement (5 mins): We're doing great!\n5. Look Ahead (5 mins): Almost there!",
      assessment: "Are students staying motivated? Can they identify helpful waiting strategies? Do they support each other in the process?",
      teacherScript: "We're halfway through our saving period! Let's check our progress and talk about how it feels to wait for something we really want.",
      discussionQuestions: [
        "How has it been waiting for our big reward?",
        "What strategies have helped you stay patient?",
        "Is the bigger reward worth the wait so far?"
      ],
      activities: [
        {
          name: "Progress Check",
          description: "Display savings progress on Class Display. Show countdown: 2 more weeks to field trip! Current fund: ~2,400 CubCoins. Goal: 2,500 CubCoins."
        }
      ]
    },
    fridayLesson: {
      title: "Almost There!",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students experience the excitement of approaching their goal and reflect on their journey of delayed gratification.",
      materials: [
        "Art supplies for drawing/writing",
        "Countdown display",
        "Celebration planning materials"
      ],
      objectives: [
        "Experience anticipation for the reward",
        "Reflect on the waiting journey",
        "Plan for the celebration"
      ],
      structure: "1. Final Countdown (5 mins): One more week!\n2. Reflection Activity (10 mins): Draw or write about the journey\n3. Anticipation (5 mins): What are you most excited for?\n4. Planning (5 mins): How should we celebrate?\n5. Pride (5 mins): We did it - we waited!",
      assessment: "Do students feel proud of their patience? Can they reflect on the waiting process? Are they excited about the upcoming reward?",
      teacherScript: "We're so close! Just one more week until our field trip. Let's celebrate how well we've waited and worked together.",
      discussionQuestions: [
        "How does it feel knowing we're almost there?",
        "What was the hardest part of waiting?",
        "What are you most excited about for the field trip?"
      ],
      activities: [
        {
          name: "Anticipation Celebration",
          description: "Create excitement for next week's reward. Students draw pictures or write about what they're looking forward to. Display countdown: 1 week left!"
        }
      ]
    }
  },

  // Week 8: Cross-Classroom Collaboration (Part 1)
  {
    weekNumber: 8,
    moduleName: "Cross-Classroom Collaboration (Part 1)",
    learningObjectives: [
      "Understand cross-classroom collaboration",
      "Learn about cooperation vs competition",
      "Practice multi-group decision-making",
      "Experience community collaboration benefits"
    ],
    mondayLesson: {
      title: "What If We Worked Together?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students explore the benefits of collaboration over competition by considering pooling resources with another class.",
      materials: [
        "Class Display with fund comparisons",
        "Calculator for combined totals",
        "Goal comparison chart"
      ],
      objectives: [
        "Calculate benefits of combined resources",
        "Compare cooperation vs competition",
        "Consider fairness in partnerships"
      ],
      structure: "1. Introduction (5 mins): Another class wants to work with us\n2. The Math (10 mins): Calculate what we could achieve together\n3. Comparison (5 mins): Alone vs together - what's the difference?\n4. Fairness Discussion (5 mins): How do we make it fair?\n5. Consider (5 mins): Think about collaboration for Friday",
      assessment: "Can students calculate combined resources? Do they understand benefits of collaboration? Can they identify fairness concerns?",
      teacherScript: "Mrs. Smith's class is also saving for goals. What if we combined our efforts? Let's do the math and see what we could achieve together!",
      discussionQuestions: [
        "Can we reach bigger goals working with another class?",
        "What's the difference between competing and cooperating?",
        "How can we make sure collaboration is fair for both classes?"
      ],
      activities: [
        {
          name: "Collaboration Math",
          description: "Show on Class Display: Our Class: 2,800 CubCoins (56% to goal). Mrs. Smith's Class: 2,200 CubCoins (44% to goal). Separate progress vs Together: 5,000 CubCoins (100%!). Could afford school carnival together!"
        }
      ]
    },
    fridayLesson: {
      title: "Should We Collaborate?",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students vote on whether to collaborate with another class, learning about partnership decisions and shared goals.",
      materials: [
        "Voting materials",
        "Partnership agreement template",
        "Communication plan (if YES)"
      ],
      objectives: [
        "Make an informed decision about collaboration",
        "Understand partnership commitments",
        "Plan for the outcome of the vote"
      ],
      structure: "1. Recap Benefits (5 mins): What could we achieve together?\n2. Consider Challenges (5 mins): What might be hard about collaboration?\n3. Vote (5 mins): YES or NO for collaboration\n4. Outcome (10 mins): If YES - plan meeting. If NO - continue solo\n5. Reflection (5 mins): What influenced our decision?",
      assessment: "Do students weigh benefits and challenges? Can they make a reasoned group decision? Do they understand partnership commitment?",
      teacherScript: "We've seen the math. Now let's decide: do we want to work with Mrs. Smith's class to achieve something bigger, or continue with our own class goals?",
      discussionQuestions: [
        "What are the benefits of working together?",
        "What might be challenging about collaboration?",
        "Will this be fair to both classes?"
      ],
      activities: [
        {
          name: "Collaboration Vote",
          description: "Vote YES or NO for collaboration. If YES: Plan joint meeting with Mrs. Smith's class. If NO: Continue with individual class goals. Both classes must vote YES to collaborate."
        }
      ]
    }
  },

  // Week 9: Cross-Classroom Collaboration (Part 2)
  {
    weekNumber: 9,
    moduleName: "Cross-Classroom Collaboration (Part 2)",
    learningObjectives: [
      "Experience working toward shared goals",
      "Practice inter-class cooperation",
      "Celebrate collaborative achievements",
      "Reflect on the power of working together"
    ],
    mondayLesson: {
      title: "Working Together Toward Our Big Goal",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students experience the benefits of collaboration as they track combined progress and plan a joint celebration.",
      materials: [
        "Combined progress tracker",
        "Class Display showing both classes",
        "Planning materials for joint celebration"
      ],
      objectives: [
        "Track combined progress toward shared goal",
        "Experience the power of collaboration",
        "Plan a fair celebration together"
      ],
      structure: "1. Combined Check (5 mins): Our joint progress\n2. Feelings Share (5 mins): How does teamwork feel?\n3. Planning (10 mins): How should we celebrate together?\n4. Fairness Check (5 mins): Is this working for both classes?\n5. Final Push (5 mins): Let's reach our goal!",
      assessment: "Are students positive about collaboration? Do they consider fairness? Can they plan a joint celebration effectively?",
      teacherScript: "Both classes voted YES! Now we're working together. Let's track our combined progress and plan how we'll celebrate our achievement together.",
      discussionQuestions: [
        "How does it feel to work with another class?",
        "What can we accomplish together that we couldn't alone?",
        "How should we celebrate our joint achievement?"
      ],
      activities: [
        {
          name: "Combined Progress Tracker",
          description: "Display on Class Display: Our Class: 2,800 | Their Class: 2,200 | Combined: 5,000 CubCoins | Goal: School Carnival (5,000) | Status: GOAL REACHED!"
        }
      ]
    },
    fridayLesson: {
      title: "Celebrating Together!",
      grade: "Year 3-6 (Ages 7-12)",
      subject: "Financial Literacy / PSHE",
      lessonFocus: "Students celebrate their collaborative achievement and reflect on all the financial literacy lessons learned throughout the curriculum.",
      materials: [
        "Carnival/celebration setup",
        "Reflection worksheets",
        "Certificates or recognition materials"
      ],
      objectives: [
        "Celebrate collaborative achievement",
        "Reflect on the entire curriculum journey",
        "Identify key lessons learned about money and teamwork"
      ],
      structure: "1. Celebration (15 mins): Enjoy the school carnival together!\n2. Reflection Circle (10 mins): What did we learn over these weeks?\n3. Key Takeaways (5 mins): Main lessons about money and collaboration\n4. Recognition (5 mins): Celebrate everyone's contributions\n5. Future Applications (5 mins): How will we use these lessons?",
      assessment: "Can students identify key financial lessons? Do they appreciate the value of collaboration? Are they proud of their achievements?",
      teacherScript: "We did it! By working together, both classes achieved something amazing. Today we celebrate what collaboration can accomplish!",
      discussionQuestions: [
        "What did we learn about working with others?",
        "How was this different from working alone?",
        "What other things could we accomplish by collaborating?"
      ],
      activities: [
        {
          name: "Joint Class Carnival",
          description: "Both classes enjoy the school carnival together. Celebrate the power of collaboration, cooperation, and community achievement. Reflect on the 9-week curriculum journey."
        }
      ]
    }
  }
];

// Helper function to get curriculum module by week number
export function getCurriculumModuleByWeek(weekNumber: number): CurriculumModule | undefined {
  return curriculumModules.find(module => Number(module.weekNumber) === weekNumber);
}

// Helper function to get all curriculum modules
export function getAllCurriculumModules(): CurriculumModule[] {
  return curriculumModules;
}
