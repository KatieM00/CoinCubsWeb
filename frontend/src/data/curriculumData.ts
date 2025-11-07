import { CurriculumModule } from '../types';

export const curriculumModules: CurriculumModule[] = [
  // Week 1: Community Inflation (Part 1)
  {
    weekNumber: BigInt(1),
    moduleName: "Community Inflation (Part 1)",
    learningObjectives: [
      "Understand how community funds work",
      "Learn about inflation at the collective level",
      "Practice community budgeting decisions",
      "Understand scarcity of resources"
    ],
    mondayLesson: {
      title: "What Happens When We All Get More Money?",
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
    weekNumber: BigInt(2),
    moduleName: "Community Inflation (Part 2)",
    learningObjectives: [
      "Apply inflation concepts to real scenarios",
      "Make informed community financial decisions",
      "Understand the impact of collective choices",
      "Practice resource management"
    ],
    mondayLesson: {
      title: "Making Smart Choices Together",
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
    weekNumber: BigInt(3),
    moduleName: "Democratic Decision Making (Part 1)",
    learningObjectives: [
      "Understand how democratic voting works",
      "Practice making collective decisions",
      "Learn about equal participation and fairness",
      "Experience group decision-making"
    ],
    mondayLesson: {
      title: "Our Class Gets to Decide Together",
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
    weekNumber: BigInt(4),
    moduleName: "Democratic Decision Making (Part 2)",
    learningObjectives: [
      "Reflect on democratic decision outcomes",
      "Understand compromise and acceptance",
      "Practice respectful disagreement",
      "Build community through shared decisions"
    ],
    mondayLesson: {
      title: "Living with Our Choice",
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

  // Week 5: Savings & Delayed Gratification (Part 1)
  {
    weekNumber: BigInt(5),
    moduleName: "Savings & Delayed Gratification (Part 1)",
    learningObjectives: [
      "Understand delayed gratification concepts",
      "Learn the benefits of community saving",
      "Practice making difficult choices",
      "Support each other during waiting periods"
    ],
    mondayLesson: {
      title: "One Marshmallow Now or Two Later?",
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

  // Week 6: Savings & Delayed Gratification (Part 2)
  {
    weekNumber: BigInt(6),
    moduleName: "Savings & Delayed Gratification (Part 2)",
    learningObjectives: [
      "Practice patience while working toward goals",
      "Track progress toward future rewards",
      "Experience the satisfaction of achieving saved goals",
      "Understand the relationship between waiting and reward size"
    ],
    mondayLesson: {
      title: "The Waiting Game",
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

  // Week 7: Cross-Classroom Collaboration (Part 1)
  {
    weekNumber: BigInt(7),
    moduleName: "Cross-Classroom Collaboration (Part 1)",
    learningObjectives: [
      "Understand cross-classroom collaboration",
      "Learn about cooperation vs competition",
      "Practice multi-group decision-making",
      "Experience community collaboration benefits"
    ],
    mondayLesson: {
      title: "What If We Worked Together?",
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

  // Week 8: Cross-Classroom Collaboration (Part 2)
  {
    weekNumber: BigInt(8),
    moduleName: "Cross-Classroom Collaboration (Part 2)",
    learningObjectives: [
      "Experience working toward shared goals",
      "Practice inter-class cooperation",
      "Celebrate collaborative achievements",
      "Reflect on the power of working together"
    ],
    mondayLesson: {
      title: "Working Together Toward Our Big Goal",
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
      teacherScript: "We did it! By working together, both classes achieved something amazing. Today we celebrate what collaboration can accomplish!",
      discussionQuestions: [
        "What did we learn about working with others?",
        "How was this different from working alone?",
        "What other things could we accomplish by collaborating?"
      ],
      activities: [
        {
          name: "Joint Class Carnival",
          description: "Both classes enjoy the school carnival together. Celebrate the power of collaboration, cooperation, and community achievement. Reflect on the 8-week curriculum journey."
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
