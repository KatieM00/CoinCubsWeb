import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Text "mo:base/Text";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor CoinCubs {
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    role : AccessControl.UserRole;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public type ClassGoal = {
    id : Nat;
    name : Text;
    targetAmount : Nat;
    currentAmount : Nat;
    description : Text;
    isActive : Bool;
    comments : [GoalComment];
  };

  public type ContributionRecord = {
    studentId : Nat;
    amount : Nat;
    description : Text;
    timestamp : Time.Time;
  };

  public type VotingProposal = {
    id : Nat;
    title : Text;
    description : Text;
    amountRequested : Nat;
    votesFor : Nat;
    votesAgainst : Nat;
    isActive : Bool;
    createdBy : Principal;
    createdAt : Time.Time;
    prosCons : Text;
    comments : [ProposalComment];
    voteId : Nat;
    blockchainRecord : Text;
    isFinalized : Bool;
    finalizedTimestamp : ?Time.Time;
    options : [VoteOption];
    totalVotes : Nat;
    isValidated : Bool;
  };

  public type VoteOption = {
    name : Text;
    voteCount : Nat;
  };

  public type Transaction = {
    id : Nat;
    studentId : Nat;
    amount : Nat;
    splitType : Text;
    timestamp : Time.Time;
    description : Text;
    transactionId : Nat;
    blockchainTxHash : Text;
    isOnChain : Bool;
  };

  public type StudentAccount = {
    id : Nat;
    name : Text;
    personalBalance : Nat;
    totalContributions : Nat;
    weeklyContributions : [ContributionRecord];
    isActive : Bool;
    privateNotes : Text;
    studentId : Nat;
    walletAddress : Text;
    concordiumIdentity : Text;
    lastActivity : ?Time.Time;
  };

  public type ClassFund = {
    totalAmount : Nat;
    goals : [ClassGoal];
    transactions : [Transaction];
    blockchainHash : Text;
    lastSynced : ?Time.Time;
    isVerified : Bool;
  };

  public type AwardSplit = {
    #defaultSplit;
    #allToClassFund;
    #allToPersonal;
  };

  public type ClassAchievement = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
    achievedAt : Time.Time;
  };

  public type ChatMessage = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    isApproved : Bool;
  };

  public type SupportExample = {
    id : Nat;
    description : Text;
    timestamp : Time.Time;
  };

  public type GoalComment = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type ProposalComment = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Reward = {
    id : Nat;
    name : Text;
    cost : Nat;
    description : Text;
    isActive : Bool;
  };

  public type BulkOperationLog = {
    id : Nat;
    operationType : Text;
    details : Text;
    timestamp : Time.Time;
  };

  public type SemesterResetLog = {
    id : Nat;
    resetType : Text;
    details : Text;
    timestamp : Time.Time;
  };

  public type DisplayMode = {
    #defaultView;
    #lessonMode;
  };

  public type LessonContent = {
    title : Text;
    weekTopic : Text;
    discussionPrompt : Text;
    votingOptions : [VotingOption];
  };

  public type VotingOption = {
    name : Text;
    cost : Nat;
    description : Text;
  };

  public type CurriculumModule = {
    weekNumber : Nat;
    moduleName : Text;
    mondayLesson : LessonPlan;
    fridayLesson : LessonPlan;
    timeCommitment : Text;
    learningObjectives : [Text];
    isActive : Bool;
    isCompleted : Bool;
  };

  public type LessonPlan = {
    title : Text;
    objectives : [Text];
    teacherScript : Text;
    activities : [Activity];
    discussionQuestions : [Text];
    materials : [Text];
    timeCommitment : Text;
  };

  public type Activity = {
    name : Text;
    description : Text;
    steps : [Text];
    materials : [Text];
  };

  public type CurriculumProgress = {
    currentWeek : Nat;
    modules : [CurriculumModule];
    lastUpdated : Time.Time;
  };

  public type QuickAward = {
    studentId : Nat;
    amount : Nat;
    reason : Text;
    timestamp : Time.Time;
  };

  public type UndoTransaction = {
    transactionId : Nat;
    studentId : Nat;
    amount : Nat;
    splitType : Text;
    timestamp : Time.Time;
    description : Text;
    createdAt : Time.Time;
  };

  public type ActivityTickerItem = {
    id : Nat;
    message : Text;
    timestamp : Time.Time;
    isCelebration : Bool;
    isWholeClassAward : Bool;
  };

  public type WeeklyStats = {
    classFundBalance : Nat;
    studentsContributed : Nat;
    totalStudents : Nat;
    totalCubCoinsEarned : Nat;
  };

  var studentAccounts = principalMap.empty<StudentAccount>();
  var classFund : ClassFund = {
    totalAmount = 0;
    goals = [];
    transactions = [];
    blockchainHash = "";
    lastSynced = null;
    isVerified = false;
  };
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
  var votingProposals = natMap.empty<VotingProposal>();
  var classAchievements = natMap.empty<ClassAchievement>();
  var chatMessages = natMap.empty<ChatMessage>();
  var supportExamples = natMap.empty<SupportExample>();
  var rewardsCatalog = natMap.empty<Reward>();
  var bulkOperationLogs = natMap.empty<BulkOperationLog>();
  var semesterResetLogs = natMap.empty<SemesterResetLog>();
  var nextProposalId = 0;
  var nextTransactionId = 0;
  var nextAchievementId = 0;
  var nextMessageId = 0;
  var nextSupportId = 0;
  var nextCommentId = 0;
  var nextRewardId = 0;
  var nextBulkOpId = 0;
  var nextResetId = 0;
  var nextStudentId = 0;
  var nextTickerId = 0;
  var currentDisplayMode : DisplayMode = #defaultView;
  var activeLessonContent : ?LessonContent = null;
  var curriculumProgress : CurriculumProgress = {
    currentWeek = 1;
    modules = [];
    lastUpdated = Time.now();
  };
  var lastAwardedStudents : [QuickAward] = [];
  var undoTransaction : ?UndoTransaction = null;
  var activityTicker : [ActivityTickerItem] = [];
  var presetAmounts : [Nat] = [5, 10, 15, 20, 25];
  var presetReasons : [Text] = ["Helped classmate", "Great work", "Perfect homework", "Good behavior", "Class participation"];

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func awardCubCoins(studentId : Nat, amount : Nat, splitType : AwardSplit, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can award points");
    };

    let (classFundAmount, personalAmount) = switch splitType {
      case (#defaultSplit) {
        let classAmount = Nat.div(Nat.mul(amount, 70), 100);
        let personalAmount = Nat.sub(amount, classAmount);
        (classAmount, personalAmount);
      };
      case (#allToClassFund) { (amount, 0) };
      case (#allToPersonal) { (0, amount) };
    };

    classFund := {
      totalAmount = classFund.totalAmount + classFundAmount;
      goals = classFund.goals;
      transactions = List.toArray(
        List.push(
          {
            id = nextTransactionId;
            studentId;
            amount;
            splitType = switch splitType {
              case (#defaultSplit) { "defaultSplit" };
              case (#allToClassFund) { "allToClassFund" };
              case (#allToPersonal) { "allToPersonal" };
            };
            timestamp = Time.now();
            description;
            transactionId = nextTransactionId;
            blockchainTxHash = "";
            isOnChain = false;
          },
          List.fromArray(classFund.transactions),
        )
      );
      blockchainHash = classFund.blockchainHash;
      lastSynced = classFund.lastSynced;
      isVerified = classFund.isVerified;
    };

    undoTransaction := ?{
      transactionId = nextTransactionId;
      studentId;
      amount;
      splitType = switch splitType {
        case (#defaultSplit) { "defaultSplit" };
        case (#allToClassFund) { "allToClassFund" };
        case (#allToPersonal) { "allToPersonal" };
      };
      timestamp = Time.now();
      description;
      createdAt = Time.now();
    };

    nextTransactionId += 1;

    let newQuickAward : QuickAward = {
      studentId;
      amount;
      reason = description;
      timestamp = Time.now();
    };

    let currentAwards = List.fromArray(lastAwardedStudents);
    let updatedAwards = List.take<QuickAward>(currentAwards, 4);
    lastAwardedStudents := List.toArray(List.push(newQuickAward, updatedAwards));

    let tickerMessage = if (splitType == #allToClassFund) {
      "Whole class awarded " # Nat.toText(amount) # " CubCoins!";
    } else {
      "Student " # Nat.toText(studentId) # " awarded " # Nat.toText(amount) # " CubCoins!";
    };

    let newTickerItem : ActivityTickerItem = {
      id = nextTickerId;
      message = tickerMessage;
      timestamp = Time.now();
      isCelebration = true;
      isWholeClassAward = splitType == #allToClassFund;
    };

    let currentTicker = List.fromArray(activityTicker);
    let updatedTicker = List.take<ActivityTickerItem>(currentTicker, 9);
    activityTicker := List.toArray(List.push(newTickerItem, updatedTicker));
    nextTickerId += 1;
  };

  public shared ({ caller }) func undoLastAward() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can undo awards");
    };

    switch (undoTransaction) {
      case (?transaction) {
        let currentTime = Time.now();
        if (currentTime - transaction.createdAt > 10_000_000_000) {
          Debug.trap("Undo window has expired");
        };

        classFund := {
          classFund with
          totalAmount = Nat.sub(classFund.totalAmount, transaction.amount);
          transactions = List.toArray(
            List.filter<Transaction>(
              List.fromArray(classFund.transactions),
              func(t) { t.id != transaction.transactionId },
            )
          );
        };

        undoTransaction := null;
      };
      case null {
        Debug.trap("No transaction to undo");
      };
    };
  };

  public query func getLastAwardedStudents() : async [QuickAward] {
    lastAwardedStudents;
  };

  public query func getUndoTransaction() : async ?UndoTransaction {
    undoTransaction;
  };

  public query func getActivityTicker() : async [ActivityTickerItem] {
    activityTicker;
  };

  public shared ({ caller }) func createVotingProposal(title : Text, description : Text, amountRequested : Nat, prosCons : Text, options : [VoteOption]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can create proposals");
    };

    let proposal : VotingProposal = {
      id = nextProposalId;
      title;
      description;
      amountRequested;
      votesFor = 0;
      votesAgainst = 0;
      isActive = true;
      createdBy = caller;
      createdAt = Time.now();
      prosCons;
      comments = [];
      voteId = nextProposalId;
      blockchainRecord = "";
      isFinalized = false;
      finalizedTimestamp = null;
      options;
      totalVotes = 0;
      isValidated = false;
    };

    votingProposals := natMap.put(votingProposals, nextProposalId, proposal);
    nextProposalId += 1;
  };

  public shared ({ caller }) func updateVoteCount(proposalId : Nat, optionName : Text, voteCount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can update vote counts");
    };

    switch (natMap.get(votingProposals, proposalId)) {
      case (?proposal) {
        if (proposal.isFinalized) {
          Debug.trap("Cannot update finalized vote");
        };

        let updatedOptions = List.map<VoteOption, VoteOption>(
          List.fromArray(proposal.options),
          func(option) {
            if (option.name == optionName) {
              { option with voteCount = voteCount };
            } else {
              option;
            };
          },
        );

        let totalVotes = List.foldLeft<VoteOption, Nat>(
          List.fromArray(proposal.options),
          0,
          func(acc, option) { acc + option.voteCount },
        );

        let updatedProposal = {
          proposal with
          options = List.toArray(updatedOptions);
          totalVotes;
        };
        votingProposals := natMap.put(votingProposals, proposalId, updatedProposal);
      };
      case null {
        Debug.trap("Proposal not found");
      };
    };
  };

  public shared ({ caller }) func validateVoteTotals(proposalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can validate votes");
    };

    switch (natMap.get(votingProposals, proposalId)) {
      case (?proposal) {
        let updatedProposal = {
          proposal with
          isValidated = true;
        };
        votingProposals := natMap.put(votingProposals, proposalId, updatedProposal);
      };
      case null {
        Debug.trap("Proposal not found");
      };
    };
  };

  public shared ({ caller }) func finalizeVote(proposalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can finalize votes");
    };

    switch (natMap.get(votingProposals, proposalId)) {
      case (?proposal) {
        if (not proposal.isValidated) {
          Debug.trap("Vote must be validated before finalization");
        };

        let updatedProposal = {
          proposal with
          isFinalized = true;
          finalizedTimestamp = ?Time.now();
        };
        votingProposals := natMap.put(votingProposals, proposalId, updatedProposal);
      };
      case null {
        Debug.trap("Proposal not found");
      };
    };
  };

  public shared ({ caller }) func addProposalComment(proposalId : Nat, content : Text) : async () {
    switch (natMap.get(votingProposals, proposalId)) {
      case (?proposal) {
        let updatedProposal = {
          proposal with
          comments = List.toArray(
            List.push(
              {
                id = nextCommentId;
                author = caller;
                content;
                timestamp = Time.now();
              },
              List.fromArray(proposal.comments),
            )
          );
        };
        votingProposals := natMap.put(votingProposals, proposalId, updatedProposal);
        nextCommentId += 1;
      };
      case null {
        Debug.trap("Proposal not found");
      };
    };
  };

  public shared ({ caller }) func createClassGoal(name : Text, targetAmount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can create goals");
    };

    let goal : ClassGoal = {
      id = nextProposalId;
      name;
      targetAmount;
      currentAmount = 0;
      description;
      isActive = true;
      comments = [];
    };

    classFund := {
      classFund with
      goals = List.toArray(
        List.push(
          goal,
          List.fromArray(classFund.goals),
        )
      );
    };
  };

  public shared ({ caller }) func addGoalComment(goalId : Nat, content : Text) : async () {
    let updatedGoals = List.map<ClassGoal, ClassGoal>(
      List.fromArray(classFund.goals),
      func(goal) {
        if (goal.id == goalId) {
          {
            goal with
            comments = List.toArray(
              List.push(
                {
                  id = nextCommentId;
                  author = caller;
                  content;
                  timestamp = Time.now();
                },
                List.fromArray(goal.comments),
              )
            );
          };
        } else {
          goal;
        };
      },
    );
    classFund := { classFund with goals = List.toArray(updatedGoals) };
    nextCommentId += 1;
  };

  public shared ({ caller }) func addClassAchievement(name : Text, description : Text, icon : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can add achievements");
    };

    let achievement : ClassAchievement = {
      id = nextAchievementId;
      name;
      description;
      icon;
      achievedAt = Time.now();
    };

    classAchievements := natMap.put(classAchievements, nextAchievementId, achievement);
    nextAchievementId += 1;
  };

  public shared ({ caller }) func postChatMessage(content : Text) : async () {
    let message : ChatMessage = {
      id = nextMessageId;
      author = caller;
      content;
      timestamp = Time.now();
      isApproved = false;
    };

    chatMessages := natMap.put(chatMessages, nextMessageId, message);
    nextMessageId += 1;
  };

  public shared ({ caller }) func approveChatMessage(messageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can approve messages");
    };

    switch (natMap.get(chatMessages, messageId)) {
      case (?message) {
        let updatedMessage = { message with isApproved = true };
        chatMessages := natMap.put(chatMessages, messageId, updatedMessage);
      };
      case null {
        Debug.trap("Message not found");
      };
    };
  };

  public shared ({ caller }) func addSupportExample(description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can add support examples");
    };

    let example : SupportExample = {
      id = nextSupportId;
      description;
      timestamp = Time.now();
    };

    supportExamples := natMap.put(supportExamples, nextSupportId, example);
    nextSupportId += 1;
  };

  public shared ({ caller }) func addReward(name : Text, cost : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can add rewards");
    };

    let reward : Reward = {
      id = nextRewardId;
      name;
      cost;
      description;
      isActive = true;
    };

    rewardsCatalog := natMap.put(rewardsCatalog, nextRewardId, reward);
    nextRewardId += 1;
  };

  public shared ({ caller }) func updateRewardPrice(rewardId : Nat, newCost : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can update rewards");
    };

    switch (natMap.get(rewardsCatalog, rewardId)) {
      case (?reward) {
        let updatedReward = { reward with cost = newCost };
        rewardsCatalog := natMap.put(rewardsCatalog, rewardId, updatedReward);
      };
      case null {
        Debug.trap("Reward not found");
      };
    };
  };

  public shared ({ caller }) func bulkUpdateRewardPrices(percentageChange : Nat, isIncrease : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can perform bulk updates");
    };

    rewardsCatalog := natMap.map<Reward, Reward>(
      rewardsCatalog,
      func(_id, reward) {
        let newCost = if (isIncrease) {
          reward.cost + Nat.div(Nat.mul(reward.cost, percentageChange), 100);
        } else {
          Nat.sub(reward.cost, Nat.div(Nat.mul(reward.cost, percentageChange), 100));
        };
        { reward with cost = newCost };
      },
    );
  };

  public shared ({ caller }) func addBulkOperationLog(operationType : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can log operations");
    };

    let log : BulkOperationLog = {
      id = nextBulkOpId;
      operationType;
      details;
      timestamp = Time.now();
    };

    bulkOperationLogs := natMap.put(bulkOperationLogs, nextBulkOpId, log);
    nextBulkOpId += 1;
  };

  public shared ({ caller }) func addSemesterResetLog(resetType : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can log resets");
    };

    let log : SemesterResetLog = {
      id = nextResetId;
      resetType;
      details;
      timestamp = Time.now();
    };

    semesterResetLogs := natMap.put(semesterResetLogs, nextResetId, log);
    nextResetId += 1;
  };

  public shared ({ caller }) func setDisplayMode(mode : DisplayMode) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can change display mode");
    };
    currentDisplayMode := mode;
  };

  public shared ({ caller }) func setActiveLessonContent(content : LessonContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can set lesson content");
    };
    activeLessonContent := ?content;
  };

  public shared ({ caller }) func clearActiveLessonContent() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can clear lesson content");
    };
    activeLessonContent := null;
  };

  public query func getDisplayMode() : async DisplayMode {
    currentDisplayMode;
  };

  public query func getActiveLessonContent() : async ?LessonContent {
    activeLessonContent;
  };

  public query func getClassFund() : async ClassFund {
    classFund;
  };

  public query func getActiveVotingProposals() : async [VotingProposal] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(votingProposals),
        func(proposal : VotingProposal) : Bool {
          proposal.isActive;
        },
      )
    );
  };

  public query func getClassGoals() : async [ClassGoal] {
    classFund.goals;
  };

  public query func getClassAchievements() : async [ClassAchievement] {
    Iter.toArray(natMap.vals(classAchievements));
  };

  public query func getApprovedChatMessages() : async [ChatMessage] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(chatMessages),
        func(message : ChatMessage) : Bool {
          message.isApproved;
        },
      )
    );
  };

  public query func getSupportExamples() : async [SupportExample] {
    Iter.toArray(natMap.vals(supportExamples));
  };

  public query func getRewardsCatalog() : async [Reward] {
    Iter.toArray(natMap.vals(rewardsCatalog));
  };

  public query func getBulkOperationLogs() : async [BulkOperationLog] {
    Iter.toArray(natMap.vals(bulkOperationLogs));
  };

  public query func getSemesterResetLogs() : async [SemesterResetLog] {
    Iter.toArray(natMap.vals(semesterResetLogs));
  };

  public query ({ caller }) func getCallerPersonalBalance() : async Nat {
    switch (principalMap.get(studentAccounts, caller)) {
      case (?account) { account.personalBalance };
      case null { 0 };
    };
  };

  public query ({ caller }) func getCallerWeeklyContributions() : async [ContributionRecord] {
    switch (principalMap.get(studentAccounts, caller)) {
      case (?account) { account.weeklyContributions };
      case null { [] };
    };
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public shared ({ caller }) func initializeCurriculum() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can initialize curriculum");
    };

    let modules : [CurriculumModule] = [
      {
        weekNumber = 1;
        moduleName = "Community Inflation (Weeks 1-2)";
        mondayLesson = {
          title = "What Happens When We All Get More Money?";
          objectives = [
            "Understand how community funds work",
            "Learn about inflation at the collective level",
            "Practice community budgeting decisions",
            "Understand scarcity of resources",
          ];
          teacherScript = "The school is celebrating Community Week! Every classroom gets a bonus 500 CubCoins!";
          activities = [
            {
              name = "Class Fund Simulation";
              description = "Simulate class fund changes with bonus CubCoins";
              steps = [
                "Display current class fund: 1,200 CubCoins",
                "Add bonus: Fund jumps to 1,700 CubCoins",
                "Discuss current goal: Pizza party (1,500 CubCoins)",
              ];
              materials = ["Class fund chart", "Play money"];
            },
          ];
          discussionQuestions = [
            "How does it feel to suddenly have more money?",
            "If every class got this bonus, what might happen?",
            "Should we spend it all or save some?",
          ];
          materials = ["Class fund chart", "Play money"];
          timeCommitment = "10 minutes";
        };
        fridayLesson = {
          title = "Why Did Prices Change?";
          objectives = [
            "Understand the concept of inflation",
            "Learn how prices adjust with increased demand",
            "Practice comparing prices before and after changes",
            "Recognize the impact of limited resources",
          ];
          teacherScript = "The pizza shop noticed EVERY class wanted pizza. They can only make so many pizzas, so they adjusted prices.";
          activities = [
            {
              name = "Price Comparison Activity";
              description = "Compare prices before and after inflation";
              steps = [
                "Display price changes: Pizza party (1,500 → 2,000 CubCoins), Field trip (2,500 → 3,200 CubCoins), Extra recess (800 → 1,000 CubCoins)",
                "Math comparison: BEFORE: Fund: 1,200 | Pizza: 1,500 | Progress: 80%, AFTER: Fund: 1,700 | Pizza: 2,000 | Progress: 85%",
                "Discuss key learning: When everyone has more money, prices adjust because resources are limited. This is community inflation.",
              ];
              materials = ["Price charts", "Class fund chart"];
            },
          ];
          discussionQuestions = [
            "Why did prices change after the bonus?",
            "How does this relate to real-world inflation?",
            "What can we learn about managing resources?",
          ];
          materials = ["Price charts", "Class fund chart"];
          timeCommitment = "10 minutes";
        };
        timeCommitment = "20 min/week (10 min Monday + 10 min Friday)";
        learningObjectives = [
          "Understand community inflation",
          "Learn about shared resource growth",
          "Recognize the impact of contributions",
        ];
        isActive = true;
        isCompleted = false;
      },
      {
        weekNumber = 2;
        moduleName = "Democratic Decision Making (Weeks 3-4)";
        mondayLesson = {
          title = "Our Class Gets to Decide Together";
          objectives = [
            "Understand how democratic voting works",
            "Practice making collective decisions",
            "Learn about equal participation and fairness",
            "Experience the power of group choice",
          ];
          teacherScript = "Our class fund has grown to 2,000 CubCoins! Now we get to vote on how to spend it. Everyone gets one equal vote, and the majority decides for our whole class.";
          activities = [
            {
              name = "Voting Simulation";
              description = "Practice voting and group decision making";
              steps = [
                "Display current class fund: 2,000 CubCoins",
                "Present voting options: Pizza Party (1,800 CubCoins), Extra Recess Week (1,500 CubCoins), New Books (1,600 CubCoins)",
                "Discuss voting rules: One person = One vote. Majority wins!",
              ];
              materials = ["Voting slips", "Ballot box"];
            },
          ];
          discussionQuestions = [
            "Why is it important that everyone gets one vote?",
            "How do we make sure everyone's voice is heard?",
            "What happens if the vote is very close?",
            "How is this different from one person deciding for everyone?",
          ];
          materials = ["Voting slips", "Ballot box"];
          timeCommitment = "10 minutes";
        };
        fridayLesson = {
          title = "Time to Vote!";
          objectives = [
            "Practice live vote counting",
            "Learn about transparent decision making",
            "Understand the importance of recording votes",
            "Experience the finality of group decisions",
          ];
          teacherScript = "Today we'll vote by raising hands for each option. I'll count the votes and enter them so everyone can see the results live.";
          activities = [
            {
              name = "Live Vote Counting";
              description = "Count votes for each option and display results";
              steps = [
                "Count votes for Pizza Party, Extra Recess Week, and New Books",
                "Display live vote counts on Class Display",
                "Highlight the winning option and celebrate",
                "Record the vote on blockchain for transparency",
              ];
              materials = ["Vote counting sheets", "Class Display"];
            },
          ];
          discussionQuestions = [
            "How does it feel to see your vote counted?",
            "Are you happy with the result even if your choice didn't win?",
            "What did we learn about making decisions together?",
            "Why is it important that votes are recorded permanently?",
          ];
          materials = ["Vote counting sheets", "Class Display"];
          timeCommitment = "10 minutes";
        };
        timeCommitment = "20 min/week (10 min Monday + 10 min Friday)";
        learningObjectives = [
          "Understand democratic decision making",
          "Practice group voting skills",
          "Learn about fairness and transparency",
        ];
        isActive = false;
        isCompleted = false;
      },
      {
        weekNumber = 3;
        moduleName = "Savings & Delayed Gratification (Weeks 5-6)";
        mondayLesson = {
          title = "One Marshmallow Now or Two Later?";
          objectives = [
            "Understand the concept of delayed gratification",
            "Learn how saving as a community benefits everyone",
            "Practice making difficult choices between immediate and future rewards",
            "Experience supporting each other through waiting periods",
          ];
          teacherScript = "Our class has earned 800 CubCoins and we expect about 400 more this week, giving us 1,200 total. We have two choices: spend now on a pizza party or save and wait for something bigger and better.";
          activities = [
            {
              name = "Savings Simulation";
              description = "Practice saving and goal setting";
              steps = [
                "Display current situation: 800 CubCoins + ~400 more = 1,200 total",
                "Option A - Spend Now: Pizza Party (1,200 CubCoins), Fund goes to 0, Start saving over again",
                "Option B - Save & Wait: No reward this week, Keep saving our CubCoins, Field Trip in 4 weeks (2,500 CubCoins), More fun, longer lasting experience",
              ];
              materials = ["Savings chart", "Stickers"];
            },
          ];
          discussionQuestions = [
            "Which is harder—getting a reward now or waiting for something better?",
            "What do we give up if we choose the pizza party?",
            "What do we give up if we wait for the field trip?",
            "How can we support each other if we decide to wait?",
          ];
          materials = ["Savings chart", "Stickers"];
          timeCommitment = "10 minutes";
        };
        fridayLesson = {
          title = "Should We Save or Spend?";
          objectives = [
            "Practice making group decisions about spending vs saving",
            "Learn about the consequences of financial choices",
            "Experience the impact of collective decision making",
            "Reflect on the value of patience and planning",
          ];
          teacherScript = "Today we'll vote by raising hands. Should we spend our CubCoins now on a pizza party, or save them for the field trip in 4 weeks?";
          activities = [
            {
              name = "Vote Counting Activity";
              description = "Count votes for spend vs save options";
              steps = [
                "Count votes for Spend Now (Pizza Party) and Save & Wait (Field Trip)",
                "If class votes SAVE: Show countdown to field trip (4 weeks remaining), Track weekly progress toward 2,500 CubCoins goal, Celebrate when goal is reached with field trip",
                "If class votes SPEND: Have pizza party celebration, Reflect on the choice with discussion prompts: 'Was the pizza party worth it?', 'What did we give up by not waiting?', 'How do we feel about starting over?'",
              ];
              materials = ["Vote counting sheets", "Class Display"];
            },
          ];
          discussionQuestions = [
            "What did we learn about making financial choices?",
            "How does it feel to make decisions as a group?",
            "What are the benefits of saving vs spending?",
            "How can we support each other in reaching our goals?",
          ];
          materials = ["Vote counting sheets", "Class Display"];
          timeCommitment = "10 minutes";
        };
        timeCommitment = "20 min/week (10 min Monday + 10 min Friday)";
        learningObjectives = [
          "Understand delayed gratification",
          "Learn about community saving benefits",
          "Practice making difficult choices",
          "Experience group decision making",
        ];
        isActive = false;
        isCompleted = false;
      },
      {
        weekNumber = 4;
        moduleName = "Cross-Classroom Collaboration (Weeks 7-8)";
        mondayLesson = {
          title = "What If We Worked Together?";
          objectives = [
            "Understand how working together with other classes can achieve bigger goals",
            "Learn about cooperation versus competition",
            "Practice making decisions that affect multiple groups",
            "Experience the power of community collaboration",
          ];
          teacherScript = "Our class has 2,800 CubCoins and Mrs. Smith's class has 2,200 CubCoins. We both want the same big reward - a school-wide carnival that costs 5,000 CubCoins. Should we compete against each other or work together?";
          activities = [
            {
              name = "Collaboration Simulation";
              description = "Practice cross-classroom collaboration";
              steps = [
                "Display math comparison: Our Class (2,800 CubCoins), Mrs. Smith's Class (2,200 CubCoins), Separate Progress (56% and 44%), Together (100%)",
                "Show combined progress after 3 weeks: If Separate (Our class ~3,600, Their class ~3,000), If Together (Combined ~6,600 CubCoins)",
                "Discuss benefits of collaboration vs competition",
              ];
              materials = ["Collaboration materials", "Progress charts"];
            },
          ];
          discussionQuestions = [
            "Can we reach 5,000 CubCoins alone before the deadline?",
            "Should we compete against Mrs. Smith's class or cooperate with them?",
            "Is it fair if one class earns more CubCoins than the other?",
            "What could we achieve together that we can't achieve alone?",
          ];
          materials = ["Collaboration materials", "Progress charts"];
          timeCommitment = "10 minutes";
        };
        fridayLesson = {
          title = "Should We Collaborate?";
          objectives = [
            "Practice making group decisions about collaboration",
            "Learn about the benefits and challenges of working together",
            "Experience the impact of collective decision making",
            "Reflect on the value of cooperation",
          ];
          teacherScript = "Today we'll vote on whether to combine our class fund with Mrs. Smith's class to work toward the school carnival together, or continue working separately toward our own goals.";
          activities = [
            {
              name = "Vote Counting Activity";
              description = "Count votes for collaboration vs separate options";
              steps = [
                "Count votes for YES (collaborate) and NO (work separately)",
                "If class votes YES: Arrange joint meeting with Mrs. Smith's class, Combine funds (2,800 + 2,200 = 5,000 CubCoins), Immediate carnival celebration, Plan joint activities and shared rewards",
                "If class votes NO: Continue working separately, Discuss alternative goals we can reach alone, Keep our class identity and individual achievements, Explore other collaboration opportunities",
              ];
              materials = ["Vote counting sheets", "Class Display"];
            },
          ];
          discussionQuestions = [
            "What did we learn about collaboration and competition?",
            "How does it feel to make decisions as a group?",
            "What are the benefits of working together?",
            "How can we balance individual and group goals?",
          ];
          materials = ["Vote counting sheets", "Class Display"];
          timeCommitment = "10 minutes";
        };
        timeCommitment = "20 min/week (10 min Monday + 10 min Friday)";
        learningObjectives = [
          "Understand cross-classroom collaboration",
          "Learn about cooperation vs competition",
          "Practice group decision making",
          "Experience the power of community collaboration",
        ];
        isActive = false;
        isCompleted = false;
      },
    ];

    curriculumProgress := {
      currentWeek = 1;
      modules;
      lastUpdated = Time.now();
    };
  };

  public shared ({ caller }) func startMondayLesson(weekNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can start lessons");
    };

    let curriculumModule = List.find<CurriculumModule>(
      List.fromArray(curriculumProgress.modules),
      func(m) { m.weekNumber == weekNumber },
    );

    switch (curriculumModule) {
      case (?m) {
        activeLessonContent := ?{
          title = m.mondayLesson.title;
          weekTopic = m.moduleName;
          discussionPrompt = m.mondayLesson.discussionQuestions[0];
          votingOptions = [];
        };
        currentDisplayMode := #lessonMode;
        curriculumProgress := {
          curriculumProgress with
          currentWeek = weekNumber;
          lastUpdated = Time.now();
        };
      };
      case null {
        Debug.trap("Module not found");
      };
    };
  };

  public shared ({ caller }) func startFridayLesson(weekNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can start lessons");
    };

    let curriculumModule = List.find<CurriculumModule>(
      List.fromArray(curriculumProgress.modules),
      func(m) { m.weekNumber == weekNumber },
    );

    switch (curriculumModule) {
      case (?m) {
        activeLessonContent := ?{
          title = m.fridayLesson.title;
          weekTopic = m.moduleName;
          discussionPrompt = m.fridayLesson.discussionQuestions[0];
          votingOptions = [];
        };
        currentDisplayMode := #lessonMode;
        curriculumProgress := {
          curriculumProgress with
          currentWeek = weekNumber;
          lastUpdated = Time.now();
        };
      };
      case null {
        Debug.trap("Module not found");
      };
    };
  };

  public shared ({ caller }) func skipToWeek(weekNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can skip weeks");
    };

    curriculumProgress := {
      curriculumProgress with
      currentWeek = weekNumber;
      lastUpdated = Time.now();
    };
  };

  public shared ({ caller }) func restartCurriculum() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can restart curriculum");
    };

    let updatedModules = List.map<CurriculumModule, CurriculumModule>(
      List.fromArray(curriculumProgress.modules),
      func(m) { { m with isCompleted = false } },
    );

    curriculumProgress := {
      currentWeek = 1;
      modules = List.toArray(updatedModules);
      lastUpdated = Time.now();
    };
  };

  public query func getCurriculumProgress() : async CurriculumProgress {
    curriculumProgress;
  };

  public query func getCurriculumModules() : async [CurriculumModule] {
    curriculumProgress.modules;
  };

  public query func getCurrentWeek() : async Nat {
    curriculumProgress.currentWeek;
  };

  public query func getWeeklyStats() : async WeeklyStats {
    let now = Time.now();
    let weekInNanos = 7 * 24 * 60 * 60 * 1_000_000_000;

    let allStudents = Iter.toArray(principalMap.vals(studentAccounts));
    let totalStudents = allStudents.size();

    let studentsContributed = List.size(
      List.filter<StudentAccount>(
        List.fromArray(allStudents),
        func(student) {
          switch (student.lastActivity) {
            case (?lastActivity) {
              now - lastActivity <= weekInNanos;
            };
            case null { false };
          };
        },
      )
    );

    let totalCubCoinsEarned = List.foldLeft<Transaction, Nat>(
      List.filter<Transaction>(
        List.fromArray(classFund.transactions),
        func(t) { t.timestamp >= now - weekInNanos },
      ),
      0,
      func(acc, t) { acc + t.amount },
    );

    {
      classFundBalance = classFund.totalAmount;
      studentsContributed;
      totalStudents;
      totalCubCoinsEarned;
    };
  };

  public query func getPresetAmounts() : async [Nat] {
    presetAmounts;
  };

  public shared ({ caller }) func updatePresetAmounts(newAmounts : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can update preset amounts");
    };
    presetAmounts := newAmounts;
  };

  public query func getPresetReasons() : async [Text] {
    presetReasons;
  };

  public shared ({ caller }) func addCustomReason(reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can add custom reasons");
    };
    presetReasons := Array.append(presetReasons, [reason]);
  };

  public shared ({ caller }) func updateReason(index : Nat, newReason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can update reasons");
    };

    if (index >= presetReasons.size()) {
      Debug.trap("Invalid reason index");
    };

    let updatedReasons = Array.tabulate<Text>(
      presetReasons.size(),
      func(i) {
        if (i == index) { newReason } else { presetReasons[i] };
      },
    );
    presetReasons := updatedReasons;
  };

  public shared ({ caller }) func deleteReason(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only teachers can delete reasons");
    };

    if (index >= presetReasons.size()) {
      Debug.trap("Invalid reason index");
    };

    let filteredReasons = List.filter<Text>(
      List.fromArray(presetReasons),
      func(_reason) { true },
    );
    presetReasons := List.toArray(filteredReasons);
  };
};

