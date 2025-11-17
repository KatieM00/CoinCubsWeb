// @ts-nocheck
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// lucide-react removed
import { useGetCurriculumProgress, useGetClassAchievements, useGetParentChildren, useValidateClassCode, useAddChildEnrollment, useUpdateParentProfile, useGetNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import PDFFormViewer from '../components/PDFFormViewer';

export default function ParentPortalPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('learning');
  const [selectedChild] = useState('Emma Johnson');

  // Add Child Dialog State
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');
  const [childDOB, setChildDOB] = useState('');
  const [classCode, setClassCode] = useState('');
  const [validatedClass, setValidatedClass] = useState<any>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [parentName, setParentName] = useState(profile?.full_name || 'Sarah Johnson');
  const [parentEmail] = useState(profile?.email || 'sarah.johnson@email.com');
  const [parentPhone, setParentPhone] = useState('(555) 123-4567');

  // PDF Form Viewer State
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<{
    title: string;
    description: string;
    isViewOnly: boolean;
    formId?: string;
  } | null>(null);

  // Mock forms data
  const mockForms = [
    {
      id: 'field-trip-2025',
      title: 'Field Trip Permission Slip',
      description: 'Science Museum - December 10, 2025',
      status: 'pending',
      dueDate: 'December 3, 2025',
    },
    {
      id: 'photo-release-2025',
      title: 'Photo Release Form',
      description: 'Annual photo consent for school publications',
      status: 'pending',
      dueDate: 'December 15, 2025',
    },
  ];

  const mockCompletedForms = [
    {
      id: 'emergency-contact-2025',
      title: 'Emergency Contact Form',
      signedDate: 'Nov 20, 2025',
    },
    {
      id: 'medical-info-2025',
      title: 'Medical Information',
      signedDate: 'Oct 15, 2025',
    },
  ];

  const { data: curriculumProgress } = useGetCurriculumProgress();
  const { data: achievements } = useGetClassAchievements();
  const { data: enrolledChildren } = useGetParentChildren();
  const { data: notificationPrefs } = useGetNotificationPreferences();
  const validateClassCode = useValidateClassCode();
  const addChildEnrollment = useAddChildEnrollment();
  const updateParentProfile = useUpdateParentProfile();
  const updateNotificationPrefs = useUpdateNotificationPreferences();

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(notificationPrefs?.email_notifications ?? true);
  const [smsNotifications, setSmsNotifications] = useState(notificationPrefs?.sms_notifications ?? true);
  const [achievementNotifications, setAchievementNotifications] = useState(notificationPrefs?.achievement_notifications ?? true);
  const [formNotifications, setFormNotifications] = useState(notificationPrefs?.form_notifications ?? true);

  // Update local state when preferences load from database
  useEffect(() => {
    if (notificationPrefs) {
      setEmailNotifications(notificationPrefs.email_notifications ?? true);
      setSmsNotifications(notificationPrefs.sms_notifications ?? true);
      setAchievementNotifications(notificationPrefs.achievement_notifications ?? true);
      setFormNotifications(notificationPrefs.form_notifications ?? true);
    }
  }, [notificationPrefs]);

  // Handle class code validation
  const handleValidateClassCode = async () => {
    if (!classCode.trim()) {
      toast.error('Please enter a class code');
      return;
    }

    try {
      const classData = await validateClassCode.mutateAsync(classCode.trim());
      setValidatedClass(classData);
      toast.success(`Found class: ${classData.class_name}`);
    } catch (error: any) {
      setValidatedClass(null);
      toast.error(error.message || 'Invalid class code');
    }
  };

  // Handle add child submission
  const handleAddChild = async () => {
    if (!childFirstName.trim() || !childLastName.trim() || !childDOB || !validatedClass) {
      toast.error('Please fill in all fields and validate the class code');
      return;
    }

    try {
      await addChildEnrollment.mutateAsync({
        classId: validatedClass.id,
        firstName: childFirstName.trim(),
        lastName: childLastName.trim(),
        dateOfBirth: childDOB,
      });

      toast.success(`${childFirstName} ${childLastName} added successfully!`);

      // Reset form
      setAddChildDialogOpen(false);
      setChildFirstName('');
      setChildLastName('');
      setChildDOB('');
      setClassCode('');
      setValidatedClass(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add child');
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      await updateParentProfile.mutateAsync({
        fullName: parentName,
        phone: parentPhone,
      });

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Handle opening form for signature
  const handleOpenForm = (formId: string, formTitle: string, formDescription: string) => {
    setCurrentForm({
      title: formTitle,
      description: formDescription,
      isViewOnly: false,
      formId,
    });
    setPdfViewerOpen(true);
  };

  // Handle viewing completed form
  const handleViewForm = (formId: string, formTitle: string) => {
    setCurrentForm({
      title: formTitle,
      description: 'Completed form',
      isViewOnly: true,
      formId,
    });
    setPdfViewerOpen(true);
  };

  // Handle form signature submission
  const handleSignForm = async (signatureData: string) => {
    if (!currentForm?.formId) return;

    // In a real app, this would save to the database
    console.log('Form signed:', {
      formId: currentForm.formId,
      signatureData: signatureData.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
    });

    // Mock delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Handle save notification preferences
  const handleSavePreferences = async () => {
    try {
      await updateNotificationPrefs.mutateAsync({
        emailNotifications,
        smsNotifications,
        achievementNotifications,
        formNotifications,
      });

      toast.success('Notification preferences saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save preferences');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#3E2723] mb-2">
          Welcome Back!
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay connected with your child's learning journey
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="learning" className="gap-2 py-3">
            📚
            <span className="hidden sm:inline">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 py-3">
            💳
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-2 py-3">
            📄
            <span className="hidden sm:inline">Forms</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2 py-3">
            📖
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 py-3">
            👤
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#E8C391]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Learning Progress</CardTitle>
                  <CardDescription>Track {selectedChild}'s educational journey</CardDescription>
                </div>
                🏅
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Week Overview */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-6 border border-[#E8C391]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    📚
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#3E2723] mb-2">
                      Week {curriculumProgress?.currentWeek.toString() || '1'}: Financial Literacy
                    </h3>
                    <p className="text-[#5D4037] mb-4">
                      This week, the class is learning about <strong>earning and saving</strong>.
                      Students are exploring how to make good financial decisions and work together
                      toward shared goals.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-[#E8C391]/30 text-[#3E2723]">
                        Teamwork
                      </Badge>
                      <Badge variant="secondary" className="bg-[#E8C391]/30 text-[#3E2723]">
                        Decision Making
                      </Badge>
                      <Badge variant="secondary" className="bg-[#E8C391]/30 text-[#3E2723]">
                        Community Goals
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Child's Contributions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  📈
                  {selectedChild}'s Positive Contributions
                </h3>
                <div className="space-y-3">
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        ✅
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Helped a classmate with math</p>
                          <p className="text-sm text-green-700 mt-1">
                            Emma showed great teamwork by helping another student understand fractions. 
                            This earned 10 ClassGems for the class fund!
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        ✅
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Perfect homework completion</p>
                          <p className="text-sm text-green-700 mt-1">
                            Excellent work on the weekly assignment! Emma's dedication contributed 
                            15 ClassGems to help the class reach their goal.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">5 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Class Achievements */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  🏅
                  Recent Class Achievements
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {achievements && achievements.length > 0 ? (
                    achievements.slice(0, 4).map((achievement) => (
                      <Card key={achievement.id.toString()} className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">{achievement.name}</p>
                              <p className="text-sm text-amber-700 mt-1">{achievement.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">🏆</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">First Goal Reached!</p>
                              <p className="text-sm text-amber-700 mt-1">
                                The class worked together to reach their first savings goal. Amazing teamwork!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-amber-200 bg-amber-50/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">🤝</div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">Kindness Champions</p>
                              <p className="text-sm text-amber-700 mt-1">
                                Everyone in the class helped each other this week. What a caring community!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#E8C391]">
            <CardHeader>
              <CardTitle className="text-2xl">Payment Management</CardTitle>
              <CardDescription>View and manage school expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upcoming Expenses */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming Expenses</h3>
                <div className="space-y-3">
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive" className="bg-orange-600">
                              ⏰
                              Due in 3 days
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Field Trip Permission & Fee</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Science Museum visit - Transportation and admission included
                          </p>
                          <p className="text-2xl font-bold text-orange-600 mt-2">$25.00</p>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Pay Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-[#E8C391] bg-[#FFF8E7]/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-[#E8C391]/30 text-[#3E2723]">
                              📅
                              Due Dec 15
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Class Party Contribution</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Optional contribution for end-of-semester celebration
                          </p>
                          <p className="text-2xl font-bold text-[#5D4037] mt-2">$15.00</p>
                        </div>
                        <Button variant="outline" className="border-[#5D4037] text-[#5D4037]">
                          Pay Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      ✅
                      <div>
                        <p className="font-medium">School Supplies</p>
                        <p className="text-sm text-muted-foreground">Paid on Nov 15, 2025</p>
                      </div>
                    </div>
                    <p className="font-semibold">$45.00</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      ✅
                      <div>
                        <p className="font-medium">Book Fair</p>
                        <p className="text-sm text-muted-foreground">Paid on Oct 28, 2025</p>
                      </div>
                    </div>
                    <p className="font-semibold">$20.00</p>
                  </div>
                </div>
              </div>

              {/* Secure Payments */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-6 border border-[#E8C391]">
                <div className="flex items-start gap-4">
                  🔒
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
                      Secure Online Payments
                    </h3>
                    <p className="text-[#5D4037] mb-4">
                      Soon you'll be able to make secure, transparent payments directly through the platform.
                      All transactions will be verified and recorded for complete transparency.
                    </p>
                    <Button disabled variant="outline" className="border-[#5D4037] text-[#5D4037]">
                      🔒
                      Set Up Payment Method (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#E8C391]">
            <CardHeader>
              <CardTitle className="text-2xl">Forms & Permissions</CardTitle>
              <CardDescription>Review and sign digital forms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Forms */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Forms Requiring Action</h3>
                <div className="space-y-3">
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive" className="bg-orange-600">
                              ⚠️
                              Signature Required
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Field Trip Permission Slip</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Science Museum - December 10, 2025
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Due: December 3, 2025</p>
                        </div>
                        <Button
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleOpenForm('field-trip-2025', 'Field Trip Permission Slip', 'Science Museum - December 10, 2025')}
                        >
                          Review & Sign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#E8C391] bg-[#FFF8E7]/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-[#E8C391]/30 text-[#3E2723]">
                              ⏰
                              Pending
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg">Photo Release Form</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Annual photo consent for school publications
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Due: December 15, 2025</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-[#5D4037] text-[#5D4037]"
                          onClick={() => handleOpenForm('photo-release-2025', 'Photo Release Form', 'Annual photo consent for school publications')}
                        >
                          Review & Sign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Completed Forms */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Completed Forms</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      ✅
                      <div>
                        <p className="font-medium">Emergency Contact Form</p>
                        <p className="text-sm text-muted-foreground">Signed on Nov 20, 2025</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewForm('emergency-contact-2025', 'Emergency Contact Form')}
                    >
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      ✅
                      <div>
                        <p className="font-medium">Medical Information</p>
                        <p className="text-sm text-muted-foreground">Signed on Oct 15, 2025</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewForm('medical-info-2025', 'Medical Information')}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Digital Signatures Info */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-6 border border-[#E8C391]">
                <div className="flex items-start gap-4">
                  🔒
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
                      Secure Digital Signatures
                    </h3>
                    <p className="text-[#5D4037] mb-4">
                      All digital signatures are secured with industry-standard encryption,
                      ensuring security, verification, and permanent record-keeping. Your signatures
                      are legally binding and cryptographically secured.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-[#5D4037]">
                      ✅
                      <span>Cryptographically verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#E8C391]">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-name">Full Name</Label>
                      <Input
                        id="parent-name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-email">Email</Label>
                      <Input
                        id="parent-email"
                        type="email"
                        value={parentEmail}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-phone">Phone Number</Label>
                    <Input
                      id="parent-phone"
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  {!isEditingProfile ? (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                      ✏️
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={updateParentProfile.isPending}>
                        {updateParentProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setParentName(profile?.full_name || 'Sarah Johnson');
                          setParentPhone('(555) 123-4567');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Children Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Children</h3>
                  <Dialog open={addChildDialogOpen} onOpenChange={setAddChildDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        ➕
                        Add Child
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add Child</DialogTitle>
                        <DialogDescription>
                          Enter your child's information and their class code to connect them to this account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="child-first-name">First Name</Label>
                            <Input
                              id="child-first-name"
                              placeholder="Emma"
                              value={childFirstName}
                              onChange={(e) => setChildFirstName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="child-last-name">Last Name</Label>
                            <Input
                              id="child-last-name"
                              placeholder="Johnson"
                              value={childLastName}
                              onChange={(e) => setChildLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="child-dob">Date of Birth</Label>
                          <Input
                            id="child-dob"
                            type="date"
                            value={childDOB}
                            onChange={(e) => setChildDOB(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class-code">Class Code</Label>
                          <div className="flex gap-2">
                            <Input
                              id="class-code"
                              placeholder="LIONS-2025"
                              value={classCode}
                              onChange={(e) => {
                                setClassCode(e.target.value.toUpperCase());
                                setValidatedClass(null);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleValidateClassCode}
                              disabled={validateClassCode.isPending || !classCode.trim()}
                            >
                              {validateClassCode.isPending ? 'Validating...' : 'Validate'}
                            </Button>
                          </div>
                          {validatedClass && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              ✅
                              <span>Valid class: {validatedClass.class_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAddChildDialogOpen(false);
                            setChildFirstName('');
                            setChildLastName('');
                            setChildDOB('');
                            setClassCode('');
                            setValidatedClass(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddChild}
                          disabled={
                            !childFirstName.trim() ||
                            !childLastName.trim() ||
                            !childDOB ||
                            !validatedClass ||
                            addChildEnrollment.isPending
                          }
                        >
                          {addChildEnrollment.isPending ? 'Adding...' : 'Add Child'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-3">
                  {enrolledChildren && enrolledChildren.length > 0 ? (
                    enrolledChildren.map((child, index) => (
                      <Card key={child.id} className={index === 0 ? "border-[#E8C391] bg-[#FFF8E7]/50" : "border-gray-200"}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{child.child_first_name} {child.child_last_name}</p>
                              <p className="text-sm text-muted-foreground">{child.class_name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                ✏️
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="border-[#E8C391] bg-[#FFF8E7]/50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Emma Johnson</p>
                              <p className="text-sm text-muted-foreground">Grade 4 - Mrs. Smith's Class</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                ✏️
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Liam Johnson</p>
                              <p className="text-sm text-muted-foreground">Grade 2 - Mr. Davis's Class</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                ✏️
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment Methods */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Payment Methods</h3>
                  <Button variant="outline" size="sm">
                    ➕
                    Add Payment Method
                  </Button>
                </div>
                <div className="space-y-3">
                  <Card className="border-[#E8C391] bg-[#FFF8E7]/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          💳
                          <div>
                            <p className="font-semibold">Visa •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Default</Badge>
                          <Button variant="ghost" size="sm">
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm">
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      📧
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Weekly updates and important alerts</p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      📱
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Payment reminders and urgent updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      🔔
                      <div>
                        <p className="font-medium">Achievement Notifications</p>
                        <p className="text-sm text-muted-foreground">When your child earns recognition</p>
                      </div>
                    </div>
                    <Switch
                      checked={achievementNotifications}
                      onCheckedChange={setAchievementNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      📄
                      <div>
                        <p className="font-medium">Form Alerts</p>
                        <p className="text-sm text-muted-foreground">New forms requiring signature</p>
                      </div>
                    </div>
                    <Switch
                      checked={formNotifications}
                      onCheckedChange={setFormNotifications}
                    />
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={handleSavePreferences}
                  disabled={updateNotificationPrefs.isPending}
                >
                  {updateNotificationPrefs.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-[#E8C391]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Financial Education Resources</CardTitle>
                  <CardDescription>Free UK resources to support your child's financial literacy journey at home</CardDescription>
                </div>
                📖
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Money Heroes */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    🦸
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">Money Heroes (Young Enterprise)</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Financial education programme for children aged 3–11. Provides free parent resources, activities, games, storybooks, and guidance on teaching money skills at home.
                    </p>
                    <a
                      href="https://moneyheroes.org.uk/resources/parents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* Just Finance Foundation */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    💡
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">Just Finance Foundation – Resource Hub</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      UK charity offering free financial wellbeing resources, including family activities, money conversation guides, and age-appropriate learning tools.
                    </p>
                    <a
                      href="https://www.justfinancefoundation.org.uk/resource-hub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* HSBC UK */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    🏦
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">HSBC UK – Financial Education for Children</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Free worksheets, lesson activities, videos, and parent guides covering wants vs needs, saving, planning, and money basics for ages 3–7+.
                    </p>
                    <a
                      href="https://www.hsbc.co.uk/financial-education/teach-kids-about-money/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* Make Sense of Pence */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    💰
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">Make Sense of Pence</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Free UK resource hub for families and educators with tools for teaching saving, digital payments, budgeting, and money awareness at home.
                    </p>
                    <a
                      href="https://makesenseofpence.co.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* bMoneywize */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    📊
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">bMoneywize</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      UK non-profit offering free digital financial education tools, downloads, and activities for children and families, including budgeting and money-skills worksheets.
                    </p>
                    <a
                      href="https://bmoneywize.co.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* FT FLIC Learning Hub */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    📰
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">FT FLIC Learning Hub (Financial Times)</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Free library of financial literacy lessons, activities, and at-home learning modules for parents and children.
                    </p>
                    <a
                      href="https://resources.ftflic.com/free-financial-literacy-resources/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* Money Confident Kids */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    🎯
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">Money Confident Kids</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Free online programme helping children learn goal setting, decision making, inflation basics, and saving habits. Contains videos and interactive lessons.
                    </p>
                    <a
                      href="https://www.moneyconfidentkids.com/gb/en.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>

              {/* FoolProof Foundation */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#E8C391]/30 rounded-lg p-4 border border-[#E8C391]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shrink-0">
                    🛡️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#3E2723] mb-1">FoolProof Foundation</h3>
                    <p className="text-[#5D4037] text-sm mb-3">
                      Free consumer life-skills and financial education modules for youth and families, focusing on critical thinking and safe money habits.
                    </p>
                    <a
                      href="https://www.foolproofme.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#5D4037] font-medium hover:text-[#3E2723] underline"
                    >
                      🔗 Visit Resource
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PDF Form Viewer */}
      {currentForm && (
        <PDFFormViewer
          open={pdfViewerOpen}
          onOpenChange={setPdfViewerOpen}
          formTitle={currentForm.title}
          formDescription={currentForm.description}
          isViewOnly={currentForm.isViewOnly}
          onSign={handleSignForm}
        />
      )}
    </div>
  );
}
